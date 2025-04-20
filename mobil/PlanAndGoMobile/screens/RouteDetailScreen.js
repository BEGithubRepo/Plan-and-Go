import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  Button 
} from 'react-native';
import MapPreview from '../components/MapPreview';
import { RouteService } from '../services/api';

export default function RouteDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [routeDetail, setRouteDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const { data } = await RouteService.getRoute(id);
        setRouteDetail(data);
      } catch (error) {
        console.error('Rota detayları yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{routeDetail.title}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Başlangıç:</Text>
        <Text style={styles.value}>{routeDetail.start_point}</Text>

        <Text style={styles.label}>Varış:</Text>
        <Text style={styles.value}>{routeDetail.destination}</Text>

        <Text style={styles.label}>Tarih Aralığı:</Text>
        <Text style={styles.value}>
          {new Date(routeDetail.start_date).toLocaleDateString()} - 
          {new Date(routeDetail.end_date).toLocaleDateString()}
        </Text>
      </View>

      <MapPreview 
        startPoint={routeDetail.start_point_coords}
        destination={routeDetail.destination_coords}
        waypoints={routeDetail.waypoints}
        interactive={false}
        style={styles.map}
      />

      <Button
        title="Düzenle"
        onPress={() => 
          navigation.navigate('RouteEdit', { id, initialData: routeDetail })
        }
      />
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  infoContainer: {
    marginBottom: 20
  },
  label: {
    fontWeight: '600',
    marginTop: 10
  },
  value: {
    color: '#666',
    marginBottom: 5
  },
  map: {
    height: 300,
    marginVertical: 15
  }
};