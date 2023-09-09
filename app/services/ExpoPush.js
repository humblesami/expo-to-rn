import React from 'react';
import * as Notifications from 'expo-notifications';
import rnStorage from './rnStorage';
import { AjaxClient } from './ajax';
import LoaderElement from './LoaderElement';
import Statemanager from './asyncActivitiesTrack';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default class ExpoPush extends React.Component {
    constructor(attributes) {
        let api_base_url = attributes.api_base_url || 'http://127.0.0.1:9000'; 
        // api_base_url = 'https://dap.92newshd.tv';
        super(attributes);
        this.resListener = {};
        this.pushListener = {};
        this.api_base_url = api_base_url;
        let home_state = {
            tokenSent: 0,
            expoToken: '',
            loading: {},
            subscriptions: [],
            copyBtnLabel: 'Copy token',
        };
        this.state = home_state;
        this.props = attributes;
        this.setUpNotifications().then(null);
    }

    async componentDidMount(){
        this.mounted = 1;
    }

    async registerForPushNotificationsAsync() {
        let token;
        const {status} = await Notifications.getPermissionsAsync();
        console.log('Notification permission status', status);
        let finalStatus = status;
        if (finalStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return 'Error: 403 Notifications not permitted';;
        }
        try{
            let expo_token = await Notifications.getExpoPushTokenAsync();
            token = expo_token.data;
            //console.log('Obtained Push Token: '+token);
            return token;
        }
        catch(er){
            console.log('Full error in getExpoPushTokenAsync', er);
            return 'Error: Failed at Notifications.getExpoPushTokenAsync';
        }
    }

    async setUpNotifications() {
        let obj_this = this;
        let activity_id1 = '/device/register';
        Statemanager.update_loaders('add', '/notifications' + activity_id1, 'init', 100);
        if(this.mounted) this.setState({});
        let pushToken = await this.registerForPushNotificationsAsync();
        obj_this.state.expoToken = pushToken;
        if(!pushToken){
            Statemanager.update_loaders(0, '/notifications' + activity_id1, 'no token');
            if(this.mounted) this.setState({});
            alert('Failed to get push token');
            return;
        }
        if (pushToken.startsWith('Error:')) {
            Statemanager.update_loaders(0, '/notifications' + activity_id1, 'error in token');            
            if(this.mounted) this.setState({});
            console.log('pushToken obtained', pushToken);
            return;
        }
        Statemanager.update_loaders(0, '/notifications' + activity_id1, 'done with token');
        if(this.mounted) this.setState({});
        obj_this.submit_token(pushToken);

        this.pushListener = Notifications.addNotificationReceivedListener(notification => {
            const { data, body } = notification.request.content;
            let message = body.trim();
            let channel = notification.request.trigger.channelId;
            console.log(channel + ' received => '+message);
            console.log("\n", notification);
            return notification.request.content.categoryIdentifier;
        });
        this.resListener = Notifications.addNotificationResponseReceivedListener(response => response.notification.request.content);

        //this.test_notifications();

        return () => {
            Notifications.removeNotificationSubscription(obj_this.pushListener);
            Notifications.removeNotificationSubscription(obj_this.resListener);
        };
    }

    test_notifications() {
        Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail!",
                body: 'Open the notification to read them all',
            },
            trigger: {
                seconds: 1,
                channelId: 'down_alerts',
            },
        });
    }        

    async submit_token(obtained_token, endpoint = '') {        
        if (!obtained_token) {
            alert('No token provided');
            return;
        }
        let obj_this = this;
        if (!endpoint) endpoint = '/expo/submit';
        let api_options = {
            time_limit: 15,
            api_base_url: obj_this.api_base_url,
            name: 'Authentication',
            header_tokens: { token_type: 'auth' }
        };
        //console.log('Submitting token');
        let api_client = new AjaxClient(api_options);
        Statemanager.update_loaders('add', endpoint);
        if(this.mounted) this.setState({});
        api_client.on_api_success = function (res_data) {
            obj_this.onTokenSubmitted(res_data, obtained_token);
        };
        api_client.on_api_error = function (error_message) {
            obj_this.showAlert('Warning', error_message, 'Error in submit token');
        }
        api_client.on_api_complete = function(){
            Statemanager.update_loaders('del', endpoint);
            if(obj_this.mounted) obj_this.setState({});
        }
        api_client.post_data(endpoint, { posted_token: obtained_token, app_id: obj_this.appId });
    }

    onTokenSubmitted(res_data, obtained_token) {
        //console.log('Authorized with => ' + obtained_token, res_data);
        if (!res_data.channels.length) {
            this.showAlert('Warning', 'No channels in response to submit token');
        }
        rnStorage.save('push_token', obtained_token).then(() => { });
        rnStorage.save('auth_token', res_data.auth_token).then(() => { });
        if(this.props.onTokenRegistered)
        {            
            this.props.onTokenRegistered(obtained_token, res_data);
        }
        else{
            console.log('onTokenRegistered is not implmented');
        }
        let channel_options = {
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        }     
        if (Platform.OS === 'android') {
            let channel_options1 = { name: 'down_alerts'};
            let channel_options2 = {name: 'hope_chat'};
            Object.keys(channel_options).forEach((key) => { 
                channel_options1[key] = channel_options[key];
                channel_options2[key] = channel_options[key];
            });
            Notifications.setNotificationChannelAsync(channel_options1.name, channel_options1);
            Notifications.setNotificationChannelAsync(channel_options2.name, channel_options2);            
        }
    }

    render() {
        return (<LoaderElement activities={Statemanager.list} />);
    }
}
