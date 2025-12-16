import { FontLoader } from '@/components/FontLoader'
import { signService } from '@/services/signService'
import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSign, setSelectedSign] = useState<any>(null)
  const [alphabets, setAlphabets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Mock data for dictionary items
  const dictionaryItems = [
    { id: '1', letter: 'A', word: 'Apple', description: 'A red or green fruit' },
    { id: '2', letter: 'B', word: 'Book', description: 'A set of written pages' },
    { id: '3', letter: 'C', word: 'Cat', description: 'A small domesticated animal' },
    { id: '4', letter: 'D', word: 'Dog', description: 'A loyal pet animal' },
    { id: '5', letter: 'E', word: 'Elephant', description: 'A large mammal with a trunk' },
    { id: '6', letter: 'F', word: 'Fish', description: 'An aquatic animal' },
    { id: '7', letter: 'G', word: 'Guitar', description: 'A musical instrument' },
    { id: '8', letter: 'H', word: 'House', description: 'A place where people live' },
  ]

  useEffect(() => {
    loadAlphabets()
  }, [])

  const loadAlphabets = async () => {
    try {
      setLoading(true)
      const data = await signService.getAlphabets()
      setAlphabets(data as any[])
    } catch (error) {
      console.error('Error loading alphabets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search query
  const filteredItems = dictionaryItems.filter(item => 
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLetterPress = async (letter: string) => {
    try {
      // Fetch the specific sign for this letter from the backend
      // We'll search for words that start with the pressed letter
      const signData = await signService.getSign(letter)
      if (signData) {
        setSelectedSign(signData)
        setModalVisible(true)
      } else {
        // Fallback to mock data if no sign is found
        setSelectedSign({
          letter,
          word: `${letter}pple`,
          cloudinaryUrl: 'https://placehold.co/200'
        })
        setModalVisible(true)
      }
    } catch (error) {
      console.error('Error fetching sign:', error)
      // Fallback to mock data if API call fails
      setSelectedSign({
        letter,
        word: `${letter}pple`,
        cloudinaryUrl: 'https://placehold.co/200'
      })
      setModalVisible(true)
    }
  }

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
            <Text style={styles.title}>Dictionary</Text>
            <Text style={styles.subtitle}>Browse signs alphabetically</Text>
          </View>
          
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search signs..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          
          <View style={styles.letterGrid}>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
              <TouchableOpacity 
                key={letter} 
                style={styles.letterBox}
                onPress={() => handleLetterPress(letter)}
              >
                <Text style={styles.letterText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.dictionarySection}>
            <Text style={styles.sectionTitle}>All Signs</Text>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.dictionaryCard}>
                  <View style={styles.cardLetter}>
                    <Text style={styles.letter}>{item.letter}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.word}>{item.word}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No signs found</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Sign Image Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedSign && (
                <>
                  <Text style={styles.modalTitle}>{selectedSign.word}</Text>
                  {selectedSign.cloudinaryUrl ? (
                    <Image 
                      source={{ uri: selectedSign.cloudinaryUrl }} 
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderText}>No image available</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
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
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#1F2937',
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  letterBox: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#67E8F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
  },
  letterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'IrishGrover-Regular',
    marginBottom: 16,
  },
  dictionarySection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  dictionaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardLetter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#67E8F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardContent: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 18,
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  closeButton: {
    backgroundColor: '#67E8F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
})