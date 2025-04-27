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

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  mobile: Yup.string().required('Mobile number is required'),
});

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (values: any) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await register(values);
      if (response && response.status === 'success') {
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Register" showBackButton />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Enter your details to get started</Text>

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
          initialValues={{ username: '', email: '', password: '', mobile: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <Input
                label="Username"
                placeholder="Choose a username"
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

              <Input
                label="Password"
                placeholder="Create a password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                error={touched.password && errors.password ? errors.password : undefined}
              />

              <Input
                label="Mobile Number"
                placeholder="Enter your mobile number"
                value={values.mobile}
                onChangeText={handleChange('mobile')}
                onBlur={handleBlur('mobile')}
                keyboardType="phone-pad"
                error={touched.mobile && errors.mobile ? errors.mobile : undefined}
              />

              <Button
                title="Register"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
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
    paddingBottom: 40,
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
  registerButton: {
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