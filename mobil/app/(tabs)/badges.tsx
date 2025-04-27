import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { badgeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import BadgeCard from '@/components/BadgeCard';
import { Award } from 'lucide-react-native';

export default function BadgesScreen() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await badgeApi.getBadges();
      setBadges(response);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to load badges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBadges();
    setRefreshing(false);
  };

  const navigateToBadgeDetail = (badgeId: number) => {
    router.push(`/(tabs)/badges/${badgeId}`);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.emptyText}>Loading badges...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Award size={48} color={Colors.neutral[400]} />
        <Text style={styles.emptyText}>No badges earned yet</Text>
        <Text style={styles.emptySubtext}>
          Complete activities and routes to earn badges
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.headerTitle}>Your Badges</Text>
        <Text style={styles.headerSubtitle}>Collect badges as you complete activities</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Badges" />

      <FlatList
        data={badges}
        renderItem={({ item }) => (
          <BadgeCard
            badge={item.badge}
            earnedAt={item.earned_at}
            onPress={() => navigateToBadgeDetail(item.badge.id)}
          />
        )}
        keyExtractor={(item) => item.badge.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 60,
  },
  listHeader: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginTop: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error[500],
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});