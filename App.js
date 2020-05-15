import React, {Component} from 'react';
import { StyleSheet, View, Text, AsyncStorage, Alert, SafeAreaView, TouchableOpacity, Button  } from 'react-native';
import firebase from 'react-native-firebase'

console.disableYellowBox = true

// var firebaseConfig = {
//     apiKey: "AIzaSyCAmBAj9dlb06its74dRxnDBcOc16mKGG4",
//     authDomain: "entregados-e7d37.firebaseapp.com",
//     databaseURL: "https://entregados-e7d37.firebaseio.com",
//     projectId: "entregados-e7d37",
//     storageBucket: "entregados-e7d37.appspot.com",
//     messagingSenderId: "427553269333",
//     appId: "1:427553269333:web:bd1c872dfc11f38287d6dc",
//     measurementId: "G-H7PD8MXDZR"
//   };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

export default class App extends React.Component {

    state = {
        titulo: '',
        cuerpo: '',
        token: false
    }

    UNSAFE_componentWillMount(){
        this.notificationListener()
        this.notificationOpenedListener()

        // const userId = firebase.auth().currentUser;

        // console.log(userId)


    }
    
    componentDidMount(){
        this.checkPermission()
        this.createNotificationListeners()
        this.createChannel()
    }
    
    componentWillUnmount(){
        // this.notificationOpenedListener()
        // this.notificationOpenBackListener()
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
        // ESTE SE EJECUTA DENTRO DE LA APLCIACION
        this.notificationListener = await firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
    
        this.notificationOpenedListener = await firebase.notifications().onNotificationOpened((notificationOpen) => {
            // const { title, body } = notificationOpen.notification;
            // this.showAlert(title, body);
            alert('notificationOpenedListener')
        });

        this.notificationOpen =  await firebase.notifications().getInitialNotification().then((notificationOpen) => {
            if (notificationOpen) {
                const { title, body } = notificationOpen.notification._data;
                if(body){
                    // this.showAlert(title, body);
                    this.setState({
                        titulo: title,
                        cuerpo: body
                    })
                }
            }
        });

        this.messageListener = await firebase.messaging().onMessage( async message => {
            const { title, body } = message._data;
            this.showAlert(title, body);
            this.setState({
                titulo: title,
                cuerpo: body
            })
        });
    }

    async getToken(){
        // let fcmToken = await AsyncStorage.getItem('fcmToken');
        let { token } = this.state;
        if (!token) {
            // fcmToken = await firebase.messaging().getToken();
            this.setState({
                token: await firebase.messaging().getToken()
            })
            // if (token) {
            //     await AsyncStorage.setItem('fcmToken', fcmToken);
            // }
        }
    };

    // createChannel(){
    //     const channel = new firebase.notifications.Android.Channel(
    //         CHANNEL_NOTIFICATIONS.CHANNEL_ID,
    //         CHANNEL_NOTIFICATIONS.CHANNEL_NAME,
    //         firebase.notifications.Android.Importance.Max
    //     ).setDescription(CHANNEL_NOTIFICATIONS.CHANNEL_DESCRIPTION);
        
    //     firebase.notifications().android.createChannel(channel);
    // };

    // notificationOpenBackListener = async () => {
    //     var response = await firebase.notifications().getInitialNotification();

    //     alert(response.notification._data.title)
    // };

    async createChannel(){
        const channel = new firebase.notifications.Android.Channel(
            1,
            'Categoria1',
            2
        ).setDescription('Descripción Categoria 1');

        await firebase.notifications().android.createChannel(channel);

    };

    notificationListener = () => {
        firebase.notifications().onNotification(response => {

            // response.android.setChannelId('default');
            response.android.setPriority(2);
            response.setData(response.data);
            this.setState({
                titulo: response._title,
                cuerpo: response._body
            })
            firebase.notifications().displayNotification(response);
        });
    }

    notificationOpenedListener = () => {
        firebase.notifications().onNotificationOpened(notificationOpen => {
            alert('notificationOpenedListener')
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

    enviarMensaje(){
        try{
            fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAAY4wpJlU:APA91bFEGYifNZgW89cYWx_Btwb0pgJlBVase4Hf3Il-c639RgXvP-4JFpPRfetG-h4nNqu3V8AHPOw7Yk0aahRrorpdcxsUJQZTa81ETJo-L3Dmmgo3skl7wasEFJRMv8lj1J4Iqw_u'
                },
                body: JSON.stringify({
                    // "to": "edxxcKlhX0Uks32Gho64mq:APA91bF-BrIced3oGd7K2H3XTIbkZgT4_8ZZMRlZRLzNPJ0VfpK_8qjsp3yRTju7K6Z4k5w-_lN9lDSOYSjzKI_eXbsfwZQagrXoNoLfaFTUhihUZ5TO20gWl5rxRyEzjSOs4BDyMwQC",
                    "to": "eem16v2ZRSOl127p-wiN3e:APA91bFklvJ-3DOExH8kAuiIIRKNMmZ_jOsTAk9D8lO502QKsbbQBQHPbWJJbw-yLQ8PkIhAzgdxTjRZ-AgoenEB-LsgiEIHlnN08YGZ0t2D1rWUiO-tyGmfvF_arPOwF9auugDFOh8W",
                    "notification": {
                        "body": "Cuerpo del Mensaje",
                        "title": "Titulo del Mensaje",
                    },
                    "data": {
                        "title": "Alexander",
                        "body": "Velasquez",
                        "channelId": "entregadosCanal"
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            })
        } catch {
            alert(error)
        }
    }

    render() {
        return (
        <View style={{flex: 1}}>
            <SafeAreaView>
                <Text>Valores:</Text>
                <Text>{this.state.titulo}</Text>
                <Text>{this.state.cuerpo}</Text>
                <Button onPress={() => this.enviarMensaje()}  title={'Enviar Mensaje'} />
            </SafeAreaView>
        </View>
        );
    }
};

const styles = StyleSheet.create({
  
});


