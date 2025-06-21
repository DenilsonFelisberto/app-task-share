import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import Cabecalho from '../../components/Cabecalho';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

export default function AdicionarMembro({ route, navigation }) {

    const { tarefa } = route.params; // Recupera os dados passados
    const [busca, setBusca] = useState('');

    const usuarios = [
        {
            id: 1,
            usuario: 'teste1',
            foto: 'https://img.freepik.com/vetores-premium/ilustracao-de-avatar-de-estudante-icone-de-perfil-de-usuario-avatar-de-jovem_118339-4402.jpg'
        },
        {
            id: 2,
            usuario: 'teste2',
            foto: 'https://img.freepik.com/vetores-premium/ilustracao-de-avatar-de-estudante-icone-de-perfil-de-usuario-avatar-de-jovem_118339-4402.jpg'
        },
        {
            id: 3,
            usuario: 'teste3',
            foto: 'https://img.freepik.com/vetores-premium/ilustracao-de-avatar-de-estudante-icone-de-perfil-de-usuario-avatar-de-jovem_118339-4402.jpg'
        },
        {
            id: 4,
            usuario: 'teste4',
            foto: 'https://img.freepik.com/vetores-premium/ilustracao-de-avatar-de-estudante-icone-de-perfil-de-usuario-avatar-de-jovem_118339-4402.jpg'
        },
        {
            id: 5,
            usuario: 'teste5',
            foto: 'https://img.freepik.com/vetores-premium/ilustracao-de-avatar-de-estudante-icone-de-perfil-de-usuario-avatar-de-jovem_118339-4402.jpg'
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />
            <View style={styles.conteudo}>
                <View style={styles.campoBuscaAdd}>
                    <View style={styles.campoBuscaMeta}>
                        <Feather name="search" size={26} color="#34308f" style={styles.opc} />
                        <TextInput style={styles.input} value={busca} onChangeText={setBusca} placeholder='Informe o nome do usuário...' />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.rolagemDadosUsuarios} showsVerticalScrollIndicator={false}>
                    {usuarios.map((user, i) => {

                        return (
                            <View style={styles.opcUser} key={i}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <View style={styles.fotoPerfil}>
                                        <Image
                                            source={{ uri: user.foto }}
                                            style={{ width: 40, height: 40, borderRadius: 100 }}
                                        />
                                    </View>
                                    <Text style={styles.txtInfoTaskShare}>{user.usuario}</Text>
                                    {/* <FontAwesome6 name="circle-plus" size={25} color="#" /> */}
                                </View>

                                <View style={styles.campoIconAdd}>
                                    <TouchableOpacity style={styles.iconAdd}>
                                        {/* <Feather name="arrow-up-right" size={25} color="black" /> */}
                                        <FontAwesome6 name="circle-plus" size={25} color="#34308f" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

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

        paddingHorizontal: 25,
    },
    campoBuscaAdd: {
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        marginBottom: 10
    },
    campoBuscaMeta: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',

        backgroundColor: '#f1f4fd',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#dbe7f4'
    },
    input: {

        width: '84%',
        color: '#34308f',
        fontSize: 14,
    },
    opc: {
        marginHorizontal: 10,
    },
    rolagemDadosUsuarios: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        paddingHorizontal: 10,
        display: 'flex',
    },
    opcUser: {
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
    fotoPerfil: {
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#34308f',
        paddingVertical: 6,
        paddingHorizontal: 6,
        marginHorizontal: 5,

        borderRadius: 100,

        elevation: 2
    },
    campoIconAdd: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtInfoTaskShare: {
        fontSize: 14,
        fontFamily: 'MajorantTRIAL-Md',
        paddingVertical: 5,
        color: '#8265e4',
        marginHorizontal: 8
    },
    iconAdd: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});