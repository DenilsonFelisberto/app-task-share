import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRoute } from '@react-navigation/native';

export default function MenuFooter({ navigation }) {

    const route = useRoute();  // Obtém a rota atual

    const [showDescriptionMenuFooter, setShowDescriptionMenuFooter] = useState(false);
    const [textDescripion, setTextDescripion] = useState('');

    const [selectedOption, setSelectedOption] = useState(0); // Estado para armazenar a opção selecionada, inicializa com o índice da página inicial (Home)

    const options = [
        {
            name: 'Home',
            icon: <AntDesign name="home" size={26} color="#7a5ee7" />,
            link: () => {
                setSelectedOption(0);
                navigation.navigate('Home')
            },
            descricao: "Início",
        },
        {
            name: 'TarefasDoDia',
            icon: <AntDesign name="calendar" size={24} color="black" />,
            link: () => {
                setSelectedOption(1);
                navigation.navigate('TarefasDoDia')
            },
            descricao: "Tarefas do dia",
        },
        {
            name: '',
            icon: <AntDesign name="plus" size={26} color="#FFF" />,
            link: () => {
                navigation.navigate('NovaTarefa')
            },
            descricao: "Criar tarefa",
        },
        {
            name: 'TodasAsTarefas',
            icon: <AntDesign name="filetext1" size={22} color="black" />,
            link: () => {
                setSelectedOption(3);
                navigation.navigate('TodasAsTarefas')
            },
            descricao: "Todas as tarefas",
        },
        {
            name: 'PerfilUsuario',
            icon: <FontAwesome6 name="user" size={21} color="black" />,
            link: () => {
                setSelectedOption(4);
                navigation.navigate('PerfilUsuario')
            },
            descricao: "Perfil do usuário",
        },
    ];

    return (
        <View style={styles.container}>
            {options.map((opc, i) => {
                // const iconColor = i === selectedOption ? '#7a5ee7' : (i === 2 ? '#FFF' : 'black'); // Cor com base no estado

                const isActive = route.name === opc.name; // Verifica se a rota atual corresponde ao botão

                return (
                    <TouchableOpacity
                        key={i}
                        style={[styles.opcMenu, i == 2 && styles.buttonAddTask]}
                        onPress={opc.link}
                        onLongPress={() => {
                            setShowDescriptionMenuFooter(true)
                            setTextDescripion(opc.descricao)
                        }} // Exibe descrição
                        onPressOut={() => setShowDescriptionMenuFooter(false)} // Esconde descrição ao soltar
                    >
                        {/* <Text>{React.cloneElement(opc.icon, { color: iconColor })}</Text> */}
                        <Text>{React.cloneElement(opc.icon, { color: isActive ? "#7a5ee7" : (i === 2 ? '#FFF' : 'black') })}</Text>
                    </TouchableOpacity>

                );
            })}
            {showDescriptionMenuFooter && (
                <View style={styles.descriptionMenu}>
                    <Text style={styles.descriptionMenuText}>{textDescripion}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative', // Permite posicionar a descrição em relação ao ícone

        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    opcMenu: {
        width: '15%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // borderWidth: 1,

        paddingVertical: 15
    },
    buttonAddTask: {
        height: '100%',
        backgroundColor: '#7a5ee7',
        borderRadius: 18,
        elevation: 2
    },
    descriptionMenu: {
        position: 'absolute',
        width: '100%',
        top: -15, // Posiciona abaixo do botão
        // right: 0,
        // left: 0,

        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        opacity: 0.9,
    },
    descriptionMenuText: {
        width: '100%',

        textAlign: 'center',
        color: '#FFF',
        fontSize: 12,
    },
});
