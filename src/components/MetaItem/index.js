import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WS_URL } from "../../../config";
import Octicons from '@expo/vector-icons/Octicons';
import Toast from "react-native-toast-message";

const MetaItem = ({ meta, authToken, onUpdate }) => {
    const [alcancada, setAlcancada] = useState(meta.alcancada);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleMeta = async () => {
        try {
            const response = await fetch(`${WS_URL}/marcar-desmarcar-meta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: authToken,
                    id_meta: meta.id,
                }),
            });

            const result = await response.json();

            if (result.type === "success") {
                setAlcancada(alcancada === "true" ? "false" : "true"); // Alterna o estado da meta
                onUpdate(); // Atualiza a lista de metas na tela

                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso!',
                    text2: result.message,
                    visibilityTime: 3000, // Tempo em milissegundos
                });
            } else {
                console.error("Erro ao marcar/desmarcar meta:", result.message);

                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Erro ao marcar/desmarcar meta.',
                    visibilityTime: 3000, // Tempo em milissegundos
                });
            }
        } catch (error) {
            console.error("Erro na requisição:", error);

            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: error || 'Não foi possível conectar ao servidor.',
                visibilityTime: 3000, // Tempo em milissegundos
            });
        }
    };

    return (
        <>
            {/* Ícone da meta */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                {alcancada === "true" ? (
                    <Ionicons name="checkbox" size={24} color="#8265e4" />
                ) : (
                    <Ionicons name="square-outline" size={24} color="#8265e4" />
                )}
            </TouchableOpacity>
            {/* Modal de Confirmação */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <Octicons name="info" size={28} color="#8265e4" style={styles.icoModal} />

                        <Text style={styles.modalText}>
                            {alcancada === "true"
                                ? "Deseja desmarcar esta meta?"
                                : "Deseja marcar esta meta como alcançada?"}
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    toggleMeta();
                                }}
                            >
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        // width: 300,
        width: '85%',
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: "center",
        flexDirection: 'column'
    },
    icoModal: {
        marginVertical: 10,
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
        fontFamily: 'MajorantTRIAL-Rg',
    },
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
    confirmButton: {
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

export default MetaItem;
