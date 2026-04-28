import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const API_URL = 'http://172.16.33.96:5000/api/auth/register';

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Hold on', 'Please fill in all the details.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(API_URL, { name, email, password });
      const { token } = res.data;
      
      await AsyncStorage.setItem('token', token);
      login();
    } catch (err) {
      console.error(err);
      Alert.alert('Oops!', err.response?.data?.msg || 'Registration failed.');
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start tracking your expenses</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

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
          <TouchableOpacity style={styles.loginBtn} onPress={handleSignup}>
            <Text style={styles.loginBtnText}>Create Account</Text>
          </TouchableOpacity>
        )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchTextBold}>Log In</Text>
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
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 1, borderColor: '#E5E7EB' },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  form: { marginBottom: 32 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 20 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827', outlineStyle: 'none' },
  eyeIcon: { padding: 8 },
  loader: { marginVertical: 16 },
  loginBtn: { backgroundColor: '#4F46E5', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  switchBtn: { alignItems: 'center' },
  switchText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  switchTextBold: { color: '#4F46E5', fontWeight: 'bold' },
});

export default Signup;