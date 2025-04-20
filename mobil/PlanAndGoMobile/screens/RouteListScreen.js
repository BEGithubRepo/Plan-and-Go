import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { RouteService } from '../services/api';
import ListItem from '../components/ListItem';

export default function RouteListScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoutes = async () => {
    try {
      const { data } = await RouteService.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Rotalar yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRoutes();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => 
              navigation.navigate('RouteDetail', { id: item.id })
            }
          >
            <ListItem
              title={item.title}
              subtitle={`${item.start_point} → ${item.destination}`}
              date={new Date(item.start_date).toLocaleDateString()}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz rota bulunmamaktadır</Text>
        }
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 15
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
};