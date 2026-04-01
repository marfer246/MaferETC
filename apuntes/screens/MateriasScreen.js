import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import MateriaController from '../controllers/MateriaController';
import { useFocusEffect } from '@react-navigation/native';

export default function MateriasScreen({ navigation }) {
    const [materias, setMaterias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            cargarMaterias();
        }, [])
    );

    const cargarMaterias = async () => {
        setCargando(true);
        const resultado = await MateriaController.listar();
        if (resultado.success) {
            setMaterias(resultado.materias);
        } else {
            Alert.alert('Error', 'No se pudieron cargar las materias.');
        }
        setCargando(false);
    };

    const handleEliminarMateria = (id, nombre) => {
        Alert.alert(
            'Eliminar materia',
            `¿Estás seguro de que deseas eliminar "${nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const resultado = await MateriaController.eliminar(id);
                        if (resultado.success) {
                            Alert.alert('Éxito', 'Materia eliminada correctamente.');
                            cargarMaterias();
                        } else {
                            Alert.alert('Error', resultado.message || 'Error al eliminar.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onLongPress={() => navigation.navigate('EditarMateria', { materia: item })}
            onPress={() => navigation.navigate('Tareas')}
        >
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name="triangle" size={36} color="white" />
                </View>

                <View style={styles.cardInfo}>
                    <Text style={styles.materiaName}>{item.nombre}</Text>
                    <Text style={styles.materiaProf}>{item.profesor}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={() => handleEliminarMateria(item.id, item.nombre)}
            >
                <Feather name="trash-2" size={18} color="#FF5252" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (cargando) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#90CAF9" />
                    <Text style={styles.loadingText}>Cargando materias...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>Mis Materias</Text>
                    <Text style={styles.headerSubtitle}>{materias.length} Materias</Text>
                </View>
            </View>

            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CrearMateria')}
                >
                    <Text style={styles.addButtonText}>Agregar Materia</Text>
                    <Feather name="plus" size={20} color="white" style={styles.addIcon} />
                </TouchableOpacity>
            </View>

            {materias.length > 0 ? (
                <FlatList
                    data={materias}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tienes materias aún</Text>
                    <Text style={styles.emptySubtext}>Crea una nueva materia para comenzar</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 10 },
    headerTitles: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
    addButtonContainer: { paddingHorizontal: 25, marginVertical: 15, alignItems: 'center' },
    addButton: { flexDirection: 'row', backgroundColor: '#90CAF9', width: '80%', height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
    addIcon: { marginTop: 2 },
    listContainer: { paddingHorizontal: 25, paddingBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', borderColor: '#E0F7FA', borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderRadius: 10 },
    cardInfo: { justifyContent: 'center', flex: 1 },
    materiaName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    materiaProf: { fontSize: 13, color: '#666', marginBottom: 2 },
    deleteIconButton: { padding: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: '#666', marginTop: 10 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    emptySubtext: { fontSize: 14, color: '#666' },
});