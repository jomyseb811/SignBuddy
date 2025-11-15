import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const streakDays = [true, true, false, false, false, false, false];

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
          <Text style={styles.userName}>User name</Text>
          <Text style={styles.userEmail}>username@gmail.com</Text>
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
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={20} color="#1F2937" />
                <Text style={styles.menuText}>Edit Personal data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
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

            <TouchableOpacity style={styles.menuItem}>
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
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteButton}>
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
});