import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { routeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import RouteCard from '@/components/RouteCard';
import Button from '@/components/Button';
import { CirclePlus as PlusCircle, MapPin } from 'lucide-react-native';

export default function RoutesScreen() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routeApi.getRoutes();
      setRoutes(response);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoutes();
    setRefreshing(false);
  };

  const navigateToRouteDetail = (routeId: number) => {
    router.push(`/(tabs)/routes/${routeId}`);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.emptyText}>Loading routes...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Try Again" onPress={fetchRoutes} type="outline" style={styles.retryButton} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MapPin size={48} color={Colors.neutral[400]} />
        <Text style={styles.emptyText}>No routes found</Text>
        <Text style={styles.emptySubtext}>Create your first route to start planning</Text>
        <Button 
          title="Create Route" 
          onPress={() => router.push('/(tabs)/routes/create')} 
          style={styles.createButton}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.headerTitle}>Your Routes</Text>
        <Text style={styles.headerSubtitle}>Plan, share and track your journeys</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Routes" 
        rightElement={
          <Button 
            title="New Route" 
            onPress={() => router.push('/(tabs)/routes/create')} 
            style={styles.newButton}
            textStyle={styles.newButtonText}
          />
        }
      />

      <FlatList
        data={routes}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            onPress={() => navigateToRouteDetail(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 16,
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
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    marginTop: 16,
  },
  createButton: {
    marginTop: 24,
  },
  newButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary[500],
  },
  newButtonText: {
    fontSize: 14,
  },
});