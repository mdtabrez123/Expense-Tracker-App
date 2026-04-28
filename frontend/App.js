import React, { useContext } from 'react';
import './global.css';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Ignore specific warnings caused by react-navigation on react-native-web
LogBox.ignoreLogs(['props.pointerEvents is deprecated']);

// Import Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import AddExpense from './screens/AddExpense';
import EditExpense from './screens/EditExpense';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // === AppStack (Jab User Login ho jaye) ===
          <Stack.Group>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="AddExpense" component={AddExpense} />
            <Stack.Screen name="EditExpense" component={EditExpense} />
          </Stack.Group>
        ) : (
          // === AuthStack (Jab Login na ho) ===
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </AuthProvider>
  );
}