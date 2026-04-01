import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Contexto de Autenticación
import { AuthProvider, useAuth } from './contexto/AuthContext';

// Pantallas Públicas (Sin iniciar sesión)
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import RecuperarContrasenaScreen from './screens/RecuperarContrasenaScreen';

// Pantallas Privadas (Pestañas del menú inferior)
import HomeScreen from './screens/HomeScreen';
import MateriasScreen from './screens/MateriasScreen';
import TareasScreen from './screens/TareasScreen';
import PerfilScreen from './screens/PerfilScreen';

// Pantallas Privadas (Formularios adicionales)
import CrearMateriaScreen from './screens/CrearMateriaScreen';
import CrearTareaScreen from './screens/CrearTareaScreen';
import EditarMateriaScreen from './screens/EditarMateriaScreen';
import EditarTareaScreen from './screens/EditarTareaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Configuración del Menú Inferior (Pestañas)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos el header feo por defecto
        tabBarActiveTintColor: '#4FC3F7', // Color azul claro para la pestaña activa
        tabBarInactiveTintColor: '#A0A0A0', // Gris para las inactivas
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Materias" 
        component={MateriasScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Tareas" 
        component={TareasScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="check-square" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}

// 2. Lógica de Navegación Principal (Decide qué mostrar según la sesión)
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Mientras verifica si hay una sesión guardada, mostramos pantalla en blanco
  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // === RUTAS PRIVADAS (Usuario Logueado) ===
        <Stack.Group>
          {/* Main contiene las 4 pestañas de abajo */}
          <Stack.Screen name="Main" component={MainTabs} />
          
          {/* Pantallas adicionales que flotan por encima del menú */}
          <Stack.Screen name="CrearMateria" component={CrearMateriaScreen} />
          <Stack.Screen name="CrearTarea" component={CrearTareaScreen} />
          <Stack.Screen name="EditarMateria" component={EditarMateriaScreen} />
          <Stack.Screen name="EditarTarea" component={EditarTareaScreen} />
        </Stack.Group>
      ) : (
        // === RUTAS PÚBLICAS (Usuario NO Logueado) ===
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="RecuperarContrasena" component={RecuperarContrasenaScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

// 3. Componente Raíz que envuelve toda la App
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}