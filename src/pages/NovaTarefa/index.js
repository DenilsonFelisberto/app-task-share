import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    StatusBar,
    ScrollView,
    TextInput,
    Pressable,
    Switch,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { WS_URL } from '../../../config';
import Toast from 'react-native-toast-message';

export default function NovaTarefa({ navigation }) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [alertar, setAlertar] = useState(false);
    const [horarioAlerta, setHorarioAlerta] = useState('');

    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(false);

    // Estado para controlar a exibição do TimePicker
    const [showPicker, setShowPicker] = useState(false);

    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const dataAtual = new Date();

    const [altura, setAltura] = useState(40);

    useEffect(() => {
        // Obter o índice do dia atual da semana
        const diaAtual = new Date().getDay(); // Retorna 0 (Dom) a 6 (Sab)
        setDiaSelecionado(diaAtual); // Define o dia atual como selecionado
    }, [navigation]);

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
            setTitulo("");
            setDescricao("");
            setAlertar(false);
            setHorarioAlerta("");
            setShowPicker(false);
        }, [navigation])
    );

    function criarTarefa() {

        setLoading(true);

        // Pegando a data atual
        const hoje = new Date();

        // Calculando a diferença de dias entre hoje e o dia selecionado
        const diaDaSemanaAtual = hoje.getDay(); // 0 (Domingo) a 6 (Sábado)
        const diferencaDias = diaSelecionado - diaDaSemanaAtual;

        // Ajustando a data com base na diferença
        const dataSelecionada = new Date(hoje);
        dataSelecionada.setDate(hoje.getDate() + diferencaDias);

        // Formatando a data manualmente no formato YYYY-MM-DD
        const ano = dataSelecionada.getFullYear();
        const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
        const dia = String(dataSelecionada.getDate()).padStart(2, '0');

        const diaFormatado = `${ano}-${mes}-${dia}`;

        // Dados da tarefa
        const tarefa = {
            titulo,
            descricao,
            data: diaFormatado,
            alertar,
            horarioAlerta: alertar ? horarioAlerta : null,
            authToken: userData.authToken
        };

        console.log(tarefa); // Para debug

        // Enviar requisição para o servidor
        const enviarTarefa = async () => {
            try {
                const response = await fetch(`${WS_URL}/criar-tarefa`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tarefa),
                });

                const result = await response.json();

                if (result.type === 'success') {
                    setLoading(false);

                    Toast.show({
                        type: 'customToastSuccess',
                        text1: 'Tarefa criada com sucesso!',
                        text2: 'Acesse sua tarefa na listagem abaixo.',
                        visibilityTime: 3000, // Tempo em milissegundos
                    });

                    navigation.replace('TodasAsTarefas'); // Redireciona para a lista de tarefas
                } else {
                    setLoading(false);

                    Toast.show({
                        type: 'customToastError',
                        text1: 'Erro',
                        text2: result.message || 'Falha ao criar tarefa.',
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
            }
        };

        enviarTarefa();
    }

    if (loading) {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size={45} color="#33317f" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <ScrollView contentContainerStyle={styles.rolagemDadosNovaTarefa} showsVerticalScrollIndicator={false}>
                    <View style={styles.tituloPagina}>
                        <Text style={styles.txtTitulo}>Criar nova tarefa</Text>
                    </View>
                    {/* Campo de Título */}
                    <Text style={styles.txtDadoTarefa}>Título</Text>
                    <View style={styles.inputDado}>
                        <TextInput
                            placeholder="Título da tarefa"
                            value={titulo}
                            onChangeText={setTitulo}
                            style={styles.inputText}
                        />
                    </View>

                    {/* Campo de Descrição */}
                    <Text style={styles.txtDadoTarefa}>Descrição</Text>
                    <View style={styles.inputDado}>
                        <TextInput
                            placeholder="Descrição da tarefa"
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

                    {/* Seletor de Data e Hora */}
                    <Text style={styles.txtDadoTarefa}>Data de Início</Text>
                    <View style={styles.seletorData}>
                        <View style={styles.campoDescDataHora}>
                            <Text style={styles.txtDescMes}>Mês atual</Text>

                            <View style={styles.campoMesAtual}>
                                <Text style={styles.mesAtual}>
                                    {dataAtual.toLocaleString('default', { month: 'long' })}
                                </Text>
                                <FontAwesome5 name="calendar-alt" size={16} color="#34308f" />
                            </View>
                        </View>
                        <View style={styles.listaDias}>
                            {diasDaSemana.map((dia, index) => {

                                // Calcula a data correspondente
                                const diaBase = new Date(dataAtual); // Clona a data atual
                                diaBase.setDate(dataAtual.getDate() - dataAtual.getDay() + index); // Ajusta para o dia correspondente da semana

                                return (
                                    <Pressable
                                        key={index}
                                        style={[
                                            styles.botaoDia,
                                            diaSelecionado === index && styles.botaoDiaSelecionado,
                                        ]}
                                        onPress={() => {
                                            setDiaSelecionado(index)
                                        }}
                                    >
                                        {/* Nome do dia da semana */}
                                        <Text
                                            style={[
                                                styles.txtDia,
                                                diaSelecionado === index && styles.txtDiaSelecionado,
                                            ]}
                                        >
                                            {dia.toLocaleUpperCase()}
                                        </Text>
                                        {/* Número do dia */}
                                        <Text
                                            style={[
                                                styles.txtDiaNumero,
                                                diaSelecionado === index && styles.txtDiaSelecionado,
                                            ]}
                                        >
                                            {diaBase.getDate()}
                                        </Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </View>

                    {/* Alternador de Alerta */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.txtAlertar}>Alertar? </Text>
                        <View style={styles.campoSwitch}>
                            <Switch
                                value={alertar}
                                onValueChange={(value) => setAlertar(value)}
                                trackColor={{ false: '#d3d3d3', true: '#8265e4' }} // Cor do trilho
                                thumbColor={alertar ? '#34308f' : '#f4f4f4'} // Cor do botão
                                ios_backgroundColor="#d3d3d3" // Cor de fundo para iOS quando desativado
                            />
                            <Text style={styles.switchText}>
                                {alertar ? 'SIM' : 'NÃO'}
                            </Text>
                            <MaterialCommunityIcons name="bell-alert-outline" size={19} color="#34308f" />
                        </View>
                    </View>

                    {/* Campo de Seleção de Hora para Alerta */}
                    {alertar && (
                        <View style={styles.horarioContainer}>
                            <View style={styles.campoDescSelectHora}>

                                <Text style={styles.txtDescSelectHora}>Hora do Alerta:</Text>

                                <View style={styles.campoSelectHora}>

                                    {/* Botão para abrir o TimePicker */}
                                    <TouchableOpacity
                                        style={styles.buttonPicker}
                                        onPress={() => setShowPicker(true)}
                                    >
                                        <Text style={styles.buttonText}>
                                            {horarioAlerta ? horarioAlerta : 'Selecionar Hora'}
                                        </Text>
                                    </TouchableOpacity>
                                    <MaterialIcons name="more-time" size={19} color="#34308f" />
                                </View>
                            </View>

                            {/* TimePicker */}
                            {showPicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner" // ou "default" para outros estilos
                                    onChange={(event, selectedDate) => {
                                        setShowPicker(false); // Fecha o TimePicker

                                        // Atualiza o estado com o horário selecionado
                                        if (selectedDate) {
                                            const hours = selectedDate.getHours().toString().padStart(2, '0');
                                            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                                            setHorarioAlerta(`${hours}:${minutes}`);
                                        }
                                    }}
                                />
                            )}
                        </View>
                    )}

                    {/* Botão Criar Tarefa */}
                    <View style={styles.botaoContainer}>
                        <TouchableOpacity style={styles.botaoCriarTarefa} onPress={() => criarTarefa()}>
                            <Text style={styles.txtBotaoCriarTarefa}>Criar Tarefa</Text>
                        </TouchableOpacity>
                    </View>
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
    rolagemDadosNovaTarefa: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        paddingHorizontal: 10,
        // borderWidth: 1
    },
    tituloPagina: {
        width: '100%',

        marginBottom: 10
    },
    txtTitulo: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
    },
    horarioContainer: {
        marginTop: 20,
    },
    campoDescSelectHora: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtDescSelectHora: {
        paddingVertical: 12,

        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    campoSelectHora: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
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
    seletorData: {
        width: '100%',
        // marginTop: 10,
    },
    campoDescDataHora: {
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        paddingVertical: 5

        // borderWidth: 1,
    },
    txtDescMes: {
        height: 23,
        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',

        color: '#a1a2a6',
    },
    campoMesAtual: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    mesAtual: {
        height: 23,
        fontSize: 15,
        // fontWeight: 'bold',
        color: '#8265e4',
        // marginBottom: 10,
        fontFamily: 'MajorantTRIAL-Rg',
        paddingHorizontal: 5
    },
    listaDias: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // botaoDia: {
    //     width: 40,
    //     height: 40,
    //     borderRadius: 20,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#f1f4fd',
    // },
    // botaoDiaSelecionado: {
    //     backgroundColor: '#8265e4',
    // },
    // txtDia: {
    //     fontSize: 14,
    //     color: '#000',
    // },
    // txtDiaSelecionado: {
    //     color: '#FFF',
    // },

    botaoDia: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 6,
        borderRadius: 100,
        // backgroundColor: '#f1f4fd', // Cor padrão
    },
    botaoDiaSelecionado: {
        backgroundColor: '#34308f', // Cor de seleção
        paddingHorizontal: 6
    },
    txtDia: {
        fontSize: 12,
        color: '#999', // Cor do texto padrão
        fontFamily: 'MajorantTRIAL-Rg',
    },
    txtDiaSelecionado: {
        color: '#FFF', // Cor do texto quando selecionado
    },
    txtDiaNumero: {
        fontSize: 13,
        color: '#555', // Cor do número do dia
        marginTop: 5,
        fontFamily: 'MajorantTRIAL-Rg',
    },

    switchContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    txtAlertar: {
        fontSize: 15,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    campoSwitch: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    switchText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#8265e4',
        fontFamily: 'MajorantTRIAL-Rg',
        paddingRight: 5
    },

    buttonPicker: {
        // backgroundColor: '#8265e4',
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        // borderRadius: 8,
        // alignItems: 'center',
        // marginTop: 10,
        paddingRight: 5
    },
    buttonText: {
        color: '#8265e4',
        fontSize: 14,
        fontFamily: 'MajorantTRIAL-Rg',
    },

    botaoContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    botaoCriarTarefa: {
        width: '95%',
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