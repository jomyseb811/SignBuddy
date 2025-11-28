import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import auth from '@/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');
    if (!isValidEmail(email)) return Alert.alert('Error', 'Please enter a valid email address');
    if (!password.trim()) return Alert.alert('Error', 'Please enter your password');

    setLoading(true);
    try {
      const response = await auth.login({
        email: email.trim(),
        password: password.trim(),
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      // Provide specific error messages based on the error received
      if (error.message && error.message.includes('Invalid credentials')) {
        // Since backend sends the same message for both incorrect email and password,
        // we provide a generic but helpful message
        Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
      } else {
        Alert.alert('Login Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#e5ff00" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>SignBuddy</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Login to continue learning</Text>
          </View>

          <View style={styles.card}>
            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="email@domain.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            {/* Password Input + Show/Hide Button */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showButtonText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Google Button */}
            <TouchableOpacity style={styles.socialButton} disabled={loading}>
              <Text style={styles.socialButtonText}>
                <Text style={styles.googleIcon}>G</Text> Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Apple Button */}
            <TouchableOpacity style={styles.socialButton} disabled={loading}>
              <Text style={styles.socialButtonText}>
                <Text style={styles.appleIcon}>🍎</Text> Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbd932a5' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#333' },
  card: {
    backgroundColor: '#7b7fde',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    padding: 6,
  },
  showButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  socialButton: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  socialButtonText: { fontSize: 16 },
  googleIcon: { fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  appleIcon: { fontSize: 18, marginRight: 8 },
  signupContainer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: { fontSize: 14 },
  signupLink: { fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
