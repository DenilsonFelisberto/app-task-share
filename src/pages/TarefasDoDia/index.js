import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import MenuFooter from '../../components/MenuFooter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TarefasDoDia({ navigation }) {
    const [currentWeek, setCurrentWeek] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const [activeCard, setActiveCard] = useState(null); // Estado para o card ativo

    const tarefas = [
        {
            id: 1,
            title: "Design Meeting",
            time: "09:30",
            description: "Make a landing page app and mobile",
            participants: [/* Adicione imagens dos participantes aqui */],
        },
        {
            id: 2,
            title: "Team Meeting",
            time: "10:30",
            description: "Lorem ipsum dolor sit amet consectetur.",
        },
        {
            id: 3,
            title: "Client Update",
            time: "11:00",
            description: "Lorem ipsum dolor sit amet consectetur.",
        },
        {
            id: 4,
            title: "Design Meeting",
            time: "09:30",
            description: "Make a landing page app and mobile",
            participants: [/* Adicione imagens dos participantes aqui */],
        },
        {
            id: 5,
            title: "Team Meeting",
            time: "10:30",
            description: "Lorem ipsum dolor sit amet consectetur.",
        },
        {
            id: 6,
            title: "Client Update",
            time: "11:00",
            description: "Lorem ipsum dolor sit amet consectetur.",
        },
    ];

    const handlePressIn = (id) => {
        setActiveCard(id);
    };

    const handlePressOut = () => {
        setActiveCard(null);
    };

    useEffect(() => {
        //captura e renderiza os dias da semana atual e marca o dia atual
        const getCurrentWeek = () => {
            const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
            const today = new Date();
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Domingo
            const week = [];

            for (let i = 0; i < 7; i++) {
                const day = new Date(firstDayOfWeek);
                day.setDate(firstDayOfWeek.getDate() + i);
                week.push({
                    day: daysOfWeek[i],
                    date: day.getDate(),
                });
            }

            setCurrentWeek(week);

            // Define o dia atual como selecionado
            const todayDate = new Date().getDate();
            setSelectedDay(todayDate);
        };

        getCurrentWeek();
    }, []);

    const handleDayPress = (day) => {
        setSelectedDay(day.date);
        Alert.alert("Dia Selecionado", `Você selecionou ${day.day}, ${day.date}`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <View style={styles.tituloPagina}>
                    <Text style={styles.txtSecondary}>3 de janeiro de 2025</Text>
                    <Text style={styles.txtTitulo}>Tarefas do dia</Text>
                </View>
                <View style={styles.sectionDiasSemanaAtual}>
                    <View style={styles.diasSemanaRow}>
                        {currentWeek.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.diaSemana}
                                onPress={() => handleDayPress(day)}
                            >
                                <Text
                                    style={[
                                        styles.diaTexto,
                                        day.date === selectedDay && styles.diaSelecionado,
                                    ]}
                                >
                                    {day.day}
                                </Text>
                                <Text
                                    style={[
                                        styles.dataTexto,
                                        day.date === selectedDay && styles.dataSelecionada,
                                    ]}
                                >
                                    {day.date}
                                </Text>
                                {day.date === selectedDay &&
                                    <FontAwesome name="circle" size={4} color="#8265e4" />
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.campoListaTarefasDoDia}>
                    <ScrollView contentContainerStyle={styles.rolagemListaTarefasDoDia} showsVerticalScrollIndicator={false}>
                        {tarefas.map((tarefa, index) => (
                            <View key={tarefa.id} style={styles.cardContainer}>
                                {/* Linha vertical */}
                                {index !== tarefas.length - 1 && ( // Mostrar a linha apenas se não for o último card
                                    <View style={styles.verticalLine} />
                                )}

                                {/* Círculo na ponta */}
                                <View style={[styles.circle, index == 0 && { left: -8, }]}>
                                    {index == 0 ?
                                        <FontAwesome6 name="circle-dot" size={18} color="#a1a2a6" />
                                        :
                                        <FontAwesome name="circle" size={16} color="#a1a2a6" />
                                    }
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.card,
                                        // tarefa.id === activeCard && styles.cardAtivo, // Cor ativa
                                        index == 0 && { backgroundColor: '#34308f', borderColor: '#34308f', elevation: 2 }
                                    ]}
                                    // onPressIn={() => handlePressIn(tarefa.id)}
                                    // onPressOut={handlePressOut}
                                >
                                    <View style={[styles.cardHeader, index == 0 && { color: '#FFF' }]}>
                                        <Text style={[styles.cardTitle, index == 0 && { color: '#FFF' }]}>{tarefa.title}</Text>
                                        <Text style={[styles.cardTime, index == 0 && { color: '#FFF' }]}>{tarefa.time}</Text>
                                    </View>
                                    <Text style={[styles.cardDescription, index == 0 && { color: '#FFF' }]}>{tarefa.description}</Text>
                                    {tarefa.participants && (
                                        <View style={styles.participants}>
                                            {tarefa.participants.map((participant, index) => (
                                                <Image
                                                    key={index}
                                                    source={{ uri: participant }}
                                                    style={styles.participantImage}
                                                />
                                            ))}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

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
    },
    txtTitulo: {
        fontSize: 22,
        fontFamily: 'MajorantTRIAL-Md',
    },
    txtSecondary: {
        color: '#a1a2a6',
        fontSize: 13,
        marginVertical: 4,
        fontFamily: 'MajorantTRIAL-Md',
    },
    sectionDiasSemanaAtual: {
        // marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        paddingHorizontal: 10,
        paddingVertical: 35,
    },
    diasSemanaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    diaSemana: {
        alignItems: 'center',
    },
    diaTexto: {
        fontSize: 11,
        color: '#a1a2a6',
        fontFamily: 'MajorantTRIAL-Rg',
    },
    dataTexto: {
        fontSize: 12,
        fontFamily: 'MajorantTRIAL-Md',
        // fontWeight: 'bold',
        color: '#000',
        paddingVertical: 6,
    },
    diaSelecionado: {
        color: '#8265e4',
    },
    dataSelecionada: {
        color: '#8265e4',
    },
    campoListaTarefasDoDia: {
        width: '100%',

        flex: 1,
    },
    rolagemListaTarefasDoDia: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        paddingHorizontal: 3,
    },
    rolagemListaTarefasDoDia: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    verticalLine: {
        position: "absolute",
        right: 0,
        // top: 0,
        bottom: 0,
        left: 0,
        width: 2.5,
        height: '80%',
        backgroundColor: "#ddd", // Cor da linha
        // marginLeft: 5,
    },
    circle: {
        position: "absolute",
        // right: -8, // Ajuste horizontal para o círculo
        top: 8, // Centraliza verticalmente
        left: -6,
        transform: [{ translateY: -10 }], // Compensa o tamanho do círculo
        // width: 16,
        // height: 16,
        // backgroundColor: "#8265e4", // Cor do círculo
        borderRadius: 8, // Faz o círculo
    },
    card: {
        flex: 1,
        backgroundColor: "#f1f4fd",

        paddingVertical: 20,
        paddingHorizontal: 20,

        borderRadius: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        marginLeft: 18,

        borderWidth: 0.5,
        borderColor: '#dbe7f4'
    },
    cardAtivo: {
        backgroundColor: "#8265e4",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        // fontWeight: "bold",
        color: "#a1a2a6",
        fontFamily: 'MajorantTRIAL-Md',
        height: 24,
    },
    cardTime: {
        fontSize: 14,
        color: "#a1a2a6",
        fontFamily: 'MajorantTRIAL-Md',
    },
    cardDescription: {
        fontSize: 12,
        color: "#555",
        marginBottom: 10,
    },
    participants: {
        flexDirection: "row",
        marginTop: 10,
    },
    participantImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
});
