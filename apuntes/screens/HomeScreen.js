import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons'; // librería de íconos
import { useAuth } from '../contexto/AuthContext';// ¿Quién es el usuario que acaba de iniciar sesión?

export default function HomeScreen({ navigation }) {
    // Obtenemos al usuario logueado desde el contexto, pantalla principal.
    const { user } = useAuth();// busca al uruario y y la variable user tiene gusrdados los datos


    return (
        <ScrollView style={styles.container} bounces={false}>{/* estetica, no rebote */}
            <StatusBar barStyle="dark-content" backgroundColor="#90CAF9" />
       
            {/* Cabecera Azul, evita que la app caiga,, comodin*/}
            <View style={styles.header}>
                <Text style={styles.greetingTitle}>¡Hola, {user?.nombre || 'User'}!</Text>
                <Text style={styles.greetingSub}>Tienes 3 tareas pendientes</Text>
            </View>

            {/* Contenido Principal */}
            <View style={styles.content}>
                
                {/* Tarjetas Superiores (Cuadros), ve a la pantalla de tareas */}
                <View style={styles.rowCards}>
                    <TouchableOpacity style={styles.squareCard} onPress={() => navigation.navigate('Tareas')}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                            <Feather name="list" size={24} color="#FF5252" />
                        </View>
                        <Text style={styles.cardNumber}>4</Text>
                        <Text style={styles.cardText}>Tareas pendientes{'\n'}Más información</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.squareCard} onPress={() => navigation.navigate('Materias')}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Feather name="book-open" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.cardNumber}>4</Text>
                        <Text style={styles.cardText}>Materias inscritas{'\n'}Más información</Text>
                    </TouchableOpacity>
                </View>

                {/* Tarjeta de Progreso */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Progreso general</Text>
                        <Feather name="trending-up" size={20} color="#1976D2" />
                    </View>
                    <Text style={styles.progressPercentage}>25%</Text>
                    
                    {/* Barra de progreso visual */}
                    <View style={styles.progressBarBackground}>
                        <View style={styles.progressBarFill} />
                    </View>
                    <Text style={styles.progressText}>1 de 4 completadas</Text>
                </View>

                {/* Tarjeta de Próxima Entrega */}
                <View style={styles.deliveryCard}>
                    <View style={styles.deliveryIcon}>
                        <Feather name="clock" size={24} color="#FF5252" />
                    </View>
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryTitle}>Próxima entrega</Text>
                        <Text style={styles.deliverySubject}>Matemáticas</Text>
                        <View style={styles.tagContainer}>
                            <View style={styles.priorityTag}>
                                <Text style={styles.priorityText}>Alta</Text>
                            </View>
                            <Text style={styles.dateText}>24 Feb</Text>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Ver detalles</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        backgroundColor: '#90CAF9', // Azul claro del wireframe
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    greetingTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    greetingSub: { fontSize: 16, color: '#444', marginTop: 5 },
    content: { padding: 20, marginTop: -15 },
    rowCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    squareCard: {
        backgroundColor: '#FFFFFF',
        width: '48%',
        padding: 15,
        borderRadius: 20,
        borderColor: '#4FC3F7',
        borderWidth: 1.5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    cardNumber: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    cardText: { fontSize: 12, color: '#666', marginTop: 5, lineHeight: 16 },
    progressCard: {
        backgroundColor: '#E0F7FA', // Cian super claro
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    progressTitle: { fontSize: 16, color: '#555', fontWeight: '600' },
    progressPercentage: { fontSize: 32, fontWeight: 'bold', color: '#333', marginVertical: 10 },
    progressBarBackground: { height: 8, backgroundColor: '#B2EBF2', borderRadius: 4, marginBottom: 10 },
    progressBarFill: { width: '25%', height: '100%', backgroundColor: '#00BCD4', borderRadius: 4 },
    progressText: { fontSize: 13, color: '#666' },
    deliveryCard: {
        backgroundColor: '#FFCDD2', // Rojo claro pastel
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    deliveryIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    deliveryInfo: { flex: 1 },
    deliveryTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    deliverySubject: { fontSize: 14, color: '#555', marginBottom: 8 },
    tagContainer: { flexDirection: 'row', alignItems: 'center' },
    priorityTag: { backgroundColor: '#FF5252', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 10 },
    priorityText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    dateText: { fontSize: 13, color: '#333', fontWeight: '500' },
    detailsButton: {
        backgroundColor: '#FFCDD2',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    detailsButtonText: { color: '#333', fontSize: 14, fontWeight: 'bold' }
});