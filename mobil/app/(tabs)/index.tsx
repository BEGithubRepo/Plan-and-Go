import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Map, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { routeApi, badgeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Header from '@/components/Header';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesResponse, badgesResponse] = await Promise.all([
        routeApi.getRoutes(),
        badgeApi.getBadges(),
      ]);
      
      setRoutes(routesResponse.slice(0, 2)); // Get the most recent 2 routes
      setRecentBadges(badgesResponse.slice(0, 3)); // Get the most recent 3 badges
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Header title="Home" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Hi, {user?.username || 'Traveler'}!
          </Text>
          <Text style={styles.welcomeSubtitle}>Ready to plan your next adventure?</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Routes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/routes')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {routes.length > 0 ? (
            routes.map((route) => (
              <Card key={route.id} style={styles.routeCard}>
                <Text style={styles.routeTitle}>{route.title}</Text>
                
                <View style={styles.routeDetails}>
                  <View style={styles.routeDetail}>
                    <Calendar size={16} color={Colors.primary[700]} />
                    <Text style={styles.routeDetailText}>
                      {formatDate(route.start_date)} - {formatDate(route.end_date)}
                    </Text>
                  </View>
                  
                  <View style={styles.routeDetail}>
                    <MapPin size={16} color={Colors.primary[700]} />
                    <Text style={styles.routeDetailText}>
                      {route.waypoints.length} waypoints
                    </Text>
                  </View>
                </View>
                
                <Button
                  title="View Route"
                  onPress={() => router.push(`/(tabs)/routes/${route.id}`)}
                  type="outline"
                  style={styles.viewButton}
                />
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Map size={40} color={Colors.neutral[400]} />
              <Text style={styles.emptyStateText}>No routes yet</Text>
              <Button
                title="Create Route"
                onPress={() => router.push('/(tabs)/routes/create')}
                style={styles.createButton}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Badges</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/badges')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentBadges.length > 0 ? (
            <View style={styles.badgesContainer}>
              {recentBadges.map((badgeItem) => (
                <TouchableOpacity
                  key={badgeItem.badge.id}
                  style={styles.badgeItem}
                  onPress={() => router.push(`/(tabs)/badges/${badgeItem.badge.id}`)}
                >
                  <Image
                    source={{ uri: badgeItem.badge.image }}
                    style={styles.badgeImage}
                  />
                  <Text style={styles.badgeName} numberOfLines={1}>
                    {badgeItem.badge.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Award size={40} color={Colors.neutral[400]} />
              <Text style={styles.emptyStateText}>No badges earned yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Complete activities to earn badges
              </Text>
            </View>
          )}
        </View>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral[800],
    fontFamily: 'Inter_700Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    fontFamily: 'Inter_600SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary[600],
    fontFamily: 'Inter_500Medium',
  },
  routeCard: {
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  routeDetails: {
    marginBottom: 12,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeDetailText: {
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  viewButton: {
    marginTop: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: Colors.primary[50],
  },
  badgeName: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.neutral[700],
    fontFamily: 'Inter_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginTop: 12,
    fontFamily: 'Inter_500Medium',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  createButton: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});