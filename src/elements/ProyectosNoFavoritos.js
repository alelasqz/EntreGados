import React, {Component} from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import { 
    MenuFichaProyecto
} from './Utilidades'

class ProyectosNoFavoritos extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            pantalla: 'Proyectos', 
            uid : '', 
            nombreProyecto: '',
            descripcionProyecto: '',
            idProyecto: 1,
            listado: [],
        }
    }

    async UNSAFE_componentWillMount() {
        const {uid} = await firebase.auth().currentUser;

        this.setState({
            uid
        })
        
        firebase.database().ref('proyectos').on("child_added", (snapshot) => {
            if(snapshot.val() != null){
                let listado = []
                snapshot.forEach((snap) => {
                    let invitado = false
                    let favorito = true
                    if(snap.key == 'equipo'){
                        snap.val().forEach((equipo) => {
                            if(equipo.idUsuario == uid)
                                invitado = true
                            if(!equipo.favorito && snap.val().idUsuario == uid)
                                favorito = false
                            if((invitado || snap.val().idUsuario == uid) && !favorito)
                                listado.push(snap.val())
                        })
                    }
                })
                this.setState({
                    listado
                })
            }
        })

        try{
            firebase.database().ref('proyectos').orderByKey().on("value", (snapshot) => {
                if(snapshot.val() != null){
                    let listado = []
                    
                    snapshot.forEach((snap) => {
                        let invitado = false
                        let favorito = true
                        for(var i = 0; i < snap.val().equipo.length; i++){
                            if(snap.val().equipo[i].idUsuario == uid)
                                invitado = true
                            if(!snap.val().equipo[i].favorito && snap.val().equipo[i].idUsuario == uid)
                                favorito = false
                            
                        }
                        if((invitado || snap.val().idUsuario == uid) && !favorito)
                            listado.push(snap.val())
                        this.setState({
                            listado: listado.sort().reverse()
                        })
                    })
                    
                }
            })
        }catch(error){
            console.log(error)
        }   
    }

    async componentDidMount() {
        const {uid} = await firebase.auth().currentUser;

        firebase.database().ref('proyectos').on("child_changed", (snapshot) => {
            if(snapshot.val() != null){
                let listado = []
                snapshot.forEach((snap) => {
                    let invitado = false
                    let favorito = true
                    if(snap.key == 'equipo'){
                        snap.val().forEach((equipo) => {
                            if(equipo.idUsuario == uid)
                                invitado = true
                            if(!equipo.favorito  && snap.val().idUsuario == uid)
                                favorito = false
                            if((invitado || snap.val().idUsuario == uid) && !favorito)
                                listado.push(snap.val())
                        })
                    }
                    
                })
                this.setState({
                    listado
                })
            }
        })       
    }


    renderFavoritos(item, index){
        var favorito = false
        if(item.equipo){
            item.equipo.forEach((equipo) => {
                if(equipo.idUsuario == this.state.uid)
                    favorito = true
            })
        }
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DetalleProyecto', {item})}>
                <View style={styles.ct1}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <View style={{maxWidth: 300, marginBottom: 5}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.nombreProyecto}</Text>
                        </View>
                        <MenuFichaProyecto 
                            uid={this.state.uid}
                            favorito={favorito}
                            idProyecto={item.idProyecto}
                            proyecto={item}
                            navigation={this.props.navigation}
                            color='#ccc'
                        />
                    </View>
                    <Text style={{fontSize: 12, color: '#a2a2a2'}}>Creación: {item.fechaCreacionProyecto}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{marginBottom: 10}}>
                {
                    this.state.listado.length > 0 ?
                        <View style={{padding: 5}}>
                            <Text style={{fontWeight: 'bold'}}>{this.props.titulo}</Text>
                        </View>
                    :
                        null
                }
                <ScrollView>
                    <FlatList 
                        style={styles.listado}
                        data={this.state.listado}
                        renderItem={ ({item, index}) => this.renderFavoritos(item, index)} 
                        keyExtractor={item => item.idProyecto}
                        showsHorizontalScrollIndicator={false}
                        />
                </ScrollView>
            </View>
        )
    }
}

export default ProyectosNoFavoritos

const styles = StyleSheet.create({
    ct1: {
        width: '96%',
        margin: '2%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    
    listado: {
        backgroundColor: '#e0e0e0',
    },
})