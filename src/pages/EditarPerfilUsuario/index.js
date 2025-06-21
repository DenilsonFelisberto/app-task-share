import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cabecalho from '../../components/Cabecalho';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { WS_URL } from '../../../config';
import { useRoute } from '@react-navigation/native';

export default function EditarPerfilUsuario({ navigation }) {
    const route = useRoute(); // Obtém os parâmetros da navegação
    
    const [authToken, setAuthToken] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [base64Foto, setBase64Foto] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

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

    const pickImage = async () => {
        // Solicita permissão para acessar a galeria
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma imagem.');
            return;
        }

        // Abre a galeria para selecionar uma imagem
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Garante proporção quadrada
            quality: 1,
        });

        if (!result.canceled) {
            // const croppedImage = await cropImage(result.assets[0].uri);
            // setSelectedImage(croppedImage.uri);

            // Converte o caminho da imagem para base64
            const base64Image = await convertToBase64(result.assets[0].uri);
            setSelectedImage(base64Image); // Armazena a imagem em base64
        }
    };

    const convertToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`; // Prefixa o formato da imagem
        } catch (error) {
            console.error('Erro ao converter imagem para base64:', error);
            Alert.alert('Erro', 'Não foi possível converter a imagem para base64.');
            return null;
        }
    };

    // const cropImage = async (uri) => {
    //     try {
    //         // Usa o manipulador para cortar e ajustar a imagem
    //         const manipulatedImage = await ImageManipulator.manipulateAsync(
    //             uri,
    //             [{ resize: { width: 300, height: 300 } }], // Redimensiona para 300x300
    //             { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true } // Converte para base64
    //         );
    //         return manipulatedImage;
    //     } catch (error) {
    //         console.error('Erro ao manipular a imagem:', error);
    //         Alert.alert('Erro', 'Não foi possível cortar a imagem.');
    //     }
    // };

    // Carregar os dados do usuário ao montar o componente
    useEffect(() => {
        const fetchUserData = async () => {
            const userJson = await AsyncStorage.getItem('@usuario');
            if (userJson) {
                const user = JSON.parse(userJson);
                setNome(user.nome);
                setEmail(user.email);
                setDataNascimento(user.dataNascimento);
                setFotoPerfil(user.fotoPerfil);
                setAuthToken(user.authToken);
            }
        };
        fetchUserData();
    }, []);

    // Função para enviar os dados para a API
    const handleSave = async () => {
        const user = {
            authToken,
            nome,
            email,
            dataNascimento,
            fotoPerfil: selectedImage || fotoPerfil,
        };

        setLoading(true);

        try {
            const response = await fetch(`${WS_URL}/usuario/atualizar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const updatedUser = await response.json();

            if (updatedUser.type === 'success') {
                
                console.log(updatedUser);

                await AsyncStorage.setItem('@usuario', updatedUser.usuario);

                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso!',
                    text2: 'Dados atualizados com sucesso!',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
                // Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
                navigation.goBack();
                if (route.params?.onGoBack) {
                    route.params.onGoBack(); // Chama a função passada
                }
            } else {
                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: updatedUser.message,
                    visibilityTime: 3000, // Tempo em milissegundos
                });
            }

            console.log(updatedUser.type);
            console.log(updatedUser.message);

        } catch (error) {
            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: 'Não foi possível atualizar os dados.',
                visibilityTime: 3000, // Tempo em milissegundos
            });
            console.error('Erro ao salvar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <Cabecalho navigation={navigation} />

            <View style={styles.conteudo}>
                <View style={styles.tituloPagina}>
                    <Text style={styles.txtTitulo}>Editar perfil</Text>
                </View>
                <ScrollView contentContainerStyle={styles.campoRolagem} showsVerticalScrollIndicator={false}>

                    <Text style={styles.label}>Nome:</Text>

                    <View style={styles.inputDado}>
                        <TextInput style={styles.input} value={nome} onChangeText={setNome} />
                    </View>

                    <Text style={styles.label}>E-mail:</Text>

                    <View style={styles.inputDado}>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                    </View>

                    <Text style={styles.label}>Data de Nascimento:</Text>

                    {/* <View style={styles.inputDado}>
                        <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} />
                    </View> */}

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

                    <Text style={styles.label}>Foto de Perfil:</Text>
                    {/* {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.image} />
            ) : (
                <Text>Nenhuma foto selecionada</Text>
            )} */}
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonTextFoto}>Alterar foto...</Text>

                        <MaterialIcons name="add-photo-alternate" size={22} color="#34308f" />
                    </TouchableOpacity>

                    {/* <Button title="Escolher Imagem" onPress={pickImage} /> */}

                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    )}

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Salvar alterações'}</Text>
                    </TouchableOpacity>
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
    label: {
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
    input: {
        // borderWidth: 1, 
        // borderColor: '#ccc', 
        // padding: 10, 
        // borderRadius: 5, 
        // marginTop: 5 

        width: '100%',
        color: '#34308f',
        fontSize: 14.5,
    },
    inputDataNasc: {
        width: '100%',

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

    inputTextDataNasc: {
        // width: '100%',
        color: '#34308f',
        fontSize: 14.5,
        fontFamily: 'MajorantTRIAL-Rg',
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
        elevation: 2,
    },
    button: {
        // backgroundColor: '#007BFF',
        // padding: 10,
        // borderRadius: 5,
        // marginTop: 10,
        width: '100%',

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
    saveButton: {
        width: '100%',
        backgroundColor: '#8265e4',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',

        elevation: 1,

        marginVertical: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        // fontWeight: 'bold',
        // fontSize: 15,
        paddingVertical: 5,
        fontFamily: 'MajorantTRIAL-Rg',
    },
    buttonTextFoto: {

        color: '#34308f',
        fontSize: 14.5,
        fontFamily: 'MajorantTRIAL-Rg',

        borderWidth: 1,
        borderColor: '#f1f4fd',
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 20,
        elevation: 2
    },
});
