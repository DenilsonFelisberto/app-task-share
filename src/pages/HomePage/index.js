import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert, Pressable, Image, ActivityIndicator } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WS_URL } from '../../../config';

export default function HomePage({ navigation }) {

    const [userData, setUserData] = useState(null);
    const [tarefas, setTarefas] = useState([]);

    const options = [
        {
            text: "Recentes",
            link: () => { },
            active: true,
        },
        {
            text: "Hoje",
            link: () => { },
            active: false,
        },
        {
            text: "Amanhã",
            link: () => { },
            active: false,
        },
        {
            text: "Mais tarde",
            link: () => { },
            active: false,
        },
    ];

    const more_options = [
        {
            icon: <Entypo name="slideshare" size={24} color="#FFF" />,
            text: "Tarefas compartilhadas",
            more_info: "10 tarefas no total",
            link: () => Alert.alert('Teste1', 'Teste'),
        },
        {
            icon: <Entypo name="check" size={24} color="#FFF" />,
            text: "Tarefas concluídas",
            more_info: "30 tarefas no total",
            link: () => Alert.alert('Teste2', 'Teste'),
        },
    ];

    // Carregar os dados do AsyncStorage ao montar o componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userJson = await AsyncStorage.getItem('@usuario');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setUserData(user);
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />
            {/* <Text style={styles.text}>Bem-vindo à Página Inicial!</Text>
            <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Details')} /> */}

            <View style={styles.conteudo}>
                <ScrollView contentContainerStyle={styles.campoRolagem} showsVerticalScrollIndicator={false}>
                    <View style={styles.campoPerfil}>
                        <View style={styles.fotoPerfil}>
                            {userData && userData.fotoPerfil && (
                                <Image
                                    source={{ uri: userData.fotoPerfil }}
                                    style={{ width: 55, height: 55, borderRadius: 100 }}
                                />
                            )}
                        </View>
                        <View style={styles.campoNameUser}>
                            <Text style={styles.txtName}>Olá, <Text style={styles.txtBold}>{userData?.nome?.split(" ")[0]}</Text></Text>
                            <Text style={styles.txtSecondary}>Seja bem-vindo</Text>
                        </View>
                    </View>
                    <View style={styles.sectionTitle}>
                        <Text style={styles.txtSectionTitle}>Minhas tarefas</Text>
                    </View>
                    <View style={styles.sectionOptions}>
                        {options.map((opc, i) =>
                            <TouchableOpacity key={i}>
                                <Text style={[styles.txtOptSectionOptions, opc.active === true && { color: '#7a5ee7' }]}>{opc.text}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.campoListagemHorizontal}>
                        <ScrollView contentContainerStyle={styles.listagemHorizontal} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {tarefas.length > 0 ?
                                tarefas.map((t, i) => {
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
                                })
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10 }}>
                                    <ActivityIndicator size={35} color="#33317f" />
                                </View>
                            }
                        </ScrollView>
                    </View>
                    {more_options.map((opc_m, j) =>
                        <TouchableOpacity style={styles.itemRolagem} key={j} onPress={opc_m.link}>
                            <View style={styles.iconeTaskShare}>
                                {opc_m.icon}
                            </View>
                            <View style={styles.campoTxtInfoTaskShare}>
                                <Text style={styles.txtInfoTaskShare}>{opc_m.text}</Text>
                                <Text style={styles.txtSecondaryInfoTaskShare}>{opc_m.more_info}</Text>
                            </View>
                            <View style={styles.iconArrow}>
                                <Feather name="arrow-up-right" size={25} color="black" />
                            </View>
                        </TouchableOpacity>
                    )}
                </ScrollView>
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
    campoRolagem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        paddingHorizontal: 3,
    },
    campoPerfil: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',

        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    fotoPerfil: {
        backgroundColor: '#34308f',
        paddingVertical: 6,
        paddingHorizontal: 6,

        borderRadius: 100,

        elevation: 2
    },
    campoNameUser: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',

        paddingHorizontal: 30,
    },
    txtName: {
        fontSize: 20,
        fontFamily: 'MajorantTRIAL-Md',
    },
    txtBold: {
        fontFamily: 'MajorantTRIAL-Bd',
    },
    txtSecondary: {
        color: '#a1a2a6',
        fontSize: 12,
        marginVertical: 2,
        fontFamily: 'MajorantTRIAL-Md',
    },
    sectionTitle: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',

        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    txtSectionTitle: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
    },
    sectionOptions: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    txtOptSectionOptions: {
        color: '#a9afbe',
        fontFamily: 'MajorantTRIAL-Md',
    },
    campoListagemHorizontal: {
        width: '100%',

        paddingVertical: 10,
        // paddingHorizontal: 10,

        marginVertical: 10,

        // borderWidth: 1
    },
    listagemHorizontal: {
        paddingHorizontal: 3,
        paddingVertical: 3,
    },
    cardTask: {
        width: 180,
        height: 250,

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',

        paddingVertical: 16,
        paddingHorizontal: 16,

        marginHorizontal: 5,
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
    text: {
        fontSize: 18,
    },
    itemRolagem: {
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f1f4fd',
        marginVertical: 5,
        borderRadius: 20,

        paddingVertical: 16,
        paddingHorizontal: 16,

        borderWidth: 0.5,
        borderColor: '#dbe7f4'
    },
    iconeTaskShare: {
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#34308f',
        paddingVertical: 16,
        paddingHorizontal: 16,

        borderRadius: 100,

        elevation: 2
    },
    campoTxtInfoTaskShare: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    txtInfoTaskShare: {
        fontFamily: 'MajorantTRIAL-Md',
    },
    txtSecondaryInfoTaskShare: {
        color: '#a9afbe',
        fontSize: 11.5,
        fontFamily: 'MajorantTRIAL-Rg',
        paddingVertical: 5.5
    },
    iconArrow: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});
