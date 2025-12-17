import { getStoredUser, getUserProfile, logout, togglePushNotifications } from '@/services/auth';
import {
  cancelAllNotifications,
  registerForNotifications,
  scheduleDailyReminder,
  scheduleStreakReminder,
  setupNotifications
} from '@/services/notificationService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontLoader } from '../../components/FontLoader';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    setupNotifications();
  }, []);

  const loadUserData = async () => {
    try {
      // Fetch fresh user data from API to get latest streak information
      const userData = await getUserProfile();
      setUser(userData);
      // Load notification preference from user data
      setNotificationsEnabled(userData.pushNotificationsEnabled ?? true);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to stored user data if API call fails
      const storedUserData = await getStoredUser();
      setUser(storedUserData);
      setNotificationsEnabled(storedUserData?.pushNotificationsEnabled ?? true);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
  try {
    setLoading(true);
    setNotificationsEnabled(value);
    
    // Update backend preference
    await togglePushNotifications(value);
    
    if (value) {
      // Register for LOCAL notifications (works in Expo Go)
      const granted = await registerForNotifications();
      
      if (granted) {
        await scheduleDailyReminder(20, 0); // 8 PM
        await scheduleStreakReminder(22, 0); // 10 PM
        Alert.alert('Success', 'Notifications enabled!');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in settings');
        setNotificationsEnabled(false);
      }
    } else {
      await cancelAllNotifications();
      Alert.alert('Success', 'Notifications disabled');
    }
  } catch (error) {
    console.error('Error updating notification preference:', error);
    setNotificationsEnabled(!value);
    Alert.alert('Error', 'Failed to update notification preference');
  } finally {
    setLoading(false);
  }
};

 const handleLogout = async () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            // Cancel all notifications
            await cancelAllNotifications();
            
            // Logout
            await logout();
            
            // Navigate to login
            router.replace('/login');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout');
          }
        }
      }
    ]
  );
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
                  <Text style={styles.statValue}>{user?.currentStreak || 0}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.signsLearned || 0}</Text>
                  <Text style={styles.statLabel}>Signs Learned</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.level || 'Beginner'}</Text>
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
                onValueChange={handleNotificationToggle}
                value={notificationsEnabled}
                disabled={loading}
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
            
            <TouchableOpacity 
              style={styles.menuItem}
              // onPress={() => router.push('/(tabs)/profile/edit')}
            >
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              // onPress={() => router.push('/(tabs)/profile/statistics')}
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuText}>Learning Statistics</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              // onPress={() => router.push('/(tabs)/profile/help')}
            >
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuText}>Help & Support</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>

            {/* Logout with different styling */}
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              <Text style={[styles.menuArrow, styles.logoutText]}>→</Text>
            </TouchableOpacity>
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
  // Logout specific styles
  logoutItem: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});