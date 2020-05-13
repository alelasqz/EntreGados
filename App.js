import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Alert, SafeAreaView  } from 'react-native';
import firebase from 'react-native-firebase'

export default class App extends React.Component {

    UNSAFE_componentWillMount(){
        this.notificationListener()
        this.notificationOpenedListener()
    }

    componentDidMount(){
        this.checkPermission()
        this.createNotificationListeners()
        this.notificationOpenBackListener()
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    };

    async createNotificationListeners() {
        this.notificationListener = await firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
    
        this.notificationOpenedListener = await firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
    
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // alert('notificationOpen:'+ JSON.stringify(notificationOpen) )
            console.log(notificationOpen)
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }

        this.messageListener = await firebase.messaging().onMessage((message) => {
            alert(JSON.stringify(message));
        });
    }

    async getToken(){
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    };

    async notificationOpenBackListener(){
        const notificationOpenBack = await firebase.notifications().getInitialNotification();
        if (notificationOpenBack) {
            alert('Lo que codigo considere:'+ JSON.stringify(notificationOpenBack) )
        }
    };

    notificationListener = () => {
        firebase.notifications().onNotification(notification => {
            const {
            notifications: {
                Android: {
                Priority: { Max }
                }
            }
            } = firebase;
            notification.android.setChannelId('NotificacionCanal');
            notification.android.setPriority(Max);
            notification.setData(notification.data);
            firebase.notifications().displayNotification(notification);
        });
    }

    notificationOpenedListener = () => {
        firebase.notifications().onNotificationOpened(notificationOpen => {
            alert('LLamado desde afuera')
        });
    }

    requestPermission = async () => {
        firebase
            .messaging()
            .requestPermission()
            .then(() => {
                this.getToken();
            })
            .catch(error => {
                alert(`${error} permission rejected`);
            });
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SafeAreaView>
                    <Text>Hola Mundo !</Text>
                </SafeAreaView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
  
});


