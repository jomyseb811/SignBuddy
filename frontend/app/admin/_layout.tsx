import AdminGuard from '@/components/AdminGuard'
import { FontLoader } from '@/components/FontLoader'
import { icon } from '@/constants/icons'
import auth from '@/services/auth'
import { Ionicons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AdminTabLayout = () => {
  const router = useRouter()

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

  return (
    <AdminGuard>
      <FontLoader>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: true,
              tabBarStyle: styles.tabBar,
              tabBarLabelStyle: styles.tabBarLabel,
              tabBarActiveTintColor: "#ffffff",
              tabBarInactiveTintColor: '#6564CD',
              tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
          >
            <Tabs.Screen name='users' options={{
              title: 'Users', headerShown: false, tabBarIcon: ({ focused }) => (
                <Image source={icon.profile} style={[styles.imageStyle,
                { tintColor: focused ? "#ffffff" : "#6564CD" }]} />
              )
            }} />

            <Tabs.Screen name='signs' options={{
              title: 'Signs', headerShown: false, tabBarIcon: ({ focused }) => (
                <Image source={icon.dictionary} style={[styles.imageStyle,
                { tintColor: focused ? "#ffffff" : "#6564CD" }]} />
              )
            }} />

            <Tabs.Screen name='dashboard' options={{
              title: 'Dashboard', headerShown: false, tabBarIcon: ({ focused }) => (
                <Image source={icon.home} style={[styles.imageStyle,
                { tintColor: focused ? "#ffffff" : "#6564CD" }]} />
              )
            }} />

          </Tabs>
        </View>
      </FontLoader>
    </AdminGuard>
  )
}

export default AdminTabLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#8B5CF6',
  },
  headerTitle: {
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
  tabBar: {
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 36,
    height: 56,
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#8B5CF6', // Purple color for admin panel
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'IrishGrover-Regular',
  },
  imageStyle: {
    width: 24,
    height: 20,
  }
})