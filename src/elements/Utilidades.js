import React, {Component} from 'react'
import {Text, StyleSheet, TouchableOpacity, View, Image, TextInput} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCog, faExclamationCircle, faStar, faPlus, faCheck, faTimes, faAngleRight, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import * as firebase from 'firebase'
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import logo from '../../assets/logo/logo.png'




export const Boton = (props) => {
    let icono = faPlus
    let color = 'grey'

    if(props.icono == 'faCheck'){
        icono = faCheck
        color = 'grey'
    }else if(props.icono == 'faTimes'){
        icono = faTimes
        color = 'grey'
    }

    return (
        <TouchableOpacity 
            onPress={props.onPress ? props.onPress : 'null' }>
            <View style={[styles.ctBoton, {backgroundColor: color}]}>
                <FontAwesomeIcon icon={icono} style={styles.icono} size={ 30 }/>
            </View>
        </TouchableOpacity>
    )
}

export const ContenedorGeneral = (props) => {
    return (
        <View style={styles.ctGeneral}>
            {props.children}
        </View>
    )
}

export const ContenedorTop = (props) => {
    return (
        <View style={styles.ctTop}>
            {props.children}
        </View>
    )
}

export const ContenedorBottom = (props) => {
    return (
        <View style={styles.ctBottom}>
            {props.children}
        </View>
    )
}

export const ContenedorBotones = (props) => {
    return (
        <View style={styles.ctBotones}>
            {props.children}
        </View>
    )
}

export const Contenedor = (props) => {
    return (
        <View style={styles.ct}>
            {props.children}
        </View>
    )
}

export const ContenedorFotoPerfil = (props) => {
    return (
        <View style={styles.ctDatos}>
            <TouchableOpacity style={styles.tchFoto}>
                <View style={styles.vwFoto}>
                    <Image
                        style={styles.avatarFoto}
                        // source={{uri:'https://continentalassist.co/backmin/restapp/upload/images/ContinentalLogo.jpg'}}
                        source={logo}
                    />
                </View>
            </TouchableOpacity>
            <Text style={styles.txNombre}>{props.nombre}</Text>
            <Text style={styles.txCorreo}>{props.correo}</Text>
        </View>
    )
}

export const ContenedorEncabezado = (props) => {
    return (
        <View style={styles.ctEncabezado}>
            <Text style={styles.txPantalla}>{props.pantalla}</Text>
        </View>
    )
}

export const Opcion = (props) => {
    return(
        <View style={styles.ctOpcion}>
            <View style={styles.vwOpcion}>
                <View style={styles.vwOpcionIcono}>
                    <FontAwesomeIcon icon={props.icono} size={20} color={"#fff"}/>
                </View>
                <Text style={styles.txOpcion}>{props.nombre}</Text>
            </View>
            <View style={styles.vwFlecha}>
               {
                    props.flechaDerecha ?
                        <FontAwesomeIcon icon={faAngleRight} size={30} />
                    : 
                        null
               } 
            </View>
        </View>
    )
}

export const StikerUsuario = (props) => {
    return(
        <View style={styles.ctStikerUsuario}>
            <Text style={styles.txStikerUsuario}>
                {props.iniciales}
            </Text>
        </View>
    )
}

export const MenuFichaProyecto = (props) => {
    let favorito = props.favorito
    let uid = props.uid
    const item = props.proyecto

    return(
        <View style={styles.ctMenuFichaProyecto}>
            <TouchableOpacity onPress={() => {
                    firebase.database().ref('proyectos/'+item.idProyecto+'/equipo').on('child_added', (equipo) => {
                        if(equipo.val().idUsuario == uid)
                            firebase.database().ref('proyectos/'+item.idProyecto+'/equipo/'+equipo.key+'/favorito').set(favorito)
                    })
                }
            }>
                <FontAwesomeIcon icon={faStar} style={styles.iconoConfig} color={props.colorFavorito} size={ 20 }/>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => {
                    props.navigation.navigate('ConfiguracionProyecto', {item})
                }}
            >
                <FontAwesomeIcon icon={faCog} style={styles.iconoConfig} size={ 20 }/>
            </TouchableOpacity>
        </View>
    )
}

export const MenuFichaTarea = (props) => {
    return(
        <View style={styles.ctMenuFichaTarea}>
            <TouchableOpacity onPress={() => {
                    firebase.database().ref('tareas/'+props.idTarea+'/prioridad').set(!props.prioridad)
                }
            }>
                <FontAwesomeIcon icon={faExclamationCircle} style={styles.iconoConfig} color={props.colorPrioridad} size={ 20 }/>
            </TouchableOpacity>
        </View>
    )
}

export const InputTexto = (props) => {
    return (
        <View>
            <TextInput
                style={[styles.inputTexto,{height:(props.multiline) ? 60 : 40}]}
                multiline={(props.multiline) ? true : false }
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                value={props.value}
            />
        </View>
    )
} 

export const CheckBoxTarea = (props) => {
    return (
        <View style={[styles.ctChackBoxTarea, {backgroundColor: (props.editable) ? '#fff' : '#ccc'}]}>
            {
                (props.permisoParafinalizar) ?
                    <TouchableOpacity 
                        style={styles.tchCheckBox}
                        onPress={props.onPress}
                    >
                        {
                            (props.idStatusTarea) ?
                                <FontAwesomeIcon icon={faCircle} size={30} color={'grey'} />
                            :
                                <FontAwesomeIcon icon={faCheckCircle} size={30} color={'grey'} />

                        }
                    </TouchableOpacity>
                : 
                    null
            }
            <View style={{width: '85%'}}>
                <TextInput 
                    onChangeText={props.onChangeText}
                    style={{fontSize: 14}}
                    value={props.value}
                    editable={props.editable}
                    multiline={true}
                />
            </View>
        </View>
    )
}

