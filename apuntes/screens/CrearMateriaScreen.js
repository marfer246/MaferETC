import React, { useState } from 'react'; // para guardar datos que solo le importan a esta pantalla mientras el usuario escribe
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
// Importa los íconos de la librería de Expo
import { Feather, Fontisto } from '@expo/vector-icons';
// conecta la pantalla con la base de datos
import MateriaController from '../controllers/MateriaController';

const coloresDisponibles = [
    { id: '1', hex: '#90CAF9', nombre: 'Azul' },
    { id: '2', hex: '#F48FB1', nombre: 'Rosa' },
    { id: '3', hex: '#A5D6A7', nombre: 'Verde' },
    { id: '4', hex: '#CE93D8', nombre: 'Morado' },
    { id: '5', hex: '#FFCC80', nombre: 'Naranja' },
    { id: '6', hex: '#80CBC4', nombre: 'Menta' },
];

export default function CrearMateriaScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState(''); // guarda el dato
    const [colorSeleccionado, setColorSeleccionado] = useState(coloresDisponibles[0].hex);
    const [cargando, setCargando] = useState(false);// // Bandera para saber si estamos guardando en la base de datos
// guarda en la BD, toma app  y esperar 
    const handleCrearMateria = async () => {
        // Validaciones
        if (!nombre.trim()) {// quita los espacios en blanco
            Alert.alert('Error', 'Por favor ingresa el nombre de la materia.');
            return;
        }

        if (!profesor.trim()) { // verdad= vacio
            Alert.alert('Error', 'Por favor ingresa el nombre del profesor/a.');
            return;
        }

        if (nombre.trim().length < 2) {
            Alert.alert('Error', 'El nombre de la materia debe tener al menos 2 caracteres.');
            return;
        }

        if (profesor.trim().length < 2) {
            Alert.alert('Error', 'El nombre del profesor debe tener al menos 2 caracteres.');
            return;
        }

        setCargando(true);
        const resultado = await MateriaController.crear(nombre, profesor, colorSeleccionado);
        setCargando(false);

        if (resultado.success) {
            Alert.alert('Éxito', 'Materia creada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', resultado.message || 'Error al crear la materia.');
        }
    };
// lo que vemos en la pantalla
    return (
        // evita el coontenido se sobreponga
        <SafeAreaView style={styles.container}> 
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear Materia</Text>
                
                <View style={{ width: 24 }} />
                
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de la Materia</Text>
                    
                    <Text style={styles.label}>Nombre de la materia *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Ej: Química, Matemáticas"
                        value={nombre}
                        onChangeText={setNombre}
                        editable={!cargando}
                    />

                    <Text style={styles.label}>Profesor/a *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Nombre del profesor..."
                        value={profesor}
                        onChangeText={setProfesor}
                        editable={!cargando}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personalización</Text>
                    <Text style={styles.label}>Color representativo</Text>
                
                    <View style={styles.colorGrid}>
                        // --- map para el arreglo ---
                        {coloresDisponibles.map((color) => ( // coloresDisponibles y dibuja un botón por cada uno.
                            <TouchableOpacity 
                                key={color.id} 
                                style={[
                                    styles.colorOption, 
                                    { backgroundColor: color.hex },
                                    colorSeleccionado === color.hex && styles.colorOptionSelected
                                ]}
                                onPress={() => setColorSeleccionado(color.hex)}
                            >
                                {colorSeleccionado === color.hex && (
                                    <Fontisto name="check" size={20} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
/
                <TouchableOpacity 
                    style={[styles.submitButton, cargando && styles.submitButtonDisabled]} 
                    onPress={handleCrearMateria}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Crear Materia</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.helpText}>* Campos obligatorios</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    section: { backgroundColor: '#F0F8FF', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E3F2FD' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    label: { fontSize: 12, color: '#666', marginBottom: 5, marginLeft: 5 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25, height: 45, paddingHorizontal: 15, marginBottom: 15, fontSize: 14 },
    colorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
    colorOption: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    colorOptionSelected: { borderWidth: 3, borderColor: '#333' },
    submitButton: { backgroundColor: '#90CAF9', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    helpText: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 10 },
});