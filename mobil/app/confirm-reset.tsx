import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ConfirmResetSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ConfirmResetScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { confirmResetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace('/reset-password');
    }
  }, [token, router]);

  const handleConfirmReset = async (values: any) => {
    if (!token) {
      setError('Reset token is missing. Please request a new password reset.');
      return;
    }

    try {
      setError(null);
      const data = {
        token,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      };
      
      const response = await confirmResetPassword(data);
      if (response && response.status === 'success') {
        setSuccess('Password reset successful! You can now login with your new password.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Password reset failed. Please try again.');
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
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>Enter and confirm your new password</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        <Formik
          initialValues={{ new_password: '', confirm_password: '' }}
          validationSchema={ConfirmResetSchema}
          onSubmit={handleConfirmReset}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={values.new_password}
                onChangeText={handleChange('new_password')}
                onBlur={handleBlur('new_password')}
                secureTextEntry
                error={touched.new_password && errors.new_password ? errors.new_password : undefined}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                value={values.confirm_password}
                onChangeText={handleChange('confirm_password')}
                onBlur={handleBlur('confirm_password')}
                secureTextEntry
                error={
                  touched.confirm_password && errors.confirm_password
                    ? errors.confirm_password
                    : undefined
                }
              />

              <Button
                title="Reset Password"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.resetButton}
              />
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
  successContainer: {
    backgroundColor: Colors.success[500] + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success[500],
  },
  successText: {
    color: Colors.success[500],
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});