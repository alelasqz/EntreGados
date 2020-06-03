import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
// import * as firebase from 'firebase'
import firebase from 'react-native-firebase'


export default class SignUp extends React.Component {
    state = { 
        correo: 'rastalextremo@gmail.com', 
        password: 'alex6678', 
        errorMessage: null 
    }

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.correo, this.state.password)
            .then(() => this.props.navigation.navigate('ActualizarDatos'))
            .catch(error => this.setState({ errorMessage: error.message}))
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Registro</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    placeholder="Correo Electrónico"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={correo => this.setState({ correo })}
                    value={this.state.correo}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <Button title="Registrarse" onPress={this.handleSignUp} />
                <Button
                    title="Ya posee una cuenta? Loguearse"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        fontSize: 18
    },

    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        padding: 5
    }
})