import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../contexto/AuthContext';

export default function RegistroScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const { register } = useAuth();

    const handleRegistro = async () => {
        if (!nombre || !correo || !password || !confirmarPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        if (password !== confirmarPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        setCargando(true);
        const result = await register(nombre, correo, password);
        setCargando(false);

        if (result.success) {
            Alert.alert(
                '¡Registro Exitoso!', 
                'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                [{ text: 'Ir al Login', onPress: () => navigation.navigate('LoginScreen') }]
            );
        } else {
            Alert.alert('Error', result.message || 'Hubo un problema al registrar la cuenta.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {/* Sección del Logo Superior */}
            <View style={styles.logoSection}>
                {/* Imagen real del logo desde assets */}
                <Image 
                    source={require('../assets/apuntes_logo.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>apuntes</Text>
                <Text style={styles.subTitleApp}>Gestión de tareas</Text>
            </View>
            
            {/* Sección del Formulario (Recuadro azul claro) */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Crear cuenta</Text>
                
                <Text style={styles.inputLabel}>Correo electrónico:</Text>
                <TextInput 
                    style={styles.input}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={correo}
                    onChangeText={setCorreo}
                />

                <Text style={styles.inputLabel}>Usuario:</Text>
                <TextInput 
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.inputLabel}>Contraseña:</Text>
                <TextInput 
                    style={styles.input}
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={setPassword} 
                />

                <Text style={styles.inputLabel}>Confirmar contraseña:</Text>
                <TextInput 
                    style={styles.input}
                    secureTextEntry={true} 
                    value={confirmarPassword}
                    onChangeText={setConfirmarPassword} 
                />
                
                <TouchableOpacity 
                    style={styles.registerButton} 
                    onPress={handleRegistro}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.registerButtonText}>Crear</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <View style={styles.rowLink}>
                        <Text style={styles.textNormal}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                            <Text style={styles.textLink}>Inicia sesión.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: '#FFFFFF', 
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20
    },
    logoSection: { 
        alignItems: 'center', 
        marginBottom: 20 
    },
    logoImage: {
        width: 100, // Un poco más pequeño en registro para que quepa todo el form
        height: 100,
        marginBottom: 10
    },
    appName: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#4FC3F7', 
        marginBottom: 5 
    },
    subTitleApp: { 
        fontSize: 16, 
        color: '#666', 
    },
    formContainer: { 
        backgroundColor: '#F0F8FF', 
        width: '85%',
        borderRadius: 20, 
        padding: 25, 
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    formTitle: { 
        fontSize: 20, 
        color: '#333', 
        marginBottom: 20 
    },
    inputLabel: { 
        alignSelf: 'flex-start',
        fontSize: 12, 
        color: '#333', 
        marginBottom: 5, 
        marginLeft: 5 
    },
    input: { 
        width: '100%',
        height: 45, 
        backgroundColor: '#FFFFFF', 
        borderColor: '#E0E0E0', 
        borderWidth: 1, 
        borderRadius: 25, 
        paddingHorizontal: 15, 
        marginBottom: 12, 
        fontSize: 14 
    },
    registerButton: { 
        backgroundColor: '#90CAF9', 
        width: '100%',
        height: 45, 
        borderRadius: 25, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 10, 
        marginBottom: 20 
    },
    registerButtonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    linksContainer: { 
        alignItems: 'center', 
        width: '100%' 
    },
    rowLink: { 
        flexDirection: 'row' 
    },
    textNormal: { 
        color: '#666', 
        fontSize: 12 
    },
    textLink: { 
        color: '#1976D2', 
        fontSize: 12, 
        fontWeight: 'bold' 
    }
});