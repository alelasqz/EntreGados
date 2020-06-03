import React, {Component} from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { 
    StikerUsuario,
    MenuFichaProyecto
} from './Utilidades'

class ProyectosFavoritos extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            pantalla: 'Proyectos', 
            uid : '', 
            nombreProyecto: '',
            descripcionProyecto: '',
            idProyecto: 1,
            listado: [],
            crearProyecto: false,
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
                    let favorito = false
                    if(snap.key == 'equipo'){
                        snap.val().forEach((equipo) => {
                            if(equipo.idUsuario == uid)
                                invitado = true
                            if(equipo.favorito && snap.val().idUsuario == uid)
                                favorito = true
                            if((invitado || snap.val().idUsuario == uid) && favorito)
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
                        let favorito = false
                        for(var i = 0; i < snap.val().equipo.length; i++){
                            if(snap.val().equipo[i].idUsuario == uid)
                                invitado = true
                            if(snap.val().equipo[i].favorito && snap.val().equipo[i].idUsuario == uid)
                                favorito = true
                        }
                        if((invitado || snap.val().idUsuario == uid) && favorito)
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
                    let favorito = false
                    if(snap.key == 'equipo'){
                        snap.val().forEach((equipo) => {
                            if(equipo.idUsuario == uid)
                                invitado = true
                            if(equipo.favorito && snap.val().idUsuario == uid)
                                favorito = true
                            if((invitado || snap.val().idUsuario == uid) && favorito)
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
        var favorito = true
        if(item.equipo){
            item.equipo.forEach((equipo) => {
                if(equipo.idUsuario == this.state.uid)
                    favorito = false
            })
        }
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DetalleProyecto', {item})}>
                <View style={styles.ct1}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <View style={{maxWidth: 230}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.nombreProyecto}</Text>
                        </View>
                        <MenuFichaProyecto 
                            uid={this.state.uid}
                            favorito={favorito}
                            proyecto={item}
                            navigation={this.props.navigation}
                            colorFavorito='#eae414'
                        />
                    </View>
                    <Text style={{fontSize: 12, color: '#a2a2a2'}}>Creación: {item.fechaCreacionProyecto}</Text>
                    <Text style={{fontSize: 12}}>{item.descripcionProyecto}</Text>

                    <View style={{width: '100%'}}>
                        <View  style={{paddingVertical: 5}}>
                            <Text>Equipo:</Text>
                        </View>

                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {
                            (item.equipo) ?
                                item.equipo.map((integrante) => {
                                    let iniciales = integrante.nombreApellido.split(' ')
                                    iniciales = iniciales[0].substr(0,1) + iniciales[1].substr(0,1)
                                    return(
                                        <StikerUsuario iniciales={iniciales} />
                                    )
                                })
                            :
                                null
                        }
                        </View>
                    </View>
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
                        horizontal
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

export default ProyectosFavoritos

const styles = StyleSheet.create({
    ct1: {
        width: 300,
        margin: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    
    listado: {
        backgroundColor: '#e0e0e0',
    },
})