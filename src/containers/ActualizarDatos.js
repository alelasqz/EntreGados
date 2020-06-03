import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, TextInput, SafeAreaView } from 'react-native'
// import * as firebase from 'firebase'
import firebase from 'react-native-firebase'
import RNPickerSelect from 'react-native-picker-select';

export default class UpdateData extends React.Component {
    state = { 
        correo : '', 
        uid : '', 
        nombre : '',
        apellido : '',
        actualizado : false,
        departamentos: []
    }

    getDepartamentos = async () => {
        await firebase.database().ref('departamentos').once('value', snapshot => {
            var departamentos = []
            console.log('---------------------')
            console.log(snapshot)
            snapshot.forEach(childSnapshot => {
                departamentos.push({
                    label: childSnapshot.val().nombre, 
                    value: childSnapshot.val().nombre
                })
            });

            this.setState({
                departamentos
            });
        })
    }

    getDate(){
        var f = new Date();
        var dia = (f.getDate() < 10) ? "0" + f.getDate() : f.getDate()
        var mes = ((f.getMonth() +1) < 10) ? "0" + (f.getMonth() + 1) : f.getMonth() +1
        var fecha = (f.getFullYear() + "-" + mes + "-" + dia )
        return fecha
    }

    componentDidMount(){
        const {uid, email} = firebase.auth().currentUser;

        alert(uid)
        alert(email)

        this.setState({
            correo: email,
            uid,
            loginDate: this.getDate()
        })

        this.getDepartamentos()

        firebase.database().ref('usuarios/'+uid).set({
            correo: email,
            nombre: '',
            departamento: '',
            actualizado: false,
            loginDate: this.getDate()
        })        
    }

    salir = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.log(e);
        }
    }

    actualizarDatos =  async () => {
        var postData = {
            correo: this.state.correo,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            nombreApellido: this.state.nombre+' '+this.state.apellido,
            departamento: this.state.departamento,
            actualizado: true,
            loginDate: this.state.loginDate
        };

        var updates = {};
        updates['/usuarios/' + this.state.uid + '/'] = postData;
        await firebase.database().ref().update(updates);
        this.props.navigation.navigate('Perfil')
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Actualiza tus datos:</Text>
                
                <TextInput
                    style={styles.textinput}
                    value={this.state.correo}
                />
                <TextInput
                    style={styles.textinput}
                    placeholder='Nombre'
                    onChangeText={text => this.setState({nombre: text})}
                    value={this.state.nombre}
                />
                <TextInput
                    style={styles.textinput}
                    placeholder='Apellido'
                    onChangeText={text => this.setState({apellido: text})}
                    value={this.state.apellido}
                />
                <RNPickerSelect
                    style={{
                        ...pickerSelectStyles,
                        placeholder: {
                            color: 'gray',
                            fontSize: 14,
                            opacity: 0.7
                        },
                    }}
                    placeholder={{label: 'Seleccione Departamento'}}
                    onValueChange={(value) => this.setState({departamento: value})}
                    items={this.state.departamentos}
                />
                <Button title="Actualizar Datos" onPress={() => this.actualizarDatos()} />
                <Button title="Salir" onPress={() => this.salir()} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    textinput: {
        borderColor: 'gray', 
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        color: 'black',
        opacity: 1,
        paddingRight: 30, 
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        color: 'black',
        paddingRight: 30, 
    },
});