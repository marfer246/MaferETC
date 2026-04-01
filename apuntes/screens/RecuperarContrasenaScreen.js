import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import UserController from '../controllers/UserController';

export default function RecuperarContrasenaScreen({ navigation }) {
    const [correo, setCorreo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleRecuperar = async () => {
        if (!correo || !nuevaPassword || !confirmarPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        if (nuevaPassword.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        setCargando(true);
        const result = await UserController.resetPassword(correo, nuevaPassword);
        setCargando(false);

        if (result.success) {
            Alert.alert('Éxito', result.message, [{ text: 'Ir al login', onPress: () => navigation.navigate('Login') }]);
        } else {
            Alert.alert('Error', result.message || 'No se pudo actualizar la contraseña');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Recuperar contraseña</Text>

                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={correo}
                    onChangeText={setCorreo}
                />

                <Text style={styles.inputLabel}>Nueva contraseña</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={nuevaPassword}
                    onChangeText={setNuevaPassword}
                />

                <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmarPassword}
                    onChangeText={setConfirmarPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRecuperar} disabled={cargando}>
                    {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Actualizar contraseña</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.textLink}>Volver al inicio de sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#F0F8FF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    formTitle: {
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
        fontWeight: '700',
    },
    inputLabel: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: '#333',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        width: '100%',
        height: 45,
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#90CAF9',
        width: '100%',
        height: 45,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    textLink: {
        color: '#1976D2',
        fontSize: 14,
        marginTop: 12,
    },
});
