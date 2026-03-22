import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const materiasIniciales = [
    { id: '1', nombre: 'Matemáticas', profesor: 'Dra. Adela', tareas: 1, color: '#4FC3F7' }, 
    { id: '2', nombre: 'Programación', profesor: 'Dr. Nelson', tareas: 1, color: '#81C784' }, 
    { id: '3', nombre: 'Base de datos', profesor: 'Dra. Argelia', tareas: 1, color: '#FFF59D' }, 
    { id: '4', nombre: 'Desarrollo Humano', profesor: 'Prof. Chavero', tareas: 1, color: '#E57373' }, 
];

export default function MateriasScreen({ navigation }) {
    const [materias, setMaterias] = useState(materiasIniciales);
// setMaterias para actualizarla la materia nueva
    const renderItem = ({ item }) => ( // hacemos las tarjetas
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name="triangle" size={36} color={item.color} />
                </View>
            
                <View style={styles.cardInfo}>
                    <Text style={styles.materiaName}>{item.nombre}</Text>
                    <Text style={styles.materiaProf}>{item.profesor}</Text>
                    <Text style={styles.materiaTareas}>
                        {item.tareas} tarea{item.tareas !== 1 ? 's' : ''} 
                    {/* como una bandera */}
                    </Text>
                </View>
            </View>
            <Feather name="arrow-right" size={24} color="#D3D3D3" />
        </TouchableOpacity>
    );

    return ( // 
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>Mis Materias</Text>
                    <Text style={styles.headerSubtitle}>{materias.length} Materias</Text>
                </View>
            </View>

            <View style={styles.addButtonContainer}>
                {/* esta es LA conexion al formulario */}
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => navigation.navigate('CrearMateria')}
                >
                    <Text style={styles.addButtonText}>Agregar Materia</Text>
                    <Feather name="plus" size={20} color="white" style={styles.addIcon} />
                </TouchableOpacity>
            </View>

            <FlatList //  usa esta lista que tengo en mi memoria
                data={materias}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
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
    cardLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    cardInfo: { justifyContent: 'center' },
    materiaName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    materiaProf: { fontSize: 13, color: '#666', marginBottom: 2 },
    materiaTareas: { fontSize: 12, color: '#999' }
});