import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PerfilUsuario({ navigation }) {

    const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
    const [userData, setUserData] = useState(null);

    function formatDate(data, formato) {
        if (formato == 'pt-br') {
            return (data.substr(0, 10).split('-').reverse().join('.'));
        } else {
            return (data.substr(0, 10).split('.').reverse().join('-'));
        }
    }

    const fetchUserData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('@usuario');
            if (userJson) {
                const user = JSON.parse(userJson);
                console.log(user);

                setUserData(user);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    // Carregar os dados do AsyncStorage ao montar o componente
    useEffect(() => {

        fetchUserData();
    }, [navigation]);

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

    useFocusEffect(
        useCallback(() => {
            const fetchUpdatedUserData = async () => {
                try {
                    const userJson = await AsyncStorage.getItem('@usuario');
                    if (userJson) {
                        const user = JSON.parse(userJson);
                        setUserData(user);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados atualizados do usuário:', error);
                }
            };

            fetchUpdatedUserData();
        }, [navigation])
    );

    // Método de logout
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('@usuario');
            navigation.replace('Login'); // Redirecionar para a tela de login
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível sair do aplicativo.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <View style={styles.tituloPagina}>
                    <Text style={styles.txtTitulo}>Perfil do usuário</Text>
                </View>
                <ScrollView contentContainerStyle={styles.campoRolagem} showsVerticalScrollIndicator={false}>
                    <View style={styles.campoPerfil}>
                        <View style={styles.fotoPerfil}>
                            {/* {userData && userData.fotoPerfil ?
                                <Image source={{ uri: userData?.fotoPerfil }} style={{ with: 20, height: 20 }} />
                                :
                                <FontAwesome6 name="user-large" size={18} color="#FFF" />
                            } */}
                            {userData && userData.fotoPerfil && (
                                <Image
                                    source={{ uri: userData.fotoPerfil }}
                                    style={{ width: 55, height: 55, borderRadius: 100 }}
                                />
                            )}
                        </View>
                        <View style={styles.campoNameUser}>
                            <Text style={styles.txtName}>
                                Olá, <Text style={styles.txtBold}>{userData?.nome?.split(" ")[0] || 'Usuário'}</Text>
                            </Text>
                            <Text style={styles.txtSecondary}>Seja bem-vindo</Text>
                        </View>
                        <View style={{ position: 'relative' }}>

                            <TouchableOpacity
                                style={styles.btnEditDados}
                                onLongPress={() => setShowDescriptionEdit(true)} // Exibe descrição
                                onPressOut={() => setShowDescriptionEdit(false)} // Esconde descrição ao soltar
                                onPress={() => navigation.navigate('EditarPerfilUsuario', {
                                    onGoBack: () => {
                                        fetchUserData(); // Atualiza os dados após edição
                                    },
                                })}
                            >
                                <Feather name="edit-3" size={16} color="#FFF" />
                            </TouchableOpacity>
                            {showDescriptionEdit && (
                                <View style={styles.description}>
                                    <Text style={styles.descriptionText}>Editar dados</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    {/* <View style={{ width: '100%' }}>
                        {userData && userData.fotoPerfil && (
                            <Image
                                source={{ uri: userData.fotoPerfil }}
                                style={{ width: 100, height: 100 }}
                            />
                        )}
                    </View> */}
                    <View style={styles.campoDados}>
                        <Text style={styles.txtDadoTitulo}>Nome:</Text>
                        <Text style={styles.txtDado}>{userData?.nome || 'Nome não disponível'}</Text>
                        <Text style={styles.txtDadoTitulo}>Data de nascimento:</Text>
                        <Text style={styles.txtDado}>
                            {userData?.dataNascimento != null ? formatDate(userData?.dataNascimento, 'pt-br') : 'Data de nascimento não disponível'}
                        </Text>
                        <Text style={styles.txtDadoTitulo}>E-mail:</Text>
                        <Text style={styles.txtDado}>{userData?.email || 'E-mail não disponível'}</Text>
                    </View>
                    <View style={styles.campoBtnLogout}>
                        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
                            <Text style={styles.txtBtn}>Sair do aplicativo</Text>
                            <Text style={styles.txtIcon}><MaterialIcons name="logout" size={16} color="#FFF" /></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.txtBottom}>Task Share v 1.0.0</Text>
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

        paddingHorizontal: 10,
        marginBottom: 10
    },
    txtTitulo: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
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
        // width: '100%',
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
    btnEditDados: {
        backgroundColor: '#7a5ee7',
        elevation: 1,
        padding: 6,
        borderRadius: 8
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
    campoDados: {
        width: '100%',

        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',

        marginTop: 10,
    },
    txtDadoTitulo: {
        width: '100%',
        textAlign: 'left',
        fontSize: 15,
        paddingHorizontal: 5,
        paddingVertical: 10,
        fontFamily: 'MajorantTRIAL-Md',
    },
    txtDado: {
        width: '100%',
        height: 24,
        textAlign: 'left',
        fontSize: 13,
        paddingHorizontal: 5,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#7a5ee7',
    },
    campoBtnLogout: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 35,
    },
    btnLogout: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtBtn: {
        height: 18,
        // textAlign: 'left',
        fontSize: 14,
        paddingHorizontal: 5,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#000',
    },
    txtIcon: {
        backgroundColor: '#7a5ee7',
        elevation: 1,
        padding: 6,
        borderRadius: 8
    },
    bottom: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBottom: {
        color: '#a1a2a6',
        fontSize: 12,
        marginVertical: 2,
        fontFamily: 'MajorantTRIAL-Md',
    }
});