import auth, { getStoredUser } from '@/services/auth';
import { chapterProgressService } from '@/services/chapterProgress';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [editUserData, setEditUserData] = useState({ username: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(false);
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const streakDays = [true, true, false, false, false, false, false];

  useEffect(() => {
    loadUserData();
    loadProgressData();
    
    // Subscribe to progress changes
    const unsubscribe = chapterProgressService.subscribe((chapters) => {
      setCompletedChapters(chapters);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getStoredUser();
      setUser(userData);
      if (userData) {
        setEditUserData({
          username: userData.username || '',
          email: userData.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProgressData = () => {
    try {
      const chapters = chapterProgressService.getCompletedChapters();
      setCompletedChapters(chapters);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear progress and navigate to login
            chapterProgressService.resetProgress();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveProfile = async () => {
    // Validate email format
    if (editUserData.email && !isValidEmail(editUserData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Validate username
    if (!editUserData.username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      const response = await auth.updateProfile({
        username: editUserData.username.trim(),
        email: editUserData.email.trim()
      });
      
      // Update state with the response from backend
      setUser(response.user);
      
      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
    } catch (error: any) {
      // Provide specific error messages based on the error received
      if (error.message && error.message.includes('Email is already taken')) {
        Alert.alert('Error', 'This email is already registered. Please use a different email.');
      } else if (error.message && error.message.includes('Username is already taken')) {
        Alert.alert('Error', 'This username is already taken. Please choose a different username.');
      } else {
        Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const handleSavePassword = async () => {
    // Validate new password
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // Check if current password is provided
    if (!passwordData.currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    
    setLoading(true);
    try {
      await auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      Alert.alert('Success', 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setChangePasswordModalVisible(false);
    } catch (error: any) {
      // Provide specific error messages based on the error received
      if (error.message && error.message.includes('Current password is incorrect')) {
        Alert.alert('Error', 'The current password you entered is incorrect. Please try again.');
      } else {
        Alert.alert('Error', error.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      await auth.deleteAccount();
      
      Alert.alert('Success', 'Account deleted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear progress and navigate to login
            chapterProgressService.resetProgress();
            router.replace('/login');
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage (assuming 7 chapters total)
  const progressPercentage = Math.round((completedChapters.length / 7) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.streakCard}>
          <View style={styles.flameIcon}>
            <Text style={styles.flameEmoji}>📊</Text>
          </View>
          <Text style={styles.streakTitle}>Learning Progress</Text>
          <Text style={styles.progressText}>{completedChapters.length}/7 chapters completed</Text>
          <Text style={styles.percentageText}>{progressPercentage}%</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.flameIcon}>
            <Text style={styles.flameEmoji}>🔥</Text>
          </View>
          <Text style={styles.streakTitle}>Start Daily Streak!</Text>
          <View style={styles.streakDots}>
            {streakDays.map((active, index) => (
              <View
                key={index}
                style={[
                  styles.streakDot,
                  active && styles.streakDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Edit Personal data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
              <View style={styles.menuLeft}>
                <Ionicons name="lock-closed-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Text style={styles.flagEmoji}>🇬🇧</Text>
                <Text style={styles.menuText}>Switch Language</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Learning Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Download your certificate</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => chapterProgressService.resetProgress()}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="refresh-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Reset All Progress</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Help</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>Terms and Condition</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>Privacy And Policy</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Version 8.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Username"
              value={editUserData.username}
              onChangeText={(text) => setEditUserData({...editUserData, username: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={editUserData.email}
              onChangeText={(text) => setEditUserData({...editUserData, email: text})}
              keyboardType="email-address"
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm New Password"
                value={passwordData.confirmNewPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmNewPassword: text})}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setChangePasswordModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePassword}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Changing...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteAccountModalVisible}
        onRequestClose={() => setDeleteAccountModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <TouchableOpacity onPress={() => setDeleteAccountModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.deleteWarning}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteAccountModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteAccountButton]}
                onPress={confirmDeleteAccount}
                disabled={loading}
              >
                <Text style={styles.deleteAccountButtonText}>
                  {loading ? 'Deleting...' : 'Delete Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE047',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:70,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  streakCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flameIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  flameEmoji: {
    fontSize: 40,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streakDots: {
    flexDirection: 'row',
    gap: 8,
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
  streakDotActive: {
    backgroundColor: '#8B5CF6',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  menuGroup: {
    backgroundColor: '#A5F3FC',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'C8F3F5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  flagEmoji: {
    fontSize: 20,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#67E8F9',
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  footerLink: {
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  version: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  // Modal Styles
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
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1F2937',
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
  deleteAccountButton: {
    backgroundColor: '#EF4444',
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
  deleteAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteWarning: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Added styles for password input + icon
  passwordContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 10,
  },
});
