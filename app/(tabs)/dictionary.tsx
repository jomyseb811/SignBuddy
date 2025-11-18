import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the type for dictionary items
interface DictionaryItem {
  id: string;
  word: string;
  sign: string;
  category: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd932a5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    color: '#1F2937',
    fontFamily: 'IrishGrover',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dictionaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signPreview: {
    marginRight: 12,
  },
  placeholderSign: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  playButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
});

// Dictionary data

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<DictionaryItem[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData([]);
    } else {
      const filtered = filteredData.filter(item =>
        item.word.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderDictionaryItem = ({ item }: { item: DictionaryItem }) => (
    <View style={styles.dictionaryItem}>
      <View style={styles.signPreview}>
        <View style={styles.placeholderSign}>
          <Text style={styles.placeholderText}>Sign Preview</Text>
        </View>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play-circle" size={32} color="#67E8F9" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dictionary</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search signs..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Dictionary List or Empty State */}
      {filteredData.length === 0 && searchQuery.trim() === '' ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for sign language words</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderDictionaryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}