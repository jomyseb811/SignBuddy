import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getSignLanguageAssets } from '@/services/cloudinary';

interface PracticeCategory {
  id: number;
  title: string;
  color: string;
  locked: boolean;
}

export default function PracticeScreen() {
  const [testAssets, setTestAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const categories: PracticeCategory[] = [
    { id: 1, title: 'Numbers', color: '#D1D5DB', locked: true },
    { id: 2, title: 'Vocabulary', color: '#C4B5FD', locked: false },
    { id: 3, title: 'Fingerspelling', color: '#818CF8', locked: false },
  ];

  const testCloudinaryConnection = async () => {
    setLoading(true);
    try {
      // Try to fetch assets from the asl_alphabets folder as a test
      const assets = await getSignLanguageAssets('asl_alphabets');
      setTestAssets(assets);
      setTestCompleted(true);
      
      if (assets.length > 0) {
        Alert.alert('Success', `Connected to Cloudinary! Found ${assets.length} assets.`);
      } else {
        Alert.alert('Notice', 'Connected to Cloudinary, but no assets found in the asl_alphabets folder.');
      }
    } catch (error) {
      console.error('Cloudinary test error:', error);
      Alert.alert('Error', 'Failed to connect to Cloudinary. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
      </View>

      {/* Cloudinary Test Section */}
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Cloudinary Connection Test</Text>
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={testCloudinaryConnection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.testButtonText}>
              {testCompleted ? 'Test Again' : 'Test Connection'}
            </Text>
          )}
        </TouchableOpacity>
        
        {testAssets.length > 0 && (
          <Text style={styles.assetCount}>
            Found {testAssets.length} assets in Cloudinary
          </Text>
        )}
      </View>

      {/* Categories */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: category.color },
              category.locked && styles.categoryCardLocked
            ]}
            disabled={category.locked}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE047',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  testSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#A855F7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assetCount: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categoriesContainer: {
    paddingBottom: 40,
  },
  categoryCard: {
    width: '100%',
    paddingVertical: 32,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardLocked: {
    opacity: 0.5,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});