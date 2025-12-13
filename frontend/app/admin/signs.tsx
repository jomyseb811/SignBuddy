import adminService from '@/services/admin'
import { getStoredUser } from '@/services/auth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Sign {
  _id: string
  word: string
  sign: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  cloudinaryUrl: string
  uploadedBy: {
    username: string
    role: string
  }
  createdAt: string
}

export default function AdminSigns() {
  const router = useRouter()
  const [pendingSigns, setPendingSigns] = useState<Sign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSign, setSelectedSign] = useState<Sign | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadCurrentUser()
    loadPendingSigns()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const userData = await getStoredUser()
      setCurrentUser(userData)
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  const loadPendingSigns = async () => {
    try {
      setLoading(true)
      const signsData = await adminService.getPendingSigns()
      setPendingSigns(signsData)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load pending signs')
    } finally {
      setLoading(false)
    }
  }

  const handleSignAction = (sign: Sign) => {
    setSelectedSign(sign)
    setModalVisible(true)
  }

  const updateSignStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedSign) return

    try {
      await adminService.updateSignStatus(selectedSign._id, status)
      Alert.alert('Success', `Sign ${status} successfully!`)
      setModalVisible(false)
      loadPendingSigns() // Refresh the signs list
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to ${status} sign`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981'
      case 'rejected': return '#EF4444'
      default: return '#F59E0B'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sign Management</Text>
          <Text style={styles.subtitle}>Review and approve pending signs</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading pending signs...</Text>
        ) : pendingSigns.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#10B981" />
            <Text style={styles.emptyStateTitle}>No Pending Signs</Text>
            <Text style={styles.emptyStateText}>All signs have been reviewed!</Text>
          </View>
        ) : (
          <View style={styles.signList}>
            {pendingSigns.map((sign) => (
              <View key={sign._id} style={styles.signCard}>
                <View style={styles.signHeader}>
                  <Text style={styles.word}>{sign.word}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sign.status) }]}>
                    <Text style={styles.statusText}>{sign.status}</Text>
                  </View>
                </View>
                
                <View style={styles.signContent}>
                  {sign.cloudinaryUrl ? (
                    <Image 
                      source={{ uri: sign.cloudinaryUrl }} 
                      style={styles.signImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}
                  
                  <View style={styles.signDetails}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>{sign.category}</Text>
                    
                    <Text style={styles.detailLabel}>Uploaded by:</Text>
                    <Text style={styles.detailValue}>{sign.uploadedBy.username}</Text>
                    
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(sign.createdAt)}</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleSignAction(sign)}
                  >
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => {
                      setSelectedSign(sign)
                      updateSignStatus('rejected')
                    }}
                  >
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sign Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Approve Sign</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            {selectedSign && (
              <>
                <Text style={styles.modalSubtitle}>
                  Are you sure you want to approve "{selectedSign.word}"?
                </Text>
                
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoLabel}>Category:</Text>
                  <Text style={styles.modalInfoValue}>{selectedSign.category}</Text>
                  
                  <Text style={styles.modalInfoLabel}>Uploaded by:</Text>
                  <Text style={styles.modalInfoValue}>{selectedSign.uploadedBy.username}</Text>
                </View>
                
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.approveButton]}
                    onPress={() => updateSignStatus('approved')}
                  >
                    <Text style={styles.approveButtonText}>Approve Sign</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#8B5CF6',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signList: {
    gap: 16,
  },
  signCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  signContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  signImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  signDetails: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  modalInfo: {
    marginBottom: 20,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  modalInfoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})