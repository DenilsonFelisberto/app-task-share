import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { WS_URL } from '../../../config';

export default function TodasAsTarefas({ navigation }) {

    const [tarefas, setTarefas] = useState([]);
    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const buscarTarefas = async () => {
            if (!userData) return; // Aguarda até que o userData seja definido

            try {
                const response = await fetch(`${WS_URL}/tarefas-usuario`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ authToken: userData.authToken }),
                });

                const result = await response.json();

                if (result.type === 'success') {

                    console.log(result);
                    const tarefasParse = JSON.parse(result.tarefas_usuario || '[]');
                    setTarefas(tarefasParse);
                } else {
                    Toast.show({
                        type: 'customToastError',
                        text1: 'Erro',
                        text2: result.message || 'Falha ao buscar tarefas.',
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

        buscarTarefas();
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />
            <View style={styles.conteudo}>
                <View style={styles.tituloPagina}>
                    <Text style={styles.txtTitulo}>Todas as tarefas</Text>
                </View>
                {tarefas.length == 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                        <ActivityIndicator size={45} color="#33317f" />
                    </View>
                    :
                    <ScrollView contentContainerStyle={styles.rolagemTodasAsTarefa} showsVerticalScrollIndicator={false}>

                        {tarefas.length > 0 && tarefas.map((t, i) => {

                            const tarefa = typeof t === 'string' ? JSON.parse(t) : t;

                            // Definindo as cores
                            const colors = ['#8265e4', '#34308f', '#0a0d20'];
                            // Calculando a cor com base no índice
                            const backgroundColor = colors[i % colors.length];
                            //captura percentual de conclusão da tarefa
                            const progress = tarefa.progress || 0;

                            return (
                                <Pressable style={[styles.cardTask, { backgroundColor }]} key={i} onPress={() => navigation.navigate('VerTarefa', { tarefa })}>
                                    <View style={styles.infoInicioTask}>
                                        <Text style={styles.txtInfoInicioTask}>
                                            {(() => {
                                                const dataAtual = new Date();
                                                const dataInicio = new Date(tarefa.dataInicioTarefa);
                                                const diferencaEmMilissegundos = dataInicio - dataAtual;
                                                const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24)); // Converter para dias

                                                if (diferencaEmDias > 0) {
                                                    return `Iniciará em ${diferencaEmDias} ${diferencaEmDias === 1 ? 'dia' : 'dias'}`;
                                                } else if (diferencaEmDias < 0) {
                                                    return `Iniciada há ${Math.abs(diferencaEmDias)} ${Math.abs(diferencaEmDias) === 1 ? 'dia' : 'dias'}`;
                                                } else {
                                                    return 'Inicia hoje';
                                                }
                                            })()}
                                        </Text>
                                    </View>
                                    <Text style={styles.txtCardTask}>{tarefa.titulo.substring(0, 30)}...</Text>
                                    {/* User interface design */}
                                    <View style={styles.campoProgress}>
                                        <View style={styles.campoDescProgress}>
                                            <Text style={styles.progressText}>Progresso</Text>
                                            <Text style={styles.progressText}>{progress}%</Text>
                                        </View>
                                        <View style={styles.progressContainer}>
                                            <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                }
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

        paddingHorizontal: 20,
    },
    tituloPagina: {
        width: '100%',

        marginHorizontal: 10,
        marginBottom: 10
    },
    txtTitulo: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
    },
    rolagemTodasAsTarefa: {
        width: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'column',

        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row', // Define os itens em linha
        flexWrap: 'wrap',      // Permite que os itens ocupem várias linhas
        justifyContent: 'space-between',
    },
    cardTask: {
        width: '49%',
        height: 250,

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',

        paddingVertical: 16,
        paddingHorizontal: 16,

        marginVertical: 5,
        borderRadius: 25,

        elevation: 2
    },
    infoInicioTask: {
        width: '100%',

        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    txtInfoInicioTask: {
        color: '#FFF',

        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 9,
        fontFamily: 'MajorantTRIAL-Rg',

        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 100,
    },
    txtCardTask: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'MajorantTRIAL-Md',
    },
    campoProgress: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingVertical: 5,
    },
    campoDescProgress: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    progressText: {
        height: 14,
        marginTop: 5,
        fontSize: 11,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'MajorantTRIAL-Rg',
    },
    progressContainer: {
        height: 5,
        width: '100%',
        backgroundColor: '#DDD', // Cor do fundo da barra de progresso
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 8,
        opacity: 0.65,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFF', // Cor da barra de progresso
        borderRadius: 5,
        opacity: 1,
    },
});