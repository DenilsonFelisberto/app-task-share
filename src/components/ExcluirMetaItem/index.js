import React, { useState } from "react";
import { Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { WS_URL } from "../../../config";
import Toast from "react-native-toast-message";

const ExcluirMetaItem = ({ meta, authToken, onUpdate }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleExcluirMeta = async () => {
        try {
            const response = await fetch(`${WS_URL}/excluir-meta`, {

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
                onUpdate(); // Atualiza a lista de metas
                setModalVisible(false);
                Toast.show({
                    type: 'customToastSuccess',
                    text1: 'Sucesso!',
                    text2: result.message,
                    visibilityTime: 3000,
                });
            } else {
                console.error("Erro", result.message);

                Toast.show({
                    type: 'customToastError',
                    text1: 'Erro',
                    text2: result.message || 'Erro ao excluir a meta.',
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            console.error("Erro", "Falha ao excluir a meta. Tente novamente.");
            Toast.show({
                type: 'customToastError',
                text1: 'Erro',
                text2: 'Não foi possível conectar ao servidor.',
                visibilityTime: 3000,
            });
        }
        setModalVisible(false);
    };

    return (
        <View>
            {/* Botão de excluir */}
            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => setModalVisible(true)}>
                <FontAwesome6 name="trash" size={18} color="#8265e4" />
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
                        <Text style={styles.modalTitle}>Excluir Meta</Text>
                        <Text style={styles.txtDadoTarefa}>Tem certeza que deseja excluir esta meta?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={[styles.button, styles.cancelButton]}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleExcluirMeta}
                                style={[styles.button, styles.saveButton]}
                            >
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ExcluirMetaItem;

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
        textAlign: 'center',

        paddingVertical: 12,

        fontSize: 13,
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
