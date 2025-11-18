// components/SignLanguageLesson.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getSignLanguageAssets } from '../services/cloudinary';

const SIGNS_PER_LESSON = 6;

const SignLanguageLesson = ({ folderName, title }) => {
  const [assets, setAssets] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    const fetchedAssets = await getSignLanguageAssets(folderName);
    setAssets(fetchedAssets);
    setLoading(false);
  };

  const getCurrentLessonAssets = () => {
    const startIndex = currentLesson * SIGNS_PER_LESSON;
    const endIndex = startIndex + SIGNS_PER_LESSON;
    return assets.slice(startIndex, endIndex);
  };

  const nextLesson = () => {
    const maxLessons = Math.ceil(assets.length / SIGNS_PER_LESSON);
    if (currentLesson < maxLessons - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const renderSignItem = ({ item }) => (
    <View style={styles.signCard}>
      <Image 
        source={{ uri: item.secure_url }} 
        style={styles.signImage}
        resizeMode="contain"
      />
      <Text style={styles.signLabel}>
        {item.public_id.split('/').pop().toUpperCase()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading {title}...</Text>
      </View>
    );
  }

  const currentAssets = getCurrentLessonAssets();
  const totalLessons = Math.ceil(assets.length / SIGNS_PER_LESSON);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title} - Lesson {currentLesson + 1} of {totalLessons}
        </Text>
        
        <View style={styles.navigation}>
          <TouchableOpacity 
            onPress={prevLesson} 
            disabled={currentLesson === 0}
            style={[styles.navButton, currentLesson === 0 && styles.disabledButton]}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={nextLesson} 
            disabled={currentLesson === totalLessons - 1}
            style={[styles.navButton, currentLesson === totalLessons - 1 && styles.disabledButton]}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={currentAssets}
        renderItem={renderSignItem}
        keyExtractor={(item) => item.public_id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
  },
  signCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  signLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SignLanguageLesson;