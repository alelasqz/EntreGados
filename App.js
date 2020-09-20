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

    async UNSAFE_componentWillMount(){
        this.checkPermission()
        this.createNotificationListeners()

        // await firebase.notifications().onNotificationOpened(message => {
        //     this.mostrarMensaje(message.notification._data)
        // });
    }
    
    componentDidMount(){
        this.createNotificationListeners()
    }
    
    async componentWillUnmount(){
        await firebase.notifications().onNotificationOpened(message => {
            this.mostrarMensaje(message.notification._data)
        });

        await firebase.notifications().getInitialNotification().then(message => {
            this.mostrarMensaje(message.notification._data)
        });
    }

    //PERMISOS
        async checkPermission() {
            const enabled = await firebase.messaging().hasPermission();
            enabled ? this.getToken() : this.requestPermission() 
        };

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

        async requestPermission() { 
            await firebase.messaging().requestPermission().then(() => {
                this.getToken();
            })
            .catch(error => {
                alert(`${error} permission rejected`);
            });
        
        }
    // FIN PERMISOS


    mostrarMensaje(data) {
        const { title, body } = data
        this.showAlert( title, body )
        this.setState({
            titulo: title,
            cuerpo: body
        })
    }

    async createNotificationListeners() {
        await firebase.notifications().onNotification(message => {
            this.mostrarMensaje(message._data)
            message.android.setPriority(2);
            message.setData(message.data);
            // firebase.notifications().displayNotification(message);
            // firebase.notifications().removeDeliveredNotification(message.notificationId);
        });

        await firebase.notifications().onNotificationOpened(message => {
            this.mostrarMensaje(message.notification._data)
        });

        await firebase.messaging().onMessage(message => {
            this.mostrarMensaje(message._data)
        });

        await firebase.notifications().getInitialNotification().then(message => {
            this.mostrarMensaje(message.notification._data)
        });

        
    }

    // notificationListener = async () => {
    //     await firebase.notifications().onNotification(response => {
    //         alert('ANDROID ABIERTO')
    //         // response.android.setPriority(2);
    //         // response.setData(response.data);
    //         // this.setState({
    //         //     titulo: 'ESTO_TITLE',
    //         //     cuerpo: 'ESTO_BODY'
    //         // })
    //         firebase.notifications().displayNotification(response);
                // firebase.notifications().removeDeliveredNotification(notification.notificationId);
    //     });
    // }




    // notificationOpenedListener = () => {
    //     firebase.notifications().onNotificationOpened(notificationOpen => {
    //         alert('notificationOpenedListener')
    //     });
    // }

    

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