export const SelectTarea = (props) => {
    return ( 
        <View style={styles.ctSelectTarea}>
            <View style={styles.faSelectTarea}>
                <FontAwesomeIcon icon={props.icono} size={15} color={'grey'} />
            </View>
            <View style={{alignItems: 'center'}}>
                <RNPickerSelect
                    style={{
                        ...pickerSelectStyles,
                        placeholder: {
                            color: '#000',
                            fontSize: 14,
                            opacity: 0.3,
                            
                        },
                    }}
                    placeholder={{
                        label: props.placeholder,
                        value: null,
                    }}
                    onValueChange={props.onValueChange}
                    items={props.items}
                    value={props.value}
                />
            </View>
        </View>
    )
}

export const InputTarea = (props) => {
    return (
        <View style={styles.ctSelectTarea}>
            <View style={styles.faSelectTarea}>
                <FontAwesomeIcon icon={props.icono} size={15} color={'grey'} />
            </View>
            <View style={{alignItems: 'center'}}>
                <TextInput 
                    type="date"
                    dateFormat="yyyy-mm-dd"
                    onChangeText={props.onChangeText}
                    onTouchStart={this._showDateTimePicker}
                    style={{fontSize: 14, height: 40, width: '100%'}}
                    value={props.value}
                />
            </View>
        </View>
    )
}

export const DatePickerTarea = (props) => {
    return (
        <View style={{
            width: '49%', 
            flexDirection: 'row', 
            alignItems: 'center', 
            borderWidth: 1, 
            paddingHorizontal: 5, 
            borderColor: 'grey', 
            borderRadius: 5,
            backgroundColor: '#fff'
        }}>
            <View style={styles.faSelectTarea}>
                <FontAwesomeIcon icon={props.icono} size={15} color={'grey'} />
            </View>
            <DatePicker
                style={{ borderRadius: 5, borderWidth: 0, fontSize: 18}}
                date={props.date}
                mode="date"
                placeholder={props.placeholder}
                format="YYYY-MM-DD"
                minDate={props.minDate}
                maxDate="2016-06-01"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                dateIcon: {
                    marginLeft: 0,
                },
                dateInput: {
                    marginLeft: -30,
                    borderWidth: 0,
                }
                }}
                showIcon={false}
                onDateChange={props.onDateChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
   
    faSelectTarea: {
        alignItems: 'center', 
        marginHorizontal: 5
    },

    ctSelectTarea: {
        width: '49%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        paddingHorizontal: 5, 
        borderColor: 'grey', 
        borderRadius: 5,
        backgroundColor: '#fff'
    },

    tchCheckBox: {
        marginRight: 15, 
        alignItems: 'center'
    },

    ctChackBoxTarea: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 5,
        borderColor: 'grey',
        marginBottom: 10,
    },

    inputTexto: {
        backgroundColor: '#fff',
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        paddingTop: 10,
        marginBottom: 10
    },

    ctMenuFichaProyecto: {
        flexDirection: 'row', 
        alignItems: 'center'
    },

    ctMenuFichaTarea: {
        flexDirection: 'row', 
        alignItems: 'center'
    },

    iconoConfig: {
        color: '#ccc'
    },

    ctStikerUsuario: {
        width: 30, 
        height: 30, 
        backgroundColor: 'green', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 3, 
        marginRight: 5, 
        marginBottom: 10
    },

    txStikerUsuario: {
        color: '#fff'
    },

    ctGeneral: {
        flex: 1,
        backgroundColor: '#46465d'
    },

    ctTop: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#e4e4e4',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15
    },

    ctBottom: {
        justifyContent: 'flex-end',
    },

    ct: {
        padding: 10
    },
    
    ctBoton: {
        width: 150,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    ctDatos: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50
    },

    ctEncabezado: {
        width: '100%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    ctOpcion: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },

    vwOpcion: {
        width: '90%', 
        flexDirection: 'row', 
        alignItems: 'center'
    },

    vwOpcionIcono: {
        width: 50, 
        height: 50, 
        backgroundColor: '#484848', 
        borderRadius: 25, 
        alignItems: 'center', 
        justifyContent: 'center'
    },

    txOpcion: {
        marginLeft: 20, 
        fontSize: 16
    },

    vwFlecha: {
        width: '10%'
    },

    vwFoto: {
        width: 100, 
        height: 100, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 55, 
        backgroundColor: '#fff'
    },

    tchFoto: {
        width: 100,
        height: 100,
        backgroundColor: '#d8d9dd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 20
    },

    txNombre: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff'
    },

    txCorreo: {
        fontSize: 14,
        color: '#fff'
    },

    txPantalla: {
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center'
    },

    avatarFoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    icono: {
        color: '#FFF',
        marginRight: 15,
        marginLeft: 15
    },

    ctBotones: {
        flex: 1,
        width: '98%',
        height: 70,
        marginHorizontal: '1%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },

})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        width: 120,
        height: 40,
        color: 'black',
        opacity: 1,

    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        color: 'black',
        paddingRight: 30, 
        backgroundColor: '#fff',
        marginBottom: 10


    },
});