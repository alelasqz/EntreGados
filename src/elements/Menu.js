import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faProjectDiagram, faTasks, faDoorOpen, faUser } from '@fortawesome/free-solid-svg-icons'
import * as firebase from 'firebase'


class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    UNSAFE_componentWillMount(){
        
    }

    componentDidMount(){

    }

    salir = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.log(e);
        }
    }

    irPantalla = async (pantalla) => {
        this.props.navigation.navigate(pantalla)
    }

    render() {
        return (
            <View style={styles.containerBottom}>
                <View style={styles.ctMenu}>
                    <TouchableOpacity onPress={() => this.irPantalla('Perfil')}>
                        <View style={styles.ctBoton}>
                            <FontAwesomeIcon icon={faUser} style={styles.icono} size={ 30 }/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.irPantalla('Proyectos')}>
                        <View style={styles.ctBoton}>
                            <FontAwesomeIcon icon={faProjectDiagram} style={styles.icono} size={ 30 }/>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => this.irPantalla('Tareas')}>
                        <View style={styles.ctBoton}>
                            <FontAwesomeIcon icon={faTasks} style={styles.icono} size={ 30 }/>
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => this.salir()}>
                        <View style={styles.ctBoton}>
                            <FontAwesomeIcon icon={faDoorOpen} style={styles.icono} size={ 30 }/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Menu

const styles = StyleSheet.create({
    ctMenu: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#00008e',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },

    ctBoton: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },

    icono: {
        color: '#FFF',
        marginRight: 15,
        marginLeft: 15
    },

    containerBottom: {
        height: 70,
        justifyContent: 'flex-end',
    }
})