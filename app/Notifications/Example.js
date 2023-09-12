import React from 'react';
import {
	TextInput,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Alert,
} from 'react-native';
import NotifService from './NotifService';
import * as ExpoNotifications from 'expo-notifications';

export default class NotificationScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications_permitted: false
		};

		this.notif = new NotifService(
			this.onRegister.bind(this),
			this.onNotif.bind(this),
		);
	}
	
	mounted = 0;
	async componentDidMount(){
		if(!this.mounted)
		{
			this.mounted = 1;
			this.registerForPushNotificationsAsync();			
		}
	}

	async registerForPushNotificationsAsync(mannual=0) {
        let token;
        const {status} = await ExpoNotifications.getPermissionsAsync();
        let finalStatus = status;
        if (finalStatus !== 'granted') {			
            const { status } = await ExpoNotifications.requestPermissionsAsync();			
            finalStatus = status;
        }
		console.log('Notification permission status', status);
        if (finalStatus !== 'granted') {
            return 'Error: 403  not permitted';;
        }
		else{			
			if(mannual == 1){
				this.setState({notifications_permitted: true});
			}
			else{
				this.state.notifications_permitted = true;
			}
		}		
        try{
            let expo_token = await ExpoNotifications.getExpoPushTokenAsync();
            token = expo_token.data;
            console.log('Obtained Push Token: '+token);
            return token;
        }
        catch(er){
            //console.log('Full error in getExpoPushTokenAsync', er);
            return 'Error: Failed at .getExpoPushTokenAsync';
        }
    }

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>
					Set Alarm
				</Text>
				<View style={styles.spacer}></View>
				<TextInput
					style={styles.textField}
					value={this.state.registerToken}
					placeholder="Register token"
				/>
				<View style={styles.spacer}></View>

				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.makeLocalNotification();
					}}>
					<Text>Local Notification (now)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.makeLocalNotification('s4.mp3');
					}}>
					<Text>Local Notification with sound (now)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.scheduleNotif();
					}}>
					<Text>Schedule Notification in 30s</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.scheduleNotif('as2.wav');
					}}>
					<Text>Schedule Notification with sound in 30s</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.cancelNotif();
					}}>
					<Text>Cancel last notification (if any)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.cancelAll();
					}}>
					<Text>Cancel all notifications</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.checkPermission(this.handlePerm.bind(this));
					}}>
					<Text>Check Permission</Text>
				</TouchableOpacity>
				{
				!this.state.notifications_permitted ? 
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.registerForPushNotificationsAsync(1);
					}}>
					<Text>Request Permissions</Text>
				</TouchableOpacity> : <></>
				}
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.getDeliveredNotifications(notifs => console.log(notifs));
					}}>
					<Text>Console.Log Delivered Notifications</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.popInitialNotification();
					}}>
					<Text>popInitialNotification</Text>
				</TouchableOpacity>

				<View style={styles.spacer}></View>

				{this.state.fcmRegistered && <Text>FCM Configured !</Text>}

				<View style={styles.spacer}></View>
			</View>
		);
	}

	onRegister(token) {
		this.setState({ registerToken: token.token, fcmRegistered: true });
	}

	onNotif(notif) {
		Alert.alert(notif.title, notif.message);
	}

	handlePerm(perms) {
		Alert.alert('Permissions', JSON.stringify(perms));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	button: {
		borderWidth: 1,
		borderColor: '#000000',
		margin: 5,
		padding: 5,
		width: '70%',
		backgroundColor: '#DDDDDD',
		borderRadius: 5,
	},
	textField: {
		borderWidth: 1,
		borderColor: '#AAAAAA',
		margin: 5,
		padding: 5,
		width: '70%',
	},
	spacer: {
		height: 10,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
	},
});