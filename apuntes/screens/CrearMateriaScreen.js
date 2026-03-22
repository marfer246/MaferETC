import React, { useState } from 'react'; // para guardar datos que solo le importan a esta pantalla mientras el usuario escribe
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';


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
    const [profesor, setProfesor] = useState('');
    const [colorSeleccionado, setColorSeleccionado] = useState(coloresDisponibles[0].hex);

    const handleCrearMateria = () => {
        if (!nombre.trim()) {
            Alert.alert('Validación', 'El nombre de la materia es obligatorio.');
            return;
        }
        console.log({ nombre, profesor, colorSeleccionado });
        Alert.alert('Éxito', 'Materia creada correctamente.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        // .goBack() quitar la carta de arriba y tirarla.(pila)
    };

    return (
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
                    
                    <Text style={styles.label}>Nombre de la materia</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Ej: Química"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    <Text style={styles.label}>Profesor</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Nombre del profesor..."
                        value={profesor}
                        onChangeText={setProfesor}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personalización</Text>
                    <Text style={styles.label}>Color representativo</Text>
                
                    <View style={styles.colorGrid}>
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
                                    <Feather name="check" size={20} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCrearMateria}>
                    <Text style={styles.submitButtonText}>Añadir</Text>
                </TouchableOpacity>
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
    submitButton: { backgroundColor: '#90CAF9', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});