import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

export default function MembrosTarefa({ route, navigation }) {

    const [showDescription, setShowDescription] = useState(false);

    const { tarefa } = route.params; // Recupera os dados passados
    const [userData, setUserData] = useState(null);
    const [busca, setBusca] = useState('');

    // Carregar os dados do AsyncStorage ao montar o componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userJson = await AsyncStorage.getItem('@usuario');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setUserData(user);
                } else {
                    navigation.replace('Login');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        };
        fetchUserData();
        console.log(tarefa);

    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />
            <View style={styles.conteudo}>
                <View style={styles.campoBuscaAdd}>
                    <View style={styles.campoBuscaMeta}>
                        <Feather name="search" size={26} color="#34308f" style={styles.opc} />
                        <TextInput style={styles.input} value={busca} onChangeText={setBusca} placeholder='Buscar membros...' />
                    </View>
                    <View style={{ position: 'relative', width: '15%' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                            onLongPress={() => setShowDescription(true)} // Exibe descrição
                            onPressOut={() => setShowDescription(false)} // Esconde descrição ao soltar
                            onPress={() => navigation.navigate('AdicionarMembro', { tarefa })}
                        >
                            {/* <Entypo name="add-to-list" size={25} color="#34308f" /> */}
                            {/* <FontAwesome name="user-plus" size={25} color="#34308f" /> */}
                            <Feather name="user-plus" size={25} color="#34308f" />
                        </TouchableOpacity>
                        {showDescription && (
                            <View style={styles.description}>
                                <Text style={styles.descriptionText}>Adicionar membro</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <MenuFooter navigation={navigation} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#FFF',
    },
    conteudo: {
        width: '100%',
        flex: 1,

        paddingHorizontal: 25,
    },
    campoBuscaAdd: {
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        marginBottom: 10
    },
    campoBuscaMeta: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: '85%',

        backgroundColor: '#f1f4fd',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#dbe7f4'
    },
    input: {
        // borderWidth: 1, 
        // borderColor: '#ccc', 
        // padding: 10, 
        // borderRadius: 5, 
        // marginTop: 5,

        width: '84%',
        color: '#34308f',
        fontSize: 14.5,
    },
    opc: {
        marginHorizontal: 10,
    },
    description: {
        position: 'absolute',
        width: 120,
        top: 35, // Posiciona abaixo do botão
        right: 0,
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        opacity: 0.8,
    },
    descriptionText: {
        width: '100%',

        textAlign: 'center',
        color: '#FFF',
        fontSize: 12,
    },
});