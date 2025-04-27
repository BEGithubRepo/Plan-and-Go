import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { badgeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Calendar, Trophy } from 'lucide-react-native';

export default function BadgeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [badgeDetail, setBadgeDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBadgeDetail(parseInt(id));
    }
  }, [id]);

  const fetchBadgeDetail = async (badgeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await badgeApi.getBadgeDetail(badgeId);
      setBadgeDetail(response);
    } catch (err) {
      console.error('Error fetching badge detail:', err);
      setError('Failed to load badge details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Badge Details" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading badge details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Badge Details" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!badgeDetail) {
    return (
      <View style={styles.container}>
        <Header title="Badge Details" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Badge not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Badge Details" showBackButton />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badgeImageContainer}>
          <Image 
            source={{ uri: badgeDetail.badge.image }} 
            style={styles.badgeImage}
          />
        </View>
        
        <Text style={styles.badgeName}>{badgeDetail.badge.name}</Text>
        
        <Card>
          <Text style={styles.sectionTitle}>About this Badge</Text>
          <Text style={styles.description}>{badgeDetail.badge.description}</Text>
        </Card>
        
        <Card>
          <Text style={styles.sectionTitle}>Achievement Details</Text>
          
          <View style={styles.detailRow}>
            <Trophy size={20} color={Colors.primary[700]} />
            <Text style={styles.detailText}>Earned on {formatDate(badgeDetail.earned_at)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={20} color={Colors.primary[700]} />
            <Text style={styles.detailText}>Created on {formatDate(badgeDetail.badge.created)}</Text>
          </View>
        </Card>
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
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badgeImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  badgeImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary[50],
  },
  badgeName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_700Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.neutral[800],
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral[600],
    fontFamily: 'Inter_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error[500],
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});