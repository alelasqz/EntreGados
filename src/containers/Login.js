import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
// import * as firebase from 'firebase'
import firebase from 'react-native-firebase'

export default class Login extends React.Component {
    state = { 
        correo: "", 
        password: '', 
        errorMessage: null 
    }

    handleLogin = () => {
        const { correo, password } = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(correo, password)
            .then(() => this.props.navigation.navigate('Perfil'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }   

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.text}>Logueo</Text>
            {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
                </Text>}
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Correo Electrónico"
                onChangeText={correo => this.setState({ correo })}
                value={this.state.correo}
            />
            <TextInput
                secureTextEntry
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Contraseña"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
            <Button title="Loguearse" onPress={this.handleLogin} />
            <Button
                title="No posee una cuenta? Registrarse"
                onPress={() => this.props.navigation.navigate('Registro')}
            />
            <Button 
                title="Olvidó su contraseña?"
                onPress={() => this.props.navigation.navigate('Olvido')}
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