import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StatusBar,
    FlatList,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TareaController from '../controllers/TareaController';
import MateriaController from '../controllers/MateriaController';

const prioridades = ['Alta', 'Media', 'Baja'];

export default function EditarTareaScreen({ navigation, route }) {
    const { tarea } = route.params;
    const [titulo, setTitulo] = useState(tarea.titulo);
    const [descripcion, setDescripcion] = useState(tarea.descripcion || '');
    const [prioridad, setPrioridad] = useState(tarea.prioridad);
    const [fecha, setFecha] = useState(tarea.fecha);
    const [completada, setCompletada] = useState(tarea.completada || false);
    const [cargando, setCargando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [materias, setMaterias] = useState([]);
    const [materiasModal, setMateriasModal] = useState(false);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(tarea.materia_id);
    const [materiaCargando, setMateriaCargando] = useState(true);

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
        const resultado = await MateriaController.listar();
        if (resultado.success) {
            setMaterias(resultado.materias);
        }
        setMateriaCargando(false);
    };

    const handleActualizarTarea = async () => {
        if (!titulo.trim()) {
            Alert.alert('Error', 'Por favor ingresa un título para la tarea.');
            return;
        }

        if (!fecha.trim()) {
            Alert.alert('Error', 'Por favor ingresa una fecha para la tarea.');
            return;
        }

        setCargando(true);
        const resultado = await TareaController.actualizar(
            tarea.id,
            titulo,
            descripcion,
            prioridad,
            fecha,
            completada
        );
        setCargando(false);

        if (resultado.success) {
            Alert.alert('Éxito', 'Tarea actualizada correctamente.');
            navigation.goBack();
        } else {
            Alert.alert('Error', resultado.message || 'Error al actualizar la tarea.');
        }
    };

    const handleEliminarTarea = () => {
        Alert.alert(
            'Eliminar tarea',
            '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        setEliminando(true);
                        const resultado = await TareaController.eliminar(tarea.id);
                        setEliminando(false);

                        if (resultado.success) {
                            Alert.alert('Éxito', 'Tarea eliminada correctamente.');
                            navigation.navigate('Tareas');
                        } else {
                            Alert.alert('Error', resultado.message || 'Error al eliminar la tarea.');
                        }
                    },
                },
            ]
        );
    };

    const materiaNombre = materias.find(m => m.id === materiaSeleccionada)?.nombre || 'Selecciona una materia';

    return (
        <ScrollView style={styles.container} bounces={false}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Tarea</Text>
            </View>

            <View style={styles.scrollContent}>
                {/* Título */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información General</Text>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Título de la tarea"
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descripción (opcional)"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Materia */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Materia</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setMateriasModal(true)}
                    >
                        <Text style={{ color: '#333', fontSize: 14 }}>{materiaNombre}</Text>
                    </TouchableOpacity>
                </View>

                {/* Prioridad y Fecha */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles</Text>

                    <Text style={styles.label}>Prioridad</Text>
                    <View style={styles.priorityContainer}>
                        {prioridades.map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.priorityButton,
                                    prioridad === p && styles.priorityButtonActive,
                                ]}
                                onPress={() => setPrioridad(p)}
                            >
                                <Text style={[styles.priorityText, prioridad === p && styles.priorityTextActive]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2026-03-31"
                        value={fecha}
                        onChangeText={setFecha}
                    />
                </View>

                {/* Estado */}
                <View style={styles.section}>
                    <View style={styles.completadaRow}>
                        <Text style={styles.sectionTitle}>Marcar como completada</Text>
                        <TouchableOpacity
                            onPress={() => setCompletada(!completada)}
                            style={[styles.checkbox, completada && styles.checkboxActive]}
                        >
                            {completada && (
                                <MaterialCommunityIcons name="check" size={20} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botones */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleActualizarTarea}
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
                    onPress={handleEliminarTarea}
                    disabled={eliminando}
                >
                    {eliminando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.deleteButtonText}>Eliminar Tarea</Text>
                    )}
                </TouchableOpacity>
            </View>

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
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25, height: 45, paddingHorizontal: 15, marginBottom: 15, fontSize: 14, justifyContent: 'center' },
    textArea: { height: 100, paddingVertical: 10, textAlignVertical: 'top' },
    priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    priorityButton: { flex: 1, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
    priorityButtonActive: { borderWidth: 2, borderColor: '#0288D1' },
    priorityText: { fontSize: 13, color: '#666', fontWeight: '500' },
    priorityTextActive: { color: '#0288D1', fontWeight: 'bold' },
    completadaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    checkbox: { width: 30, height: 30, borderRadius: 8, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
    checkboxActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    submitButton: { backgroundColor: '#4CAF50', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#FF5252', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
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
