import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

export default function SplashScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        
        // Animate logo first
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ]).start();
        
        // Wait for animation and check authentication
        setTimeout(() => {
          if (token) {
            router.replace('/(tabs)');
          } else {
            // If user is not logged in, stay on this screen
            // They can choose to login or register
          }
        }, 1500);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [fadeAnim, slideAnim]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.logoText}>Plan&Go</Text>
        <Text style={styles.tagline}>Plan your journey, enjoy the ride</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        <Button
          title="Register"
          onPress={handleRegister}
          type="outline"
          style={styles.registerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary[600],
    fontFamily: 'Inter_700Bold',
  },
  tagline: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    width: '100%',
  },
  loginButton: {
    marginBottom: 16,
  },
  registerButton: {
    marginBottom: 16,
  },
});