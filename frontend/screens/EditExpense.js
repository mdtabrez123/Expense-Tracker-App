import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

const CATEGORIES = [
  { name: 'Food', icon: 'coffee', color: '#EA580C' },
  { name: 'Transport', icon: 'navigation', color: '#2563EB' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#DB2777' },
  { name: 'Bills', icon: 'file-text', color: '#DC2626' },
  { name: 'Other', icon: 'box', color: '#4B5563' }
];

const EditExpense = ({ route, navigation }) => {
  const { item } = route.params;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const API_URL = 'http://172.16.33.96:5000/api/expenses';

  useEffect(() => {
    if (item) {
      setAmount(item.amount.toString());
      setCategory(item.category);
      setNote(item.note || '');
    }
  }, [item]);

  const handleUpdate = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert("Hold on", "Please enter a valid positive amount.");
      return;
    }
    if (!category) {
      Alert.alert("Hold on", "Please select a category.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      await axios.put(`${API_URL}/${item._id}`, {
        amount: Number(amount),
        category: category,
        note: note.trim()
      }, config);
      
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Oops!", "Could not update expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this expense? This cannot be undone.");
      if (!confirmed) return;
      executeDelete();
    } else {
      Alert.alert(
        "Delete Expense",
        "Are you sure you want to delete this expense? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: executeDelete }
        ]
      );
    }
  };

  const executeDelete = async () => {
    try {
      setDeleteLoading(true);
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      await axios.delete(`${API_URL}/${item._id}`, config);
      
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Oops!", "Could not delete expense.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Expense</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>How much?</Text>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#D1D5DB"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                maxLength={7}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoriesWrapper}>
            {CATEGORIES.map(cat => {
              const isSelected = category === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Feather name={cat.icon} size={16} color={isSelected ? '#FFF' : cat.color} style={{ marginRight: 8 }} />
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Note (Optional)</Text>
          <View style={styles.inputWrapper}>
            <Feather name="edit-2" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              placeholder="What was this for?"
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
            />
          </View>

          <View style={styles.footer}>
            {loading ? (
              <ActivityIndicator size="large" color="#4F46E5" style={{ marginBottom: 16 }} />
            ) : (
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.saveBtnText}>Update Transaction</Text>
              </TouchableOpacity>
            )}

            {deleteLoading ? (
              <ActivityIndicator size="large" color="#EF4444" style={{ marginTop: 16 }} />
            ) : (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Feather name="trash-2" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.deleteBtnText}>Delete Transaction</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  content: { padding: 24 },
  amountContainer: { alignItems: 'center', marginBottom: 40 },
  amountLabel: { fontSize: 14, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12 },
  amountInputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E0E7FF', paddingBottom: 8 },
  currencySymbol: { fontSize: 40, fontWeight: 'bold', color: '#4F46E5', marginRight: 8 },
  amountInput: { fontSize: 60, fontWeight: 'bold', color: '#111827', minWidth: 100, textAlign: 'center', outlineStyle: 'none' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#374151', textTransform: 'uppercase', marginBottom: 16 },
  categoriesWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12, marginBottom: 12 },
  categoryChipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  categoryTextSelected: { color: '#FFFFFF' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 24 },
  textInput: { flex: 1, fontSize: 16, color: '#111827', outlineStyle: 'none' },
  footer: { paddingTop: 24, paddingBottom: 40, backgroundColor: '#FFFFFF' },
  saveBtn: { backgroundColor: '#4F46E5', borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', backgroundColor: '#FEF2F2', borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  deleteBtnText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
});

export default EditExpense;