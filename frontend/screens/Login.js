import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hold on', 'Please fill in all the details to continue.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      
      await AsyncStorage.setItem('token', token);
      login(); 
    } catch (err) {
      console.error(err);
      Alert.alert('Oops!', err.response?.data?.msg || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Feather name="pie-chart" size={32} color="#4F46E5" />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to manage your finances</Text>
          </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
        )}

          <TouchableOpacity 
            onPress={() => {
              if (Platform.OS === 'web' && typeof document !== 'undefined' && document.activeElement) {
                document.activeElement.blur();
              }
              navigation.navigate('Signup');
            }} 
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              New here? <Text style={styles.switchTextBold}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, width: '100%', maxWidth: 450, alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  header: { marginBottom: 48 },
  iconWrapper: { width: 64, height: 64, backgroundColor: '#E0E7FF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  form: { marginBottom: 32 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 20 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827', outlineStyle: 'none' },
  eyeIcon: { padding: 8 },
  loader: { marginVertical: 16 },
  loginBtn: { backgroundColor: '#4F46E5', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...Platform.select({ web: { boxShadow: '0px 4px 8px rgba(79, 70, 229, 0.3)' }, default: { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } }) },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  switchBtn: { alignItems: 'center' },
  switchText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  switchTextBold: { color: '#4F46E5', fontWeight: 'bold' },
});

export default Login;