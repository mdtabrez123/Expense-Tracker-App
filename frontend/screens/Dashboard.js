import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseCard from '../components/ExpenseCard';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);


  useEffect(() => {
    fetchExpenses();
  }, []);

  // Listen for focus to refresh expenses after adding
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await api.get('/expenses', config);
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    logout();
  };

  const totalBalance = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryTotal = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Feather name="user" size={20} color="#4F46E5" />
          </View>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userName}>User</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Spent</Text>
        <Text style={styles.balanceValue}>₹{totalBalance.toLocaleString('en-IN')}</Text>
      </View>

      <Text style={styles.sectionTitle}>Analytics</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.analyticsScroll}>
        {Object.keys(categoryTotal).length === 0 ? (
          <View style={styles.analyticCard}>
             <Text style={styles.analyticCat}>No Data</Text>
             <Text style={styles.analyticAmt}>₹0</Text>
          </View>
        ) : (
          Object.entries(categoryTotal).map(([cat, amt]) => (
            <View key={cat} style={styles.analyticCard}>
              <Text style={styles.analyticCat}>{cat}</Text>
              <Text style={styles.analyticAmt}>₹{amt}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => <ExpenseCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>No expenses found</Text>
                <Text style={styles.emptySubText}>Add your first transaction!</Text>
              </View>
            }
          />
        )}

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => {
            if (Platform.OS === 'web' && typeof document !== 'undefined' && document.activeElement) {
              document.activeElement.blur();
            }
            navigation.navigate('AddExpense');
          }}
        >
          <Feather name="plus" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', position: 'relative' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  greetingText: { fontSize: 14, color: '#6B7280' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  logoutBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  balanceCard: { backgroundColor: '#4F46E5', borderRadius: 20, padding: 24, marginBottom: 24, ...Platform.select({ web: { boxShadow: '0px 10px 15px rgba(79, 70, 229, 0.3)' }, default: { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 } }) },
  balanceLabel: { color: '#E0E7FF', fontSize: 16, marginBottom: 8 },
  balanceValue: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  analyticsScroll: { marginBottom: 24, paddingBottom: 8, flexDirection: 'row' },
  analyticCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: '#F3F4F6', ...Platform.select({ web: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 } }) },
  analyticCat: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  analyticAmt: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
  fab: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', zIndex: 999, ...Platform.select({ web: { boxShadow: '0px 8px 10px rgba(79, 70, 229, 0.4)' }, default: { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 } }) },
});

export default Dashboard;