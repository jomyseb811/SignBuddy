import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface PracticeCategory {
  id: number;
  title: string;
  color: string;
  locked: boolean;
}

export default function PracticeScreen() {
  const categories: PracticeCategory[] = [
    { id: 1, title: 'Numbers', color: '#D1D5DB', locked: true },
    { id: 2, title: 'Vocabulary', color: '#C4B5FD', locked: false },
    { id: 3, title: 'Fingerspelling', color: '#818CF8', locked: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
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