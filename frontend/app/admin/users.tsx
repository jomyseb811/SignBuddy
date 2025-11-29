import adminService from '@/services/admin'
import auth, { getStoredUser } from '@/services/auth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface User {
  _id: string
  username: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadCurrentUser()
    loadUsers()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const userData = await getStoredUser()
      setCurrentUser(userData)
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await auth.logout()
            router.replace('/login')
          },
        },
      ]
    )
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await adminService.getAllUsers()
      setUsers(usersData)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setModalVisible(true)
  }

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) return

    try {
      await adminService.updateUserRole(selectedUser._id, newRole)
      Alert.alert('Success', 'User role updated successfully!')
      setModalVisible(false)
      loadUsers() // Refresh the user list
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update user role')
    }
  }

  const deactivateUser = async (userId: string, username: string) => {
    Alert.alert(
      'Deactivate User',
      `Are you sure you want to deactivate ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deactivateUser(userId)
              Alert.alert('Success', 'User deactivated successfully!')
              loadUsers() // Refresh the user list
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to deactivate user')
            }
          }
        }
      ]
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#8B5CF6'
      case 'verified_user': return '#10B981'
      case 'super_user': return '#F59E0B'
      default: return '#6B7280'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with logout button */}
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>User Management</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Manage user roles and permissions</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : (
          <View style={styles.userList}>
            {users.map((user) => (
              <View 
                key={user._id} 
                style={[
                  styles.userCard, 
                  user._id === currentUser?.id && styles.currentUserCard
                ]}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <Text style={styles.date}>Joined: {formatDate(user.createdAt)}</Text>
                </View>
                
                <View style={styles.userActions}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.roleText}>{user.role}</Text>
                  </View>
                  
                  {!user.isActive && (
                    <View style={styles.deactivatedBadge}>
                      <Text style={styles.deactivatedText}>Deactivated</Text>
                    </View>
                  )}
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleRoleChange(user)}
                    >
                      <Ionicons name="hammer-outline" size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                    
                    {user._id !== currentUser?.id && user.isActive && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deactivateUser(user._id, user.username)}
                      >
                        <Ionicons name="ban-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Role Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change User Role</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            {selectedUser && (
              <>
                <Text style={styles.modalSubtitle}>
                  Changing role for: {selectedUser.username}
                </Text>
                
                <View style={styles.roleOptions}>
                  {['user', 'verified_user', 'super_user', 'admin'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        newRole === role && styles.selectedRoleOption
                      ]}
                      onPress={() => setNewRole(role)}
                    >
                      <Text style={[
                        styles.roleOptionText,
                        newRole === role && styles.selectedRoleOptionText
                      ]}>
                        {role.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={updateUserRole}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
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
  userList: {
    gap: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserCard: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  userActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  deactivatedBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  deactivatedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
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
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  roleOption: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectedRoleOption: {
    backgroundColor: '#8B5CF6',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  selectedRoleOptionText: {
    color: '#FFFFFF',
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
  saveButton: {
    backgroundColor: '#8B5CF6',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})