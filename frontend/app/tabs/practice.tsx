import { FontLoader } from '@/components/FontLoader'
import React, { useState } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PracticeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Mock data for practice categories
  const categories = ['All', 'Alphabet', 'Numbers', 'Greetings', 'Family']
  
  // Mock data for practice items
  const practiceItems = [
    { id: '1', title: 'Basic Alphabet', description: 'A-Z letters', level: 'Beginner', completed: true },
    { id: '2', title: 'Number Signs', description: '1-100 numbers', level: 'Beginner', completed: false },
    { id: '3', title: 'Common Greetings', description: 'Hello, Goodbye, Please', level: 'Beginner', completed: false },
    { id: '4', title: 'Family Members', description: 'Mother, Father, Sister, Brother', level: 'Intermediate', completed: false },
    { id: '5', title: 'Food Items', description: 'Apple, Bread, Water', level: 'Intermediate', completed: false },
    { id: '6', title: 'Emotions', description: 'Happy, Sad, Angry', level: 'Advanced', completed: false },
  ]

  return (
    <FontLoader>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#e5ff00" />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Practice</Text>
            <Text style={styles.subtitle}>Reinforce what you've learned</Text>
          </View>
          
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.practiceSection}>
            <Text style={styles.sectionTitle}>Practice Modules</Text>
            {practiceItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.practiceCard, item.completed && styles.completedCard]}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.cardTitle, item.completed && styles.completedText]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.cardDescription, item.completed && styles.completedText]}>
                      {item.description}
                    </Text>
                  </View>
                  {item.completed ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.levelBadge}>{item.level}</Text>
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={[styles.cardFooterText, item.completed && styles.completedText]}>
                    {item.completed ? 'Completed' : 'Start Practice'}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </FontLoader>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 36,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'IrishGrover-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'IrishGrover-Regular',
    marginBottom: 16,
  },
  categorySection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: '#67E8F9',
  },
  categoryText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  practiceSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  practiceCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  completedCard: {
    backgroundColor: '#D1FAE5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  levelBadge: {
    backgroundColor: '#67E8F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkmark: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#065F46',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#1F2937',
  },
})