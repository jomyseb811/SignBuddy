import { getStoredUser, getUserProfile, togglePushNotifications } from '@/services/auth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontLoader } from '../../components/FontLoader';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

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
  
  // Profile menu items
  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: '👤' },
    { id: '2', title: 'Learning Statistics', icon: '📊' },
    // { id: '3', title: 'Achievements', icon: '🏆' },
    // { id: '4', title: 'Settings', icon: '⚙️' },
    { id: '5', title: 'Help & Support', icon: '❓' },
    { id: '6', title: 'Logout', icon: '🚪' },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Fetch fresh user data from API to get latest streak information
      const userData = await getUserProfile();
      setUser(userData);
      setNotificationsEnabled(userData.notificationsEnabled)
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to stored user data if API call fails
      const storedUserData = await getStoredUser();
      setUser(storedUserData);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
  try {
    setNotificationsEnabled(value); // Update UI immediately
    await togglePushNotifications(value); // Update backend
    
    // Optionally show success message
    console.log('Notification preference updated');
  } catch (error) {
    console.error('Error updating notification preference:', error);
    // Revert the switch if API call fails
    setNotificationsEnabled(!value);
    console.log('Failed to update notification preference');
  }
};
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
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your account</Text>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username || 'Loading...'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'Loading...'}</Text>
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.currentStreak }</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.signsLearned}</Text>
                  <Text style={styles.statLabel}>Signs Learned</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Push Notifications</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#67E8F9' }}
                thumbColor={notificationsEnabled ? '#1F2937' : '#f4f3f4'}
                onValueChange={setNotificationsEnabled}
                value={notificationsEnabled}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#67E8F9' }}
                thumbColor={darkModeEnabled ? '#1F2937' : '#f4f3f4'}
                onValueChange={setDarkModeEnabled}
                value={darkModeEnabled}
              />
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuArrow}>→</Text>
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
  profileSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#67E8F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'IrishGrover-Regular',
    marginBottom: 16,
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 18,
    color: '#1F2937',
  },
})