import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import MateriaController from '../controllers/MateriaController';

const coloresDisponibles = [
    { id: '1', hex: '#90CAF9', nombre: 'Azul' },
    { id: '2', hex: '#F48FB1', nombre: 'Rosa' },
    { id: '3', hex: '#A5D6A7', nombre: 'Verde' },
    { id: '4', hex: '#CE93D8', nombre: 'Morado' },
    { id: '5', hex: '#FFCC80', nombre: 'Naranja' },
    { id: '6', hex: '#80CBC4', nombre: 'Menta' },
];

export default function EditarMateriaScreen({ navigation, route }) {
    const { materia } = route.params;
    const [nombre, setNombre] = useState(materia.nombre);
    const [profesor, setProfesor] = useState(materia.profesor);
    const [colorSeleccionado, setColorSeleccionado] = useState(materia.color);
    const [cargando, setCargando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const handleActualizarMateria = async () => {
        if (!nombre.trim() || !profesor.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        setCargando(true);
        const resultado = await MateriaController.actualizar(materia.id, nombre, profesor, colorSeleccionado);
        setCargando(false);

        if (resultado.success) {
            Alert.alert('Éxito', 'Materia actualizada correctamente.');
            navigation.goBack();
        } else {
            Alert.alert('Error', resultado.message || 'Error al actualizar la materia.');
        }
    };

    const handleEliminarMateria = () => {
        Alert.alert(
            'Eliminar materia',
            '¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        setEliminando(true);
                        const resultado = await MateriaController.eliminar(materia.id);
                        setEliminando(false);

                        if (resultado.success) {
                            Alert.alert('Éxito', 'Materia eliminada correctamente.');
                            navigation.navigate('Materias');
                        } else {
                            Alert.alert('Error', resultado.message || 'Error al eliminar la materia.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} bounces={false}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Materia</Text>
            </View>

            <View style={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de la Materia</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la materia"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    <Text style={styles.label}>Profesor/a</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del profesor"
                        value={profesor}
                        onChangeText={setProfesor}
                    />

                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorGrid}>
                        {coloresDisponibles.map((color) => (
                            <TouchableOpacity
                                key={color.id}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color.hex },
                                    colorSeleccionado === color.hex && styles.colorOptionSelected,
                                ]}
                                onPress={() => setColorSeleccionado(color.hex)}
                            >
                                {colorSeleccionado === color.hex && (
                                    <Fontisto name="check" size={24} color="white" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleActualizarMateria}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Guardar Cambios</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleEliminarMateria}
                    disabled={eliminando}
                >
                    {eliminando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.deleteButtonText}>Eliminar Materia</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { padding: 5 },
    backButtonText: { fontSize: 16, color: '#1976D2', fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
    scrollContent: { padding: 20 },
    section: { backgroundColor: '#F0F8FF', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E3F2FD' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    label: { fontSize: 12, color: '#666', marginBottom: 5, marginLeft: 5 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25, height: 45, paddingHorizontal: 15, marginBottom: 15, fontSize: 14 },
    colorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
    colorOption: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    colorOptionSelected: { borderWidth: 3, borderColor: '#333' },
    submitButton: { backgroundColor: '#4CAF50', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#FF5252', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
