import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { WS_URL } from '../../../config';
import Octicons from '@expo/vector-icons/Octicons';
import AdicionarMeta from '../AdicionarMeta';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MetaItem from '../../components/MetaItem';
import EditarMetaItem from '../../components/EditarMetaItem';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ExcluirMetaItem from '../../components/ExcluirMetaItem';

export default function MetasTarefa({ route, navigation }) {

    const [showDescription, setShowDescription] = useState(false);

    const { tarefa } = route.params; // Recupera os dados passados
    const [metas, setMetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [addMeta, setAddMeta] = useState(false);

    const [busca, setBusca] = useState('');

    function formatDate(data, formato) {
        if (formato == 'pt-br') {
            return (data.substr(0, 10).split('-').reverse().join('.'));
        } else {
            return (data.substr(0, 10).split('.').reverse().join('-'));
        }
    }

    const buscarMetasTarefas = async () => {
        if (!userData) return; // Aguarda até que o userData seja definido

        try {
            const response = await fetch(`${WS_URL}/metas-tarefa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authToken: userData.authToken, id_tarefa: tarefa.id }),
            });

            const result = await response.json();

            if (result.type === 'success') {

                console.log(result);
                console.log("Teste");

                const metasTarefasParse = JSON.parse(result.metas_tarefa || '[]');
                setMetas(metasTarefasParse);
                setLoading(false);
            } else {
                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Falha ao buscar metas.',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
            }
        } catch (error) {
            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: error || 'Não foi possível conectar ao servidor.',
                visibilityTime: 3000, // Tempo em milissegundos
            });
        }
    };

    useEffect(() => {

        buscarMetasTarefas();
    }, [userData]);

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
    }, []);

    // Verificar se os dados existem sempre que a tela ganhar foco
    useFocusEffect(
        useCallback(() => {
            const checkUserData = async () => {
                try {
                    const userJson = await AsyncStorage.getItem('@usuario');
                    if (!userJson) {
                        navigation.replace('Login'); // Redireciona para a tela de login
                    }
                } catch (error) {
                    console.error('Erro ao verificar dados do usuário:', error);
                }
            };

            checkUserData();
        }, [navigation])
    );

    const renderMeta = ({ item }) => (
        <View style={styles.metaContainer}>
            <View style={styles.campoInfoMeta}>
                <Text style={styles.infoText}>Meta <Text style={{ color: '#000' }}>{JSON.parse(item).prioridade}</Text></Text>
                <MetaItem
                    meta={JSON.parse(item)}
                    authToken={userData.authToken}
                    onUpdate={() => buscarMetasTarefas()}
                />
            </View>
            <Text style={styles.metaText}>{JSON.parse(item).descricao}</Text>
            <View style={styles.campoInfoMeta}>
                <Text style={styles.infoText}>Add. em {formatDate(JSON.parse(item).dataHoraCriacao, 'pt-br')} às {JSON.parse(item).dataHoraCriacao.substr(11, 8)}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

                    <ExcluirMetaItem
                        meta={JSON.parse(item)}
                        authToken={userData.authToken}
                        onUpdate={() => buscarMetasTarefas()}
                    />

                    <EditarMetaItem
                        meta={JSON.parse(item)}
                        authToken={userData.authToken}
                        onUpdate={() => buscarMetasTarefas()}
                    />
                </View>
            </View>
        </View>
    );

    useFocusEffect(
        useCallback(() => {
            buscarMetasTarefas();
        }, [userData])
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <View style={styles.campoBuscaAdd}>
                    <View style={styles.campoBuscaMeta}>
                        <Feather name="search" size={26} color="#34308f" style={styles.opc} />
                        <TextInput style={styles.input} value={busca} onChangeText={setBusca} placeholder='Buscar metas...' />
                    </View>
                    <View style={{ position: 'relative', width: '15%' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                            onLongPress={() => setShowDescription(true)} // Exibe descrição
                            onPressOut={() => setShowDescription(false)} // Esconde descrição ao soltar
                            onPress={() => navigation.navigate('AdicionarMeta', { tarefa })}
                        >
                            <Entypo name="add-to-list" size={25} color="#34308f" />
                        </TouchableOpacity>
                        {showDescription && (
                            <View style={styles.description}>
                                <Text style={styles.descriptionText}>Adicionar meta</Text>
                            </View>
                        )}
                    </View>
                </View>
                {loading ? (
                    <Text style={styles.statusCarregamento}>Carregando metas...</Text>
                ) : (
                    <FlatList
                        data={metas}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={renderMeta}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.campoInfoAlert}>
                                <Octicons name="info" size={24} color="#8265e4" />
                                <Text style={styles.txtCampoInfoAlert}>Não há metas para {"\n"}esta tarefa.</Text>
                            </View>
                        }
                    />
                )}
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
    campoInfoAlert: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginVertical: 55
    },
    txtCampoInfoAlert: {
        color: '#34308f',
        fontFamily: 'MajorantTRIAL-Md',
        fontSize: 12,
        paddingVertical: 5,
        textAlign: 'center'
    },
    metaContainer: {
        padding: 15,
        marginBottom: 10,

        backgroundColor: '#f1f4fd',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#dbe7f4'
    },
    campoInfoMeta: {
        width: '100%',
        height: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    infoText: {
        height: 24,

        fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',

        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 3,
        color: '#8265e4',
    },
    spaceHorIcon: {
        marginHorizontal: 5,
    },
    metaText: {
        width: '100%',
        // height: 24,

        // fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',

        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 3,
        color: '#34308f',
    },
    statusCarregamento: {

        width: '100%',
        height: 24,
        textAlign: 'center',
        fontFamily: 'MajorantTRIAL-Md',
        color: '#34308f',

        marginVertical: 15,
    }
});