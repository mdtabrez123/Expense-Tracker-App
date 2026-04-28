import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categoryConfig = {
  Food: { icon: 'coffee', bgColor: '#FFF7ED', iconColor: '#EA580C' },
  Transport: { icon: 'navigation', bgColor: '#EFF6FF', iconColor: '#2563EB' },
  Shopping: { icon: 'shopping-bag', bgColor: '#FDF2F8', iconColor: '#DB2777' },
  Bills: { icon: 'file-text', bgColor: '#FEF2F2', iconColor: '#DC2626' },
  Other: { icon: 'box', bgColor: '#F3F4F6', iconColor: '#4B5563' },
};

const ExpenseCard = ({ item }) => {
  const config = categoryConfig[item.category] || categoryConfig['Other'];
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => {
        if (Platform.OS === 'web' && typeof document !== 'undefined' && document.activeElement) {
          document.activeElement.blur();
        }
        navigation.navigate('EditExpense', { item });
      }}
      style={styles.card}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
        <Feather name={config.icon} size={24} color={config.iconColor} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.categoryText}>{item.category}</Text>
        {item.note ? <Text style={styles.noteText} numberOfLines={1}>{item.note}</Text> : null}
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>₹{item.amount}</Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  noteText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default ExpenseCard;
