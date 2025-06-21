import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { WS_URL } from '../../../config';
import { useFocusEffect } from '@react-navigation/native';

export default function Login({ navigation }) {

    const [email, setEmail] = useState('12345@gmail.com');
    const [senha, setSenha] = useState('12345');
    const [mostraSenha, setMostraSenha] = useState(false);
    const [loading, setLoading] = useState(false);

    // Verificar se os dados existem sempre que a tela ganhar foco
    useFocusEffect(
        useCallback(() => {
            const checkUserData = async () => {
                try {
                    const userJson = await AsyncStorage.getItem('@usuario');
                    if (userJson) {
                        navigation.replace('Home'); // Redireciona para a tela de login
                    }
                } catch (error) {
                    console.error('Erro ao verificar dados do usuário:', error);
                }
            };

            checkUserData();
        }, [navigation])
    );

    const handleLogin = async () => {
        if (!email || !senha) {
            Toast.show({
                type: 'customToastWarning',
                text1: 'Atenção!',
                text2: 'Por favor, preencha todos os campos!',
                position: 'top',
                visibilityTime: 3000, // Tempo em milissegundos
            });
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(`${WS_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const responseData = await response.json();

            if (response.ok && responseData.type === 'success') {
                const usuario = JSON.parse(responseData.usuario); // Parse do JSON retornado
                await AsyncStorage.setItem('@usuario', JSON.stringify(usuario)); // Armazena no AsyncStorage
                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso!',
                    text2: 'Login realizado com sucesso!',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
                navigation.replace('Home'); // Redireciona para a Home
            } else {
                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: responseData.message || 'Falha ao realizar login.',
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                <View style={styles.top}>
                    <TouchableOpacity>
                        <Octicons name="question" size={24} color="#8265e4" />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <View style={styles.campoLogoName}>
                        <Image source={require('../../../assets/logo.png')} style={styles.imgLogo} />
                        <View style={styles.campoLogo}>
                            <Text style={styles.txtLeft}>Task</Text>
                            <Text style={styles.txtRight}>Share</Text>
                        </View>
                        <Text style={styles.txtDescApp}>Seu app de criação e compartilhamento de tarefas</Text>
                    </View>
                    {/* Campo de E-mail */}
                    <Text style={styles.txtDadoEmail}>E-mail</Text>
                    <View style={styles.inputEmail}>
                        <TextInput
                            placeholder="Informe seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.inputText}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {/* Campo de Senha */}
                    <Text style={styles.txtDadoSenha}>Senha</Text>
                    <View style={styles.inputSenha}>
                        <TextInput
                            placeholder="Informe sua senha"
                            value={senha}
                            onChangeText={setSenha}
                            style={styles.inputTextSenha}
                            secureTextEntry={!mostraSenha}
                        />
                        <TouchableOpacity style={styles.btnMostraSenha} onPress={() => setMostraSenha(!mostraSenha)}>
                            <Feather name={mostraSenha === false ? "eye" : "eye-off"} size={22} color="#34308f" />
                        </TouchableOpacity>
                    </View>
                    {/* Botão Acessar */}
                    <View style={styles.botaoContainer}>
                        <TouchableOpacity
                            style={styles.botaoLogin}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.txtBotaoLogin}>
                                {loading ? 'Carregando...' : 'Fazer login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.campoCadastro}>
                        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                            <Text style={styles.txtCadastro}>Cadastrar-se {'>>'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.txtBottom}>Task Share v 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'column',
        flexGrow: 1,
        paddingHorizontal: 25,
        backgroundColor: '#FFF',
    },
    conteudo: {
        // width: '100%',
        flexGrow: 1,

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',

        // paddingHorizontal: 25,

    },
    top: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    center: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    bottom: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    campoLogoName: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    imgLogo: {
        width: 85,
        height: 85,
        resizeMode: 'contain',
        borderRadius: 14,
        elevation: 2
    },
    campoLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

        paddingVertical: 20
    },
    txtLeft: {
        marginHorizontal: 2,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#8265e4',
        fontSize: 26,
    },
    txtRight: {
        marginHorizontal: 2,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#34308f',
        fontSize: 26,
    },
    txtDescApp: {
        width: '75%',
        textAlign: 'center',
        color: '#a1a2a6',
        fontSize: 12,
        fontFamily: 'MajorantTRIAL-Md',
    },
    txtDadoEmail: {
        width: '90%',
        textAlign: 'left',

        paddingTop: 14,
        paddingBottom: 8,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    inputEmail: {
        width: '90%',

        backgroundColor: '#f1f4fd',

        borderWidth: 0.5,
        borderColor: '#dbe7f4',

        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    txtDadoSenha: {
        width: '90%',
        textAlign: 'left',

        paddingTop: 14,
        paddingBottom: 8,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    inputSenha: {
        width: '90%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

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
    inputTextSenha: {
        width: '84%',
        color: '#072967',
        fontSize: 14.5,
    },
    btnMostraSenha: {
        width: '20%',

        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    botaoLogin: {
        width: '90%',
        backgroundColor: '#8265e4',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',

        elevation: 1
    },
    txtBotaoLogin: {
        height: 28,
        color: '#FFF',
        fontSize: 16,
        // fontWeight: 'bold',
        // fontSize: 15,
        paddingVertical: 5,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    campoCadastro: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    txtCadastro: {
        color: '#8265e4',
        fontSize: 14,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    txtBottom: {
        color: '#a1a2a6',
        fontSize: 12,
        marginVertical: 2,
        fontFamily: 'MajorantTRIAL-Md',
    }
});