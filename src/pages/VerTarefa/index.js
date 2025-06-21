import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, StatusBar, Pressable, TouchableOpacity } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { Alert } from 'react-native';

export default function VerTarefa({ route, navigation }) {

    const { tarefa } = route.params; // Recupera os dados passados
    const [userData, setUserData] = useState(null);

    const more_options = [
        {
            icon: <FontAwesome5 name="tasks" size={22} color="#FFF" />,
            text: "Metas",
            more_info: `${tarefa.total_tarefas}/${tarefa.total_concluidas}`,
            link: () => navigation.navigate('MetasTarefa', { tarefa }),
        },
        {
            icon: <Entypo name="slideshare" size={22} color="#FFF" />,
            text: "Membros",
            more_info: tarefa.total_membros,
            link: () => navigation.navigate('MembrosTarefa', { tarefa }),
        },
    ];

    function formatDate(data, formato) {
        if (formato == 'pt-br') {
            return (data.substr(0, 10).split('-').reverse().join('.'));
        } else {
            return (data.substr(0, 10).split('.').reverse().join('-'));
        }
    }

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <View style={styles.tituloPagina}>
                    <Text style={styles.txtTitulo}>Dados da tarefa</Text>
                </View>
                <ScrollView contentContainerStyle={styles.rolagemDadosTarefa} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Título</Text>
                    <Text style={styles.content}>{tarefa.titulo}</Text>

                    <Text style={styles.title}>Descrição</Text>
                    <Text style={styles.content}>{tarefa.descricao}</Text>

                    <Text style={styles.title}>Data de início</Text>
                    <Text style={styles.content}>{formatDate(tarefa.dataInicioTarefa, 'pt-br')}</Text>

                    {tarefa.alertar === 'true' &&
                        <>
                            <Text style={styles.title}>Alertar às </Text>
                            <Text style={styles.content}>{tarefa.horaInicioTarefa} hrs</Text>
                        </>
                    }

                    <Text style={styles.title}>Progresso</Text>
                    <View style={styles.campoProgress1}>
                        <Pressable style={styles.cardTask}>
                            {/* User interface design */}
                            <View style={styles.campoProgress}>
                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressBar, { width: `${tarefa.progress}%` }]} />
                                </View>
                            </View>
                        </Pressable>
                        <Text style={styles.contentProgress}>{tarefa.progress}% concluída</Text>
                    </View>

                    <Text style={styles.title}>Outras informações</Text>
                    {more_options.map((opc_m, j) =>
                        <TouchableOpacity style={styles.itemRolagem} key={j} onPress={opc_m.link}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <View style={styles.iconeTaskShare}>
                                    {opc_m.icon}
                                </View>
                                <Text style={styles.txtInfoTaskShare}>{opc_m.text}</Text>
                            </View>

                            <View style={styles.campoTxtInfoTaskShare}>
                                <Text style={styles.txtSecondaryInfoTaskShare}>{opc_m.more_info}</Text>
                                <View style={styles.iconArrow}>
                                    <Feather name="arrow-up-right" size={25} color="black" />
                                </View>
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
    tituloPagina: {
        width: '100%',

        marginHorizontal: 10,
        marginBottom: 10
    },
    txtTitulo: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
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
    title: {
        width: '100%',
        height: 32,
        fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',
        paddingVertical: 5,
        color: '#8265e4',
    },
    content: {
        width: '100%',

        fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',

        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 3,
        color: '#34308f',
    },

    contentProgress: {
        width: '50%',

        fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',

        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 15,
        color: '#34308f',
    },

    campoProgress1: {
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        marginBottom: 3
    },
    cardTask: {
        width: '50%',

        backgroundColor: '#34308f',

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',

        paddingVertical: 16,
        paddingHorizontal: 16,

        marginVertical: 5,
        borderRadius: 20,

        elevation: 2,
    },
    campoProgress: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        // paddingVertical: 5,
    },
    progressContainer: {
        height: 5,
        width: '100%',
        backgroundColor: '#DDD', // Cor do fundo da barra de progresso
        borderRadius: 5,
        overflow: 'hidden',
        // marginTop: 8,
        opacity: 0.65,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFF', // Cor da barra de progresso
        borderRadius: 5,
        opacity: 1,
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
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginHorizontal: 5,

        borderRadius: 100,

        elevation: 2
    },
    campoTxtInfoTaskShare: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtInfoTaskShare: {
        fontSize: 18,
        fontFamily: 'MajorantTRIAL-Md',
        paddingVertical: 5,
        color: '#000',
        marginHorizontal: 8
    },
    txtSecondaryInfoTaskShare: {
        color: '#a1a2a6',
        fontSize: 14,
        fontFamily: 'MajorantTRIAL-Rg',
        paddingVertical: 5.5
    },
    iconArrow: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});