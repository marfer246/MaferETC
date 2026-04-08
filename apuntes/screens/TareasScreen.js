import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TareaController from '../controllers/TareaController';
import { useFocusEffect } from '@react-navigation/native';

export default function TareasScreen({ navigation }) {
    const [tareas, setTareas] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('Todas');
    const [cargando, setCargando] = useState(true);
    const [filtroModal, setFiltroModal] = useState(false);

    const getPrioridadColor = (prioridad) => {
        switch (prioridad) {
            case 'Alta': return '#EF5350';
            case 'Media': return '#FDD835';
            case 'Baja': return '#66BB6A';
            default: return '#333';
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            cargarTareas();
        }, [])
    );

    const cargarTareas = async () => {
        setCargando(true);
        const resultado = await TareaController.listar();
        if (resultado.success) {
            setTareas(resultado.tareas);
        } else {
            Alert.alert('Error', 'No se pudieron cargar las tareas.');
        }
        setCargando(false);
    };

    const toggleTarea = async (id, completada) => {
        const tarea = tareas.find(t => t.id === id);
        const resultado = await TareaController.marcarCompletada(id, !completada);

        if (resultado.success) {
            setTareas(tareas.map(t => t.id === id ? { ...t, completada: !completada } : t));
        } else {
            Alert.alert('Error', resultado.message || 'Error al actualizar tarea.');
        }
    };

    const handleEliminarTarea = (id, titulo) => {
        Alert.alert(
            'Eliminar tarea',
            `¿Estás seguro de que deseas eliminar "${titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const resultado = await TareaController.eliminar(id);
                        if (resultado.success) {
                            Alert.alert('Éxito', 'Tarea eliminada correctamente.');
                            cargarTareas();
                        } else {
                            Alert.alert('Error', resultado.message || 'Error al eliminar.');
                        }
                    },
                },
            ]
        );
    };

    const tareasFiltradas = (() => {
        let filtered = tareas;
        if (filtroActivo === 'Pendientes') {
            filtered = filtered.filter(t => !t.completada);
        } else if (filtroActivo === 'Completas') {
            filtered = filtered.filter(t => t.completada);
        } else if (['Alta', 'Media', 'Baja'].includes(filtroActivo)) {
            filtered = filtered.filter(t => t.prioridad === filtroActivo);
        } else if (filtroActivo === 'Hoy') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.fecha === today);
        } else if (filtroActivo === 'Esta Semana') {
            const today = new Date();
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            filtered = filtered.filter(t => {
                const taskDate = new Date(t.fecha);
                return taskDate >= today && taskDate <= weekFromNow;
            });
        }
        // For 'Todas', no additional filter
        return filtered;
    })();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => toggleTarea(item.id, item.completada)}
                style={styles.checkboxContainer}
            >
                <Ionicons
                    name={item.completada ? "checkbox" : "square-outline"}
                    size={28}
                    color={item.completada ? "#4CAF50" : "#B0BEC5"}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('EditarTarea', { tarea: item })}
            >
                <Text style={[
                    styles.tareaTitle,
                    item.completada && styles.tareaCompletadaText,
                    !item.completada && { color: getPrioridadColor(item.prioridad) }
                ]}>
                    {item.titulo}
                </Text>
                {item.materia && (
                    <View style={[styles.materiaTag, { backgroundColor: item.materia?.color || '#90CAF9' }]}>
                        <Text style={styles.materiaTagText}>{item.materia?.nombre || 'Sin materia'}</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.dateContainer}>
                <Feather name="calendar" size={14} color="#888" />
                <Text style={styles.dateText}>{item.fecha}</Text>
            </View>

            <TouchableOpacity
                onPress={() => handleEliminarTarea(item.id, item.titulo)}
                style={styles.deleteIconButton}
            >
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FF5252" />
            </TouchableOpacity>
        </View>
    );

    if (cargando) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#90CAF9" />
                    <Text style={styles.loadingText}>Cargando tareas...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tareas</Text>
                    <Text style={styles.headerSubtitle}>{tareasFiltradas.length} tareas</Text>
                </View>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('CrearTarea')}
                    >
                        <Text style={styles.addButtonText}>Nueva Tarea</Text>
                        <Feather name="plus" size={20} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFiltroModal(true)}
                    >
                        <Text style={styles.filterButtonText}>Filtrado</Text>
                        <Feather name="filter" size={16} color="#333" />
                    </TouchableOpacity>
                </View>

                {tareasFiltradas.length > 0 ? (
                    <FlatList
                        data={tareasFiltradas}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay tareas en esta categoría</Text>
                        <Text style={styles.emptySubtext}>Crea una nueva tarea para comenzar</Text>
                    </View>
                )}
            </SafeAreaView>

            {/* Modal de filtros */}
            <Modal
                visible={filtroModal}
                transparent
                animationType="slide"
                onRequestClose={() => setFiltroModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona un Filtro</Text>
                        <FlatList
                            data={['Alta', 'Media', 'Baja', 'Hoy', 'Esta Semana', 'Todas', 'Pendientes', 'Completas']}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.filtroItem,
                                        filtroActivo === item && styles.filtroItemActive,
                                    ]}
                                    onPress={() => {
                                        setFiltroActivo(item);
                                        setFiltroModal(false);
                                    }}
                                >
                                    <Text style={[styles.filtroText, filtroActivo === item && styles.filtroTextActive]}>{item}</Text>
                                    {filtroActivo === item && (
                                        <MaterialCommunityIcons name="check" size={20} color="#0288D1" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFiltroModal(false)}
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
    controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 15 },
    addButton: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333', flex: 1, marginRight: 10 },
    addButtonText: { fontSize: 16, fontWeight: '600', color: '#333', marginRight: 8 },
    filterButton: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333', flex: 1, marginLeft: 10 },
    filterButtonText: { fontSize: 16, fontWeight: '600', color: '#333', marginRight: 8 },
    listContainer: { paddingHorizontal: 25, paddingBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    checkboxContainer: { marginRight: 15 },
    cardContent: { flex: 1 },
    tareaTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
    tareaCompletadaText: { textDecorationLine: 'line-through', color: '#9E9E9E' },
    materiaTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    materiaTagText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
    dateContainer: { alignItems: 'flex-end', justifyContent: 'center', marginRight: 10 },
    dateText: { fontSize: 12, color: '#888', marginTop: 4, fontWeight: '500' },
    deleteIconButton: { padding: 5 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: '#666', marginTop: 10 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    emptySubtext: { fontSize: 14, color: '#666' },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    filtroItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    filtroItemActive: { backgroundColor: '#F0F8FF' },
    filtroText: { flex: 1, fontSize: 16, color: '#333' },
    filtroTextActive: { fontWeight: 'bold' },
    closeButton: { backgroundColor: '#90CAF9', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginTop: 10 },
    closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});