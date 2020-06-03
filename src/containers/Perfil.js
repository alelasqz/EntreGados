import React from 'react'
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
// import * as firebase from 'firebase'
import firebase from 'react-native-firebase'

import Menu from '../elements/Menu'
import { ContenedorGeneral, ContenedorTop, ContenedorFotoPerfil, Opcion } from '../elements/Utilidades'
import { faInbox, faExclamationCircle, faThumbtack, faProjectDiagram, faBell, faCog } from '@fortawesome/free-solid-svg-icons'
// import * as firestore from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';
// import firestore from '@react-native-firebase/firestore';

export default class Perfil extends React.Component {
    state = { 
        modulos: [
            {
                id: '1',
                nombre: 'Prioridad',
                link: 'Prioridad',
                icono: faExclamationCircle,
                flechaDerecha: true
            },
            {
                id: '2',
                nombre: 'Proyectos',
                link: 'Proyectos',
                icono: faProjectDiagram,
                flechaDerecha: true
            },
            {
                id: '3',
                nombre: 'Bandeja de Entrada',
                link: 'BandejaEntrada',
                icono: faInbox,
                flechaDerecha: true
            },
            // {
            //     id: 3,
            //     nombre: 'Información del Usuario',
            //     link: 'InfoUsuario',
            //     icono: faUser,
            //     flechaDerecha: true
            // },
            // {
            //     id: 3,
            //     nombre: 'Notificaciones',
            //     link: 'Notificaciones',
            //     icono: faBell,
            //     flechaDerecha: true
            // },
            // {
            //     id: 4,
            //     nombre: 'Configuración',
            //     link: 'Configuracion',
            //     icono: faCog,
            //     flechaDerecha: true
            // }
        ]
    }

    async UNSAFE_componentWillMount(){
        // let firestore = await firebase.firestore();
        // const usersCollection = await firestore.collection('pruebas').doc('1').get();
        // console.log('usersCollection')
        // console.log(usersCollection)

        // const settings = await messaging().requestPermission();
        // if (settings) {
        //     alert('Permission settings:', settings);
        //     console.log(settings);
        // }



        await messaging().usePublicVapidKey("AIzaSyC252ESAdTSni1PvcTI7Y7lPkFiQvGJFjw");

        //Solicita permiso para recibir notificaciones
            // await messaging().requestPermission().then((permission) => {
            //     alert(permission)
            //     if (permission) {
            //     console.log('Notification permission granted.');
            //     // TODO(developer): Retrieve an Instance ID token for use with FCM.
            //     // ...
            //     } else {
            //     console.log('Unable to get permission to notify.');
            //     }
            // });


        //Recupera el token de registro actual
            await messaging().getToken().then((currentToken) => {
                if(currentToken) {
                    this.saveTokenToDatabase(currentToken)
                    // updateUIForPushEnabled(currentToken);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // updateUIForPushPermissionRequired();
                    // setTokenSentToServer(false);
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // showToken('Error retrieving Instance ID token. ', err);
                // setTokenSentToServer(false);
            });

            await messaging().onTokenRefresh(token => {
                this.saveTokenToDatabase(token);
            });
          
        //Supervisa la actualización de tokens
            // messaging.onTokenRefresh(() => {
            //     messaging.getToken().then((refreshedToken) => {
            //       console.log('Token refreshed.');
            //       // Indicate that the new Instance ID token has not yet been sent to the
            //       // app server.
            //       setTokenSentToServer(false);
            //       // Send Instance ID token to app server.
            //       sendTokenToServer(refreshedToken);
            //       // ...
            //     }).catch((err) => {
            //       console.log('Unable to retrieve refreshed token ', err);
            //       showToken('Unable to retrieve refreshed token ', err);
            //     });
            // });

            messaging().onMessage((payload) => {
                alert('Mensaje Recibido !!!')
                console.log('Message received. ', payload);
                // ...
              });
              


        // alert('aja')
        // const messaging = firebase.messaging();
        // console.log(messaging)

        //PARA COLOCAR EN EL APP.js YA QUE ES EL PROCESO PARA ENTRAR DIRECTAMENTE A UNA TAREA
            // messaging().onNotificationOpenedApp(remoteMessage => {
            //     console.log(
            //         'Notification caused app to open from background state:',
            //         remoteMessage.notification,
            //     );
            //     navigation.navigate(remoteMessage.data.type);
            // });

            // messaging()
            // .getInitialNotification()
            // .then(remoteMessage => {
            //     if (remoteMessage) {
            //     console.log(
            //         'Notification caused app to open from quit state:',
            //         remoteMessage.notification,
            //     );
            //     setInitialRoute(remoteMessage.data.type); 
            //     }
            //     setLoading(false);
            // });
    }

    async saveTokenToDatabase(token) {
        // Assume user is already signed in
        const {uid} = await firebase.auth().currentUser;
      
        // Add the token to the users datastore
        // await firestore()
        //   .collection('users')
        //   .doc(uid)
        //   .update({
        //     tokens: firestore().FieldValue.arrayUnion(token),
        // });

        await firebase.database()
          .ref('tokens/'+uid)
          .set({
            token: token,
        });
    }

    async componentDidMount() {
        const {uid} = await firebase.auth().currentUser;

        await firebase.database().ref('/usuarios/' + uid).once('value').then(snapshot => {
            this.setState({
                nombre: snapshot.val().nombre,
                correo: snapshot.val().correo,
                departamento: snapshot.val().departamento,
            });
        });        
    }

    irPantalla = async (pantalla) => {
        this.props.navigation.navigate(pantalla)
    }

    renderModulo(item){
        return(
            <TouchableOpacity onPress={() => this.irPantalla(item.link)}>
                <Opcion 
                    nombre={item.nombre}
                    link={item.link}
                    icono={item.icono}
                    flechaDerecha={item.flechaDerecha}
                />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <ContenedorGeneral>
                <ContenedorFotoPerfil 
                    nombre={this.state.nombre}
                    correo={this.state.correo}
                />
                <ContenedorTop >
                    {/* <ScrollView> */}
                        <FlatList 
                            data={this.state.modulos}
                            renderItem={ ({item}) => this.renderModulo(item)} 
                            keyExtractor={item => item.id}
                            />
                    {/* </ScrollView> */}
                </ContenedorTop>
                <Menu navigation={this.props.navigation} />
            </ContenedorGeneral>
        )
    }
}

const styles = StyleSheet.create({
    
})