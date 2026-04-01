import React, { createContext, useState, useContext, useEffect } from 'react';
import UserController from '../controllers/UserController';

// Creamos el contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
//Mientras esto sea true pantalla de carga o un spinner en tu aplicación.
// Al abrir, revisamos si el usuario ya había iniciado sesión antes
    useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await UserController.getActiveSession();
            if (sessionUser) {
              setUser(sessionUser);
            } // Si encuentra un usuario, lo guarda en el estado.
          } catch (error) {
            console.error("Error verificando sesión:", error);
          } finally {
            setIsLoading(false);
          }
        };
        checkSession();
    }, []);

  // Función para iniciar sesión
    const login = async (correo, password, recordar) => {
        const result = await UserController.login(correo, password, recordar);
        if (result.success) {
            setUser(result.usuario);
        }
        return result;
    };

    // Función para registrar
    const register = async (nombre, correo, password) => {
        const result = await UserController.register(nombre, correo, password);
        // No logueamos automáticamente en registro. Dejamos que el usuario inicie sesión.
        // Esto evita navegar a Login cuando ya se pasó al flujo privado.
        return result;
    };

    // Función para cerrar sesión
    const logout = async () => {
        await UserController.logout();
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
        {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);