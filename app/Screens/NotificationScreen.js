import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Platform,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import {
    Notifications,
    NotificationAction,
    NotificationCategory,
    NotificationBackgroundFetchResult,
    Notification,
} from 'react-native-notifications';

export default function NotificationsExample() {
    const [notifications, setNotifications] = useState([]);
    const [openedNotifications, setOpenedNotifications] = useState([]);

    useEffect(() => {
        registerNotificationEvents();
        setCategories();
        getInitialNotification();
    }, [])

    const registerNotificationEvents = () => {
        Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
            setNotifications([...notifications, notification]);
            completion({ alert: notification.payload.showAlert, sound: false, badge: false });
        });

        Notifications.events().registerNotificationOpened((notification, completion) => {
            setOpenedNotifications([notification, ...openedNotifications]);
            completion();
        });

        Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
            completion(NotificationBackgroundFetchResult.NO_DATA);
        });

        if (Platform.OS === 'ios') {
            Notifications.ios.events().appNotificationSettingsLinked(() => {
                console.warn('App Notification Settings Linked')
            });
        }
    }

    const requestIosPermissions = (options) => {
        Notifications.ios.registerRemoteNotifications(
            Object.fromEntries(options.map(opt => [opt, true]))
        );
    }

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const res1 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                Notifications.registerRemoteNotifications();
                Alert.alert(res1);
            } catch (error) {
                console.log(error);
            }
        }        
    }

    const setCategories = () => {
        const upvoteAction = new NotificationAction(
            'UPVOTE_ACTION',
            'background',
            String.fromCodePoint(0x1F44D),
            false,
        );

        const replyAction = new NotificationAction(
            'REPLY_ACTION',
            'background',
            'Reply',
            true,
            {
                buttonTitle: 'Reply now',
                placeholder: 'Insert message'
            },
        );


        const category = new NotificationCategory(
            'SOME_CATEGORY',
            [upvoteAction, replyAction]
        );

        Notifications.setCategories([category]);
    }

    const sendLocalNotification = () => {
        console.log('notes');
        Notifications.postLocalNotification({
            identifier: '0',
            body: 'Local notification!',
            title: 'Local Notification Title',
            sound: 's4.mp3',
            badge: 0,
            type: '',
            thread: '',
            payload: {
                category: 'SOME_CATEGORY',
                link: 'localNotificationLink',
                android_channel_id: 'my-channel',
            }
        });
    }

    const removeAllDeliveredNotifications = () => {
        Notifications.removeAllDeliveredNotifications();
    }

    const setNotificationChannel = () => {
        Notifications.setNotificationChannel({
            channelId: 'my-channel',
            name: 'My Channel',
            groupId: 'my-group-id',
            groupName: 'my group name',
            importance: 5,
            description: 'My Description',
            enableLights: true,
            enableVibration: true,
            showBadge: true,
            soundFile: 'doorbell.mp3',
            vibrationPattern: [200, 1000, 500, 1000, 500],
        })
    }

    const getInitialNotification = async () => {
        const initialNotification = await Notifications.getInitialNotification();
        if (initialNotification) {
            setNotifications([initialNotification, ...notifications]);
        }
    }

    const renderNotification = (notification) => {
        return (
            <View style={{ backgroundColor: 'lightgray', margin: 10 }}>
                <Text>{`Title: ${notification.title}`}</Text>
                <Text>{`Body: ${notification.body}`}</Text>
                <Text>{`Extra Link Param: ${notification.payload.link}`}</Text>
            </View>
        );
    }

    const renderOpenedNotification = (notification) => {
        return (
            <View style={{ backgroundColor: 'lightgray', margin: 10 }}>
                <Text>{`Title: ${notification.title}`}</Text>
                <Text>{`Body: ${notification.body}`}</Text>
                <Text>{`Notification Clicked: ${notification.payload.link}`}</Text>
            </View>
        );
    }

    const checkPermissions = () => {
        Notifications.ios.checkPermissions().then((currentPermissions) => {
            Alert.alert(currentPermissions.toString());
        });
    }

    const isRegistered = () => {
        Notifications.isRegisteredForRemoteNotifications().then((registered) => {
            Alert.alert(registered.toString());
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.button}>
                <Button title={'Request permissions'} onPress={requestPermissions} testID={'requestPermissions'} />
            </View>

            {Platform.OS === 'ios' && Platform.Version > '12.0' && (<>
                <View style={styles.button}>
                    <Button title={'Request permissions with app notification settings'} onPress={() => requestIosPermissions(['providesAppNotificationSettings'])} testID={'requestPermissionsWithAppSettings'} />
                </View>
                <View style={styles.button}>
                    <Button title={'Request permissions with provisional'} onPress={() => requestIosPermissions(['provisional'])} testID={'requestPermissionsWithAppSettings'} />
                </View>
                <View style={styles.button}>
                    <Button title={'Request permissions with app notification settings and provisional'} onPress={() => requestIosPermissions(['providesAppNotificationSettings', 'provisional'])} testID={'requestPermissionsWithAppSettings'} />
                </View>
                <View style={styles.button}>
                    <Button title={'Check permissions'} onPress={checkPermissions} />
                </View>
            </>)}
            {Platform.OS === 'android' &&
                <View style={styles.button}>
                    <Button title={'Set channel'} onPress={setNotificationChannel} testID={'setNotificationChannel'} />
                </View>
            }
            <View style={styles.button}>
                <Button title={'Send local notification'} onPress={sendLocalNotification} testID={'sendLocalNotification'} />
            </View>

            <View style={styles.button}>
                <Button title={'Remove all delivered notifications'} onPress={removeAllDeliveredNotifications} />
            </View>
            <View style={styles.button}>
                <Button title={'Check registration'} onPress={isRegistered} />
            </View>

            {notifications.map((notification, idx) => (
                <View key={`notification_${idx}`}>
                    {renderNotification(notification)}
                </View>
            ))}
            {openedNotifications.map((notification, idx) => (
                <View key={`notification_${idx}`}>
                    {renderOpenedNotification(notification)}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        margin: 10
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});