import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ResetSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleResetPassword = async (values: any) => {
    try {
      setError(null);
      const response = await resetPassword(values);
      if (response && response.status === 'success') {
        setToken(response.token);
        router.push({
          pathname: '/confirm-reset',
          params: { token: response.token }
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Password reset request failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Reset Password" showBackButton />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Forgot Your Password?</Text>
        <Text style={styles.subtitle}>Enter your username and email to reset your password</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Formik
          initialValues={{ username: '', email: '' }}
          validationSchema={ResetSchema}
          onSubmit={handleResetPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <Input
                label="Username"
                placeholder="Enter your username"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                error={touched.username && errors.username ? errors.username : undefined}
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                error={touched.email && errors.email ? errors.email : undefined}
              />

              <Button
                title="Reset Password"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.resetButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginTop: 24,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 8,
    marginBottom: 32,
    fontFamily: 'Inter_400Regular',
  },
  form: {
    width: '100%',
  },
  resetButton: {
    marginTop: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: Colors.neutral[600],
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  loginLink: {
    color: Colors.primary[600],
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  errorContainer: {
    backgroundColor: Colors.error[500] + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});