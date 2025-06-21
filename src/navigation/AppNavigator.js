import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar páginas
import HomePage from '../pages/HomePage';
import DetailsPage from '../pages/DetailsPage';
import TarefasDoDia from '../pages/TarefasDoDia';
import TodasAsTarefas from '../pages/TodasAsTarefas';
import PerfilUsuario from '../pages/PerfilUsuario';
import NovaTarefa from '../pages/NovaTarefa';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import EditarPerfilUsuario from '../pages/EditarPerfilUsuario';
import VerTarefa from '../pages/VerTarefa';
import MetasTarefa from '../pages/MetasTarefa';
import AdicionarMeta from '../pages/AdicionarMeta';
import MembrosTarefa from '../pages/MembrosTarefa';
import AdicionarMembro from '../pages/AdicionarMembro';

// Criar Stack Navigator
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
                <Stack.Screen name="TarefasDoDia" component={TarefasDoDia} options={{ headerShown: false }} />
                <Stack.Screen name="NovaTarefa" component={NovaTarefa} options={{ headerShown: false }} />
                <Stack.Screen name="TodasAsTarefas" component={TodasAsTarefas} options={{ headerShown: false }} />
                <Stack.Screen name="VerTarefa" component={VerTarefa} options={{ headerShown: false }} />
                <Stack.Screen name="MetasTarefa" component={MetasTarefa} options={{ headerShown: false }} />
                <Stack.Screen name="MembrosTarefa" component={MembrosTarefa} options={{ headerShown: false }} />
                <Stack.Screen name="AdicionarMeta" component={AdicionarMeta} options={{ headerShown: false }} />
                <Stack.Screen name="AdicionarMembro" component={AdicionarMembro} options={{ headerShown: false }} />
                <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} options={{ headerShown: false }} />
                <Stack.Screen name="EditarPerfilUsuario" component={EditarPerfilUsuario} options={{ headerShown: false }} />
                <Stack.Screen name="Details" component={DetailsPage} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
