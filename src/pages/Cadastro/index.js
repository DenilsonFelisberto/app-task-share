import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { WS_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro({ navigation }) {

    const [nome, setNome] = useState('Denilson Medeiros');
    const [dataNascimento, setDataNascimento] = useState('1996-04-19');
    const [email, setEmail] = useState('12345@gmail.com');
    const [senha, setSenha] = useState('12345');
    const [confirmSenha, setConfirmSenha] = useState('12345');
    const [mostraSenha, setMostraSenha] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    function formatDate(data, formato) {
        if (formato == 'pt-br') {
            return (data.substr(0, 10).split('-').reverse().join('.'));
        } else {
            return (data.substr(0, 10).split('.').reverse().join('-'));
        }
    }

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            setDataNascimento(formattedDate);
        }
    };

    const handleCadastro = async () => {
        // Validação básica
        if (!nome || !dataNascimento || !email || !senha || !confirmSenha) {
            Toast.show({
                type: 'customToastWarning',
                text1: 'Atenção!',
                text2: 'Por favor, preencha todos os campos!',
                position: 'top',
                visibilityTime: 3000, // Tempo em milissegundos
            });
            return;
        }

        // Validação de senha
        if (senha !== confirmSenha) {
            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: 'As senhas não coincidem.',
                visibilityTime: 3000, // Tempo em milissegundos
            });
            return;
        }

        setLoading(true);

        try {
            let data = {};

            data['nome'] = nome;
            data['data_nascimento'] = dataNascimento;
            data['email'] = email;
            data['senha'] = senha;

            const response = await fetch(`${WS_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Extrair o JSON da resposta
            const result = await response.json();

            if (result.type === 'success') {
                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Cadastro realizado com sucesso!',
                    text2: 'Você será redirecionado para a tela de login.',
                    visibilityTime: 3000, // Tempo em milissegundos
                });

                await AsyncStorage.setItem('@usuario', result.usuario); // Salvando dados do usuário
                navigation.replace('Home'); // Redirecionando para a tela Home
            } else {
                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Falha ao realizar cadastro.',
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
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* <View style={styles.conteudo}> */}
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

                    {/* Campo de Nome */}
                    <Text style={styles.txtDadoNome}>Nome</Text>
                    <View style={styles.inputNome}>
                        <TextInput
                            placeholder="Informe seu nome completo"
                            value={nome}
                            onChangeText={setNome}
                            style={styles.inputText}
                        />
                    </View>

                    {/* Campo de Data de Nascimento */}
                    <Text style={styles.txtDadoDataNasc}>Data de Nascimento</Text>
                    <TouchableOpacity
                        style={styles.inputDataNasc}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.inputTextDataNasc}>
                            {formatDate(dataNascimento, 'pt-br') || 'Selecionar...'}
                        </Text>
                        {/* <FontAwesome5 name="calendar-alt" size={20} color="#34308f" /> */}
                        <AntDesign name="calendar" size={21} color="#34308f" />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

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

                    {/* Campo de confirma Senha */}
                    <Text style={styles.txtDadoSenha}>Confirmar senha</Text>
                    <View style={styles.inputSenha}>
                        <TextInput
                            placeholder="Confirme sua senha"
                            value={confirmSenha}
                            onChangeText={setConfirmSenha}
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
                            style={styles.botaoCadastro}
                            onPress={handleCadastro}
                            disabled={loading}
                        >
                            <Text style={styles.txtBotaoCadastro}>
                                {loading ? 'Carregando...' : 'Cadastrar-se'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.txtBottom}>Task Share v 1.0.0</Text>
                </View>
            </ScrollView>
            {/* </View> */}
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

    txtDadoNome: {
        width: '90%',
        textAlign: 'left',

        paddingTop: 14,
        paddingBottom: 8,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    inputNome: {
        width: '90%',

        backgroundColor: '#f1f4fd',

        borderWidth: 0.5,
        borderColor: '#dbe7f4',

        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },

    txtDadoDataNasc: {

        width: '90%',
        textAlign: 'left',

        paddingTop: 14,
        paddingBottom: 8,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    inputDataNasc: {
        width: '90%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        backgroundColor: '#f1f4fd',

        borderWidth: 0.5,
        borderColor: '#dbe7f4',

        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 19,
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
    inputTextDataNasc: {
        // width: '100%',
        color: '#34308f',
        fontSize: 14.5,
        fontFamily: 'MajorantTRIAL-Rg',
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
    botaoCadastro: {
        width: '90%',
        backgroundColor: '#8265e4',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',

        elevation: 1
    },
    txtBotaoCadastro: {
        height: 28,
        color: '#FFF',
        fontSize: 16,
        // fontWeight: 'bold',
        // fontSize: 15,
        paddingVertical: 5,
        fontFamily: 'MajorantTRIAL-Rg',
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