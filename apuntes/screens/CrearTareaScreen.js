import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
// textInput abre el teclado, 
import { Feather } from '@expo/vector-icons';

const prioridades = ['Alta', 'Media', 'Baja'];

export default function CrearTareaScreen({ navigation }) {
    const [titulo, setTitulo] = useState('');
    // useState Es la memoria de tu pantalla.
    const [descripcion, setDescripcion] = useState('');
    const [prioridad, setPrioridad] = useState('Media');
    
    // Variables para fecha
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState('');

    const handleCrearTarea = () => {
        if (!titulo.trim()) {
            Alert.alert('Validación', 'El título de la tarea es obligatorio.');
            return;
        }
        console.log({ titulo, descripcion, prioridad, fecha: `${dia}/${mes}/${anio}` });
        Alert.alert('Éxito', 'Tarea añadida correctamente.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Añadir tarea</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Sección 1: Información */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de la tarea</Text>
                    
                    <Text style={styles.label}>Título</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Ej: Resolver ejercicios..."
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput 
                        style={[styles.input, { height: 80, borderRadius: 15, paddingTop: 10 }]}
                        placeholder="Describe los detalles..."
                        multiline
                        textAlignVertical="top"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        // cuando cambie el text
                    />

                    <Text style={styles.label}>Materia</Text>
                    <TouchableOpacity style={styles.pickerSimulado}>
                        <Text style={{ color: '#888' }}>Selecciona una materia</Text>
                        <Feather name="chevron-down" size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                {/* Sección 2: Prioridad */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prioridad</Text>
                    <View style={styles.priorityContainer}>
                        {prioridades.map((p) => (
                            <TouchableOpacity 
                                key={p} 
                                style={[
                                    styles.priorityButton, 
                                    prioridad === p && styles.priorityButtonActive,
                                    prioridad === p && p === 'Alta' && { backgroundColor: '#FFCDD2', borderColor: '#EF5350' },
                                    prioridad === p && p === 'Media' && { backgroundColor: '#FFF9C4', borderColor: '#FDD835' },
                                    prioridad === p && p === 'Baja' && { backgroundColor: '#C8E6C9', borderColor: '#66BB6A' },
                                ]}
                                onPress={() => setPrioridad(p)}
                            >
                                <Text style={[styles.priorityText, prioridad === p && styles.priorityTextActive]}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sección 3: Fecha */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Feather name="calendar" size={18} color="#333" style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Fecha de entrega</Text>
                    </View>
                
                    <View style={styles.dateRow}>
                    
                        <TextInput style={styles.dateInput} placeholder="Día" keyboardType="number-pad" maxLength={2} value={dia} onChangeText={setDia} />
                        <TextInput style={styles.dateInput} placeholder="Mes" keyboardType="number-pad" maxLength={2} value={mes} onChangeText={setMes} />
                        <TextInput style={styles.dateInput} placeholder="Año" keyboardType="number-pad" maxLength={4} value={anio} onChangeText={setAnio} />
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCrearTarea}>
                    <Text style={styles.submitButtonText}>Confirmar</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
    // El usuario escribió todo esto a revisar y a guardar
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    section: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    label: { fontSize: 12, color: '#666', marginBottom: 5, marginLeft: 5 },
    input: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 25, height: 45, paddingHorizontal: 15, marginBottom: 15, fontSize: 14 },
    pickerSimulado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 25, height: 45, paddingHorizontal: 15 },
    priorityContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    priorityButton: { flex: 1, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
    priorityButtonActive: { borderWidth: 2 },
    priorityText: { fontSize: 13, color: '#666', fontWeight: '500' },
    priorityTextActive: { color: '#333', fontWeight: 'bold' },
    dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dateInput: { flex: 1, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 10, height: 45, textAlign: 'center', marginHorizontal: 4, fontSize: 14 },
    submitButton: { backgroundColor: '#4FC3F7', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 30 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});