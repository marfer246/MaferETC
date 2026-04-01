import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TareaController from '../controllers/TareaController';
import { useFocusEffect } from '@react-navigation/native';

export default function TareasScreen({ navigation }) {
    const [tareas, setTareas] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('Todas');
    const [cargando, setCargando] = useState(true);

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

    const tareasFiltradas = tareas.filter(t => {
        if (filtroActivo === 'Pendientes') return !t.completada;
        if (filtroActivo === 'Completas') return t.completada;
        return true;
    });

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
                <Text style={[styles.tareaTitle, item.completada && styles.tareaCompletadaText]}>
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
            </View>

            <View style={styles.filtersContainer}>
                {['Todas', 'Pendientes', 'Completas'].map(filtro => (
                    <TouchableOpacity
                        key={filtro}
                        style={[styles.filterPill, filtroActivo === filtro && styles.filterPillActive]}
                        onPress={() => setFiltroActivo(filtro)}
                    >
                        <Text style={[styles.filterText, filtroActivo === filtro && styles.filterTextActive]}>
                            {filtro}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
    controlsContainer: { paddingHorizontal: 25, marginBottom: 15 },
    addButton: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
    addButtonText: { fontSize: 16, fontWeight: '600', color: '#333', marginRight: 8 },
    filtersContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 20 },
    filterPill: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', minWidth: '30%', alignItems: 'center' },
    filterPillActive: { backgroundColor: '#E0F7FA', borderColor: '#4FC3F7' },
    filterText: { fontSize: 13, color: '#666', fontWeight: '500' },
    filterTextActive: { color: '#0288D1', fontWeight: 'bold' },
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
});