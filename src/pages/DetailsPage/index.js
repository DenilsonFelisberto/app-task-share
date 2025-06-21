import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailsPage({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Esta é a página de detalhes.</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
});
