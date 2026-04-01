import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../contexto/AuthContext'; // ActivityIndicator la ruedita de carga, seAuth usar la función conecta con tu base de datos para iniciar sesión.

export default function LoginScreen({ navigation }) {
    const [correo, setCorreo] = useState(''); // guardan lo que usuario ponga
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false); // esperando respuesta
    const { login } = useAuth(); // comunicacion con la BD

    const handleLogin = async () => { // boton entrar
        if (!correo || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }

        setCargando(true);
        const result = await login(correo, password, true); 
        setCargando(false); // llama la funcion de BD

        if (!result.success) {
            Alert.alert('Error', result.error || 'Credenciales incorrectas.');
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
                    resizeMode="contain" // Asegura que la imagen no se corte ni estire feo
                />
                <Text style={styles.appName}>apuntes</Text>
                <Text style={styles.subTitleApp}>Gestión de tareas</Text>
            </View>
            
            {/* Sección del Formulario (Recuadro azul claro) */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Inicia sesión</Text>
                
                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput 
                    style={styles.input}
                    keyboardType='email-address'
                    autoCapitalize="none" // Evita que la primera letra del correo se ponga en mayúscula automáticamente
                    value={correo}
                    onChangeText={setCorreo}
                />

                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput 
                    style={styles.input}
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={setPassword} 
                />
                
                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLogin}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <View style={styles.rowLink}>
                        <Text style={styles.textNormal}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                            <Text style={styles.textLink}>Crea una cuenta.</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate('RecuperarContrasena')}>
                        <Text style={styles.textLink}>¿Olvidaste tu contraseña? Recuperar contraseña.</Text>
                    </TouchableOpacity>
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
        paddingTop: 60 
    },
    logoSection: { 
        alignItems: 'center', 
        marginBottom: 30 
    },
    logoImage: {
        width: 120, // Ajusta el tamaño según tu logo real
        height: 120,
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
        elevation: 2, // Sombra suave en Android
        shadowColor: '#000', // Sombra suave en iOS
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
        marginBottom: 15, 
        fontSize: 14 
    },
    loginButton: { 
        backgroundColor: '#90CAF9', 
        width: '100%',
        height: 45, 
        borderRadius: 25, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 10, 
        marginBottom: 20 
    },
    loginButtonText: { 
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