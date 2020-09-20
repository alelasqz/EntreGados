import React, {Component} from 'react';
import { StyleSheet, View, Text, AsyncStorage, Alert, SafeAreaView, TouchableOpacity, Button , Platform } from 'react-native';
import firebase from 'react-native-firebase'

console.disableYellowBox = true

export default class App extends React.Component {

    state = {
        titulo: '',
        cuerpo: '',
        token: false
    }

    UNSAFE_componentWillMount(){
        // alert('1')
        this.notificationListener() 
        this.notificationOpenedListener()
    }
    
    componentDidMount(){
        this.checkPermission()
        this.createNotificationListeners()
        // this.createChannel()
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
        this.notificationListener = await firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
    
        this.notificationOpenedListener = await firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });

        this.notificationOpen =  await firebase.notifications().getInitialNotification().then((notificationOpen) => {
            if (notificationOpen) {
                const { title, body } = notificationOpen.notification._data;
                if(body){
                    this.showAlert(title, body);
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
        let { token } = this.state;

        if (!token) {
            this.setState({
                token: await firebase.messaging().getToken()
            })

            var arreglo = {}
            var plataforma = Platform.OS === 'ios' ? 'IOS' : 'ANDROID' 

            arreglo[plataforma] = { 
                token : this.state.token
            }

            await firebase.database().ref('tokens').update(arreglo)
        }
    };
    
    notificationOpenBackListener = async () => {
        this.notificationOpen =  await firebase.notifications().getInitialNotification().then((notificationOpen) => {
            if (notificationOpen) {
                const { title, body } = notificationOpen.notification._data;
                if(body){
                    this.showAlert(title, body);
                    this.setState({
                        titulo: title,
                        cuerpo: body
                    })
                }
            }
        }).catch(error => alert(error));
    };

    // async createChannel(){
    //     const channel = new firebase.notifications.Android.Channel(
    //         1,
    //         'Categoria1',
    //         2
    //     ).setDescription('Descripción Categoria 1');

    //     await firebase.notifications().android.createChannel(channel);
    // };

    notificationListener = () => {
        alert('2')
        firebase.notifications().onNotification(response => {
            response.android.setPriority(2);
            response.setData(response.data);
            // this.setState({
            //     titulo: response._title,
            //     cuerpo: response._body
            // })
            this.setState({
                titulo: 'ESTO_TITLE',
                cuerpo: 'ESTO_BODY'
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

    async enviarMensaje(){
        var plataforma = Platform.OS === 'ios' ? 'ANDROID' : 'IOS'

        try{
            await firebase.database().ref('tokens/' + plataforma).once('value').then(snapshot => {
                this.setState({
                    enviarA: snapshot.val().token
                });
            }); 
        } catch (error) {
            alert(error)
        }

        try{
            fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAAY4wpJlU:APA91bFEGYifNZgW89cYWx_Btwb0pgJlBVase4Hf3Il-c639RgXvP-4JFpPRfetG-h4nNqu3V8AHPOw7Yk0aahRrorpdcxsUJQZTa81ETJo-L3Dmmgo3skl7wasEFJRMv8lj1J4Iqw_u'
                },
                body: JSON.stringify({
                    "to": this.state.enviarA,
                    "notification": {
                        "title": "Titulo del Mensaje",
                        "body": "Cuerpo del Mensaje",
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


