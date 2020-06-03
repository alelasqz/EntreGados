import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
// import * as firebase from 'firebase'
import firebase from 'react-native-firebase'
// import firestore from 'firebase/firestore'

console.disableYellowBox = true;

var firebaseConfig = {
    apiKey: "AIzaSyC252ESAdTSni1PvcTI7Y7lPkFiQvGJFjw",
    authDomain: "fourth-tiger-239822.firebaseapp.com",
    databaseURL: "https://fourth-tiger-239822.firebaseio.com",
    projectId: "fourth-tiger-239822",
    storageBucket: "fourth-tiger-239822.appspot.com",
    messagingSenderId: "809143025902",
    appId: "1:809143025902:web:b286b12e02db3194f4f3ff",
    measurementId: "G-1F5YF9668R"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const settings = {timestampsInSnapshots: true};
// firebase.firestore()

export default class Loading extends React.Component {
    componentDidMount(){
         firebase.auth().onAuthStateChanged(usuario => {
            if(usuario) {
                // alert('Hay usuario')
                const {uid} = firebase.auth().currentUser;
                firebase.database().ref('/usuarios/' + uid).once('value').then(snapshot => {
                    
                    (snapshot.val().actualizado) ?
                        this.props.navigation.navigate('Perfil')
                    : 
                        this.props.navigation.navigate('ActualizarDatos')
                });
            }else{
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }] 
                })
                this.props.navigation.navigate('Login')
            }
        });        
    }

    render() {
        // let fire = firebase.firestore()
        // console.log('fire')
        // console.log(fire)
        
        // const usersCollection = firestore().collection('pruebas');
        // console.log('usersCollection')
        // console.log(usersCollection)

        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})