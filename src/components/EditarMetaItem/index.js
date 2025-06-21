import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WS_URL } from "../../../config";
import Toast from "react-native-toast-message";

const EditarMetaItem = ({ meta, authToken, onUpdate }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [descricao, setDescricao] = useState(meta.descricao);
    const [altura, setAltura] = useState(40);

    const salvarEdicao = async () => {
        try {
            const response = await fetch(`${WS_URL}/editar-meta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: authToken,
                    id_meta: meta.id,
                    descricao: descricao
                }),
            });

            const result = await response.json();

            if (result.type === "success") {
                onUpdate(); // Atualiza a lista de metas na tela
                setModalVisible(false);

                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso!',
                    text2: result.message,
                    visibilityTime: 3000,
                });
            } else {
                console.error("Erro ao editar meta:", result.message);

                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Erro ao editar a meta.',
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            console.error("Erro na requisição:", error);

            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: 'Não foi possível conectar ao servidor.',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <>
            {/* Ícone de edição */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons name="edit" size={23} color="#8265e4" />
            </TouchableOpacity>

            {/* Modal de edição */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Meta</Text>

                        {/* <TextInput
                            style={styles.input}
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Nova descrição"
                        /> */}

                        {/* Campo de Descrição */}
                        <Text style={styles.txtDadoTarefa}>Descrição da meta</Text>
                        <View style={styles.inputDado}>
                            <TextInput
                                placeholder="Nova descrição"
                                style={styles.inputText} // Ajusta dinamicamente
                                multiline
                                value={descricao}
                                onChangeText={setDescricao}
                                onContentSizeChange={(event) => {
                                    const newHeight = event.nativeEvent.contentSize.height;
                                    setAltura(newHeight); // 'altura' seria um estado adicional para controlar dinamicamente
                                }}
                            />
                        </View>

                        <View style={styles.modalButtons}>

                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={salvarEdicao}
                            >
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: "center",
        flexDirection: 'column'
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: "center",
        fontFamily: 'MajorantTRIAL-Rg',

        color: '#34308f',
    },

    txtDadoTarefa: {
        width: '100%',
        height: 40,
        textAlign: 'left',

        paddingVertical: 12,

        fontSize: 13,
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

        marginBottom: 15
    },
    inputText: {
        width: '100%',
        color: '#072967',
        fontSize: 14.5,
    },

    // input: {
    //     width: "100%",
    //     borderWidth: 1,
    //     borderColor: "#ccc",
    //     padding: 10,
    //     borderRadius: 5,
    //     marginBottom: 10,
    // },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: "#8265e4",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: 'MajorantTRIAL-Rg',
    },
});

export default EditarMetaItem;
