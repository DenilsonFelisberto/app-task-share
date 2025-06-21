import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRoute } from '@react-navigation/native';

export default function Cabecalho({ navigation, dataTarefaUser }) {
    const route = useRoute();

    const [showDescription, setShowDescription] = useState(false);

    return (
        <View style={styles.container}>
            {route.name == "Home" && (
                <View style={styles.campoLogo}>
                    <Text style={styles.txtLeft}>Task</Text>
                    <Text style={styles.txtRight}>Share</Text>
                </View>
            )}
            {route.name !== "Home" && (
                <TouchableOpacity style={styles.opcBack} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#8265e4" />
                </TouchableOpacity>
            )}
            <View style={styles.campoOpc}>
                {route.name === "TarefasDoDia" ?
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity
                            style={styles.opc}
                            onLongPress={() => setShowDescription(true)} // Exibe descrição
                            onPressOut={() => setShowDescription(false)} // Esconde descrição ao soltar
                        >
                            <Feather name="settings" size={24} color="black" />
                        </TouchableOpacity>
                        {showDescription && (
                            <View style={styles.description}>
                                <Text style={styles.descriptionText}>Ajustar calendário</Text>
                            </View>
                        )}
                    </View>
                    :
                    (route.name === "VerTarefa" ?
                        <View style={{ position: 'relative' }}>
                            <TouchableOpacity
                                style={styles.opc}
                                onLongPress={() => setShowDescription(true)} // Exibe descrição
                                onPressOut={() => setShowDescription(false)} // Esconde descrição ao soltar
                            >
                                <Octicons name="share-android" size={24} color="black" />
                            </TouchableOpacity>
                            {showDescription && (
                                <View style={styles.description}>
                                    <Text style={styles.descriptionText}>Compartilhar tarefa</Text>
                                </View>
                            )}
                        </View>
                        :
                        (route.name === "MetasTarefa" ?

                            <Text style={styles.txtTituloMT}>Metas da tarefa</Text>
                            :
                            (route.name === "AdicionarMeta" ?
                                <Text style={styles.txtTituloMT}>Adicionar meta</Text>
                                :
                                (route.name === "MembrosTarefa" ?
                                    <Text style={styles.txtTituloMT}>Membros da tarefa</Text>
                                    :
                                    (route.name === "AdicionarMembro" ?
                                        <Text style={styles.txtTituloMT}>Adicionar membros</Text>
                                        :
                                        <View style={{ position: 'relative' }}>
                                            <TouchableOpacity
                                                style={styles.opc}
                                                onLongPress={() => setShowDescription(true)} // Exibe descrição
                                                onPressOut={() => setShowDescription(false)} // Esconde descrição ao soltar
                                            >
                                                <Feather name="search" size={26} color="black" />
                                            </TouchableOpacity>
                                            {showDescription && (
                                                <View style={styles.description}>
                                                    <Text style={styles.descriptionText}>Buscar tarefas</Text>
                                                </View>
                                            )}
                                        </View>
                                    )
                                )
                            )
                        )
                    )
                }
                <TouchableOpacity>
                    <Octicons name="question" size={24} color="#8265e4" />
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        // position: 'relative', // Permite posicionar a descrição em relação ao ícone

        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 25,
        paddingHorizontal: 30,
    },
    campoLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    txtLeft: {
        marginHorizontal: 2,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#8265e4',
        fontSize: 18,
    },
    txtRight: {
        marginHorizontal: 2,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#34308f',
        fontSize: 18,
    },
    opcBack: {

    },
    campoOpc: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    txtTituloMT: {
        marginHorizontal: 10,
        fontFamily: 'MajorantTRIAL-Md',
        color: '#000',
        fontSize: 14,
    },
    opc: {
        marginHorizontal: 10
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
});
