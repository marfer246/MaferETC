import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import TareaController from '../controllers/TareaController';
import MateriaController from '../controllers/MateriaController';
import { SafeAreaView } from 'react-native-safe-area-context';

const prioridades = ['Alta', 'Media', 'Baja'];

export default function CrearTareaScreen({ navigation }) {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [prioridad, setPrioridad] = useState('Media');
    const [fecha, setFecha] = useState('');
    const [materias, setMaterias] = useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [materiasModal, setMateriasModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [materiasCargando, setMateriasCargando] = useState(true);

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
        const resultado = await MateriaController.listar();
        if (resultado.success && resultado.materias.length > 0) {
            setMaterias(resultado.materias);
            setMateriaSeleccionada(resultado.materias[0].id);
        }
        setMateriasCargando(false);
    };

    const handleCrearTarea = async () => {
        // Validaciones
        if (!titulo.trim()) {
            Alert.alert('Error', 'Por favor ingresa un título para la tarea.');
            return;
        }

        if (!fecha.trim()) {
            Alert.alert('Error', 'Por favor ingresa una fecha en formato YYYY-MM-DD (ej: 2026-03-31).');
            return;
        }

        // Validar formato de fecha
        const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;
        if (!formatoFecha.test(fecha)) {
            Alert.alert('Error', 'La fecha debe estar en formato YYYY-MM-DD (ej: 2026-03-31).');
            return;
        }

        if (!materiaSeleccionada) {
            Alert.alert('Error', 'Por favor selecciona una materia.');
            return;
        }

        setCargando(true);
        const resultado = await TareaController.crear(titulo, descripcion, prioridad, fecha, materiaSeleccionada);
        setCargando(false);

        if (resultado.success) {
            Alert.alert('Éxito', 'Tarea creada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', resultado.message || 'Error al crear la tarea.');
        }
    };

    const materiaNombre = materias.find(m => m.id === materiaSeleccionada)?.nombre || 'Selecciona una materia';

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nueva Tarea</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Sección 1: Información */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información de la tarea</Text>

                        <Text style={styles.label}>Título *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Resolver ejercicios de cálculo"
                            value={titulo}
                            onChangeText={setTitulo}
                            editable={!cargando}
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, { height: 100, borderRadius: 15, paddingTop: 10 }]}
                            placeholder="Describe los detalles de la tarea..."
                            multiline
                            textAlignVertical="top"
                            value={descripcion}
                            onChangeText={setDescripcion}
                            editable={!cargando}
                        />

                        <Text style={styles.label}>Materia *</Text>
                        {materiasCargando ? (
                            <View style={[styles.pickerSimulado, { justifyContent: 'center' }]}>
                                <ActivityIndicator color="#666" size="small" />
                                <Text style={{ color: '#888', marginLeft: 10 }}>Cargando materias...</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.pickerSimulado}
                                onPress={() => setMateriasModal(true)}
                            >
                                <Text style={{ color: '#333', fontSize: 14 }}>{materiaNombre}</Text>
                                <Feather name="chevron-down" size={20} color="#888" />
                            </TouchableOpacity>
                        )}
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

                        <Text style={styles.label}>Fecha (YYYY-MM-DD) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="2026-03-31"
                            value={fecha}
                            onChangeText={setFecha}
                            editable={!cargando}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, cargando && styles.submitButtonDisabled]}
                        onPress={handleCrearTarea}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Crear Tarea</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.helpText}>* Campos obligatorios</Text>
                </ScrollView>
            </SafeAreaView>

            {/* Modal de materias */}
            <Modal
                visible={materiasModal}
                transparent
                animationType="slide"
                onRequestClose={() => setMateriasModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona una Materia</Text>
                        <FlatList
                            data={materias}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.materiaItem,
                                        materiaSeleccionada === item.id && styles.materiaItemActive,
                                    ]}
                                    onPress={() => {
                                        setMateriaSeleccionada(item.id);
                                        setMateriasModal(false);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.materiaDot,
                                            { backgroundColor: item.color },
                                        ]}
                                    />
                                    <Text style={styles.materiaText}>{item.nombre}</Text>
                                    {materiaSeleccionada === item.id && (
                                        <MaterialCommunityIcons name="check" size={20} color="#0288D1" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setMateriasModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
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
    submitButton: { backgroundColor: '#4FC3F7', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    helpText: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 10, marginBottom: 30 },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    materiaItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    materiaItemActive: { backgroundColor: '#F0F8FF' },
    materiaDot: { width: 15, height: 15, borderRadius: 7.5, marginRight: 15 },
    materiaText: { flex: 1, fontSize: 16, color: '#333' },
    closeButton: { backgroundColor: '#90CAF9', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginTop: 10 },
    closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});