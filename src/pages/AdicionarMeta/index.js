import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cabecalho from '../../components/Cabecalho';
import { WS_URL } from '../../../config';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdicionarMeta({ route, navigation }) {

    const { tarefa } = route.params; // Recupera os dados passados

    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const [altura, setAltura] = useState(40);

    const [userData, setUserData] = useState(null);

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

    const handleAdicionarMeta = async () => {
        if (!descricao.trim()) {
            Alert.alert('Erro', 'A descrição da meta não pode estar vazia.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${WS_URL}/criar-meta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_tarefa: tarefa.id,
                    authToken: userData.authToken,
                    descricao,
                }),
            });

            const result = await response.json();

            if (result.type === 'success') {
                setLoading(false);

                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso',
                    text2: 'Meta adicionada com sucesso!',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
                setDescricao('');
                navigation.navigate('MetasTarefa', { tarefa });
            } else {
                setLoading(false);

                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Falha ao adicionar meta.',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
            }
        } catch (error) {
            setLoading(false);

            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: error || 'Não foi possível conectar ao servidor.',
                visibilityTime: 3000, // Tempo em milissegundos
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            {/* <View style={styles.campoFechar}>
                <TouchableOpacity onPress={() => navigation.navigate('MetasTarefa', { tarefa })}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View> */}
            <Cabecalho navigation={navigation} />
            <View style={styles.conteudo}>
                <ScrollView contentContainerStyle={styles.rolagemDadosTarefa} showsVerticalScrollIndicator={false}>
                    {/* Campo de Descrição */}
                    <Text style={styles.txtDadoTarefa}>Descrição da meta</Text>
                    <View style={styles.inputDado}>
                        <TextInput
                            placeholder="Descrição da meta"
                            style={[styles.inputText, { height: altura }]} // Ajusta dinamicamente
                            multiline
                            value={descricao}
                            onChangeText={setDescricao}
                            onContentSizeChange={(event) => {
                                const newHeight = event.nativeEvent.contentSize.height;
                                setAltura(newHeight); // 'altura' seria um estado adicional para controlar dinamicamente
                            }}
                        />
                    </View>
                    {/* Botão Criar Tarefa */}
                    <View style={styles.botaoContainer}>
                        <TouchableOpacity style={styles.botaoCriarTarefa} onPress={handleAdicionarMeta} disabled={loading}>
                            <Text style={styles.txtBotaoCriarTarefa}>{loading ? 'Salvando...' : 'Adicionar Meta'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>


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
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'column',

        paddingHorizontal: 25,
    },
    rolagemDadosTarefa: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        paddingHorizontal: 10,
        display: 'flex',
        // flexDirection: 'row', // Define os itens em linha
        // flexWrap: 'wrap',      // Permite que os itens ocupem várias linhas
        // justifyContent: 'space-between',
    },
    txtDadoTarefa: {
        width: '100%',
        textAlign: 'left',

        paddingVertical: 12,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    inputDado: {
        width: '100%',

        backgroundColor: '#f1f4fd',

        borderWidth: 0.5,
        borderColor: '#dbe7f4',

        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    inputText: {
        width: '100%',
        color: '#072967',
        fontSize: 14.5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },

    botaoContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    botaoCriarTarefa: {
        width: '100%',
        backgroundColor: '#8265e4',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',

        elevation: 1
    },
    txtBotaoCriarTarefa: {
        color: '#FFF',
        fontSize: 16,
        // fontWeight: 'bold',
        // fontSize: 15,
        paddingVertical: 5,
        fontFamily: 'MajorantTRIAL-Rg',
    },
});