import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation';
import Octicons from '@expo/vector-icons/Octicons';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MajorantTRIAL-Bd': require('./assets/fonts/MajorantTRIAL-Bd.otf'),
    'MajorantTRIAL-Md': require('./assets/fonts/MajorantTRIAL-Md.otf'),
    'MajorantTRIAL-Rg': require('./assets/fonts/MajorantTRIAL-Rg.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={45} color="#33317f" />
      </View>
    ); // Retorna null ou uma tela de loading até que as fontes sejam carregadas
  }

  const toastConfig = {
    customToastWarning: ({ text1, text2 }) => (
      <View style={styles.customToastContainer}>
        <Ionicons name="warning" size={26} color="#34308f" style={styles.ico} />
        <View style={styles.col}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
        </View>
      </View>
    ),
    customToastError: ({ text1, text2 }) => (
      <View style={styles.customToastContainer}>
        <MaterialIcons name="dangerous" size={27} color="#34308f" style={styles.ico} />
        <View style={styles.col}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
        </View>
      </View>
    ),
    customToastInfo: ({ text1, text2 }) => (
      <View style={styles.customToastContainer}>
        <Foundation name="info" size={28} color="#34308f" style={styles.ico} />
        <View style={styles.col}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
        </View>
      </View>
    ),
    customToastSuccess: ({ text1, text2 }) => (
      <View style={styles.customToastContainer}>
        <Octicons name="check-circle-fill" size={22} color="#34308f" style={styles.ico} />
        <View style={styles.col}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
        </View>
      </View>
    ),
  };

  const styles = StyleSheet.create({
    customToastContainer: {
      
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',

      backgroundColor: '#f1f4fd',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 8,
      marginHorizontal: 10,
      marginTop: 10,
      elevation: 5,
    },
    ico: {
      marginEnd: 8,
    },
    text1: {
      color: '#8265e4',
      fontSize: 16,
      fontFamily: 'MajorantTRIAL-Md',
    },
    text2: {
      marginTop: 5,
      color: '#a1a2a6',
      fontSize: 13,
      fontFamily: 'MajorantTRIAL-Md',
    },
  });

  return <>
    <AppNavigator />
    <Toast config={toastConfig} />
  </>;
}

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
