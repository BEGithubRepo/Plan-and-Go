import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Map, Calendar } from 'lucide-react-native';
import Colors from '../constants/Colors';

type WaypointType = {
  id: number;
  name: string;
  order: number;
  arrival_time: string | null;
  latitude: number;
  longitude: number;
};

type RouteProps = {
  route: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    is_shared: boolean;
    waypoints: WaypointType[];
    qr_code: string;
  };
  onPress: () => void;
};

const RouteCard: React.FC<RouteProps> = ({ route, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.title}</Text>
        {route.is_shared && (
          <View style={styles.sharedBadge}>
            <Text style={styles.sharedText}>Shared</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Calendar size={18} color={Colors.primary[700]} />
          <Text style={styles.infoText}>
            {formatDate(route.start_date)} - {formatDate(route.end_date)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Map size={18} color={Colors.primary[700]} />
          <Text style={styles.infoText}>
            {route.waypoints.length} waypoints
          </Text>
        </View>
      </View>
      
      {route.waypoints.length > 0 && (
        <View style={styles.waypointsContainer}>
          <Text style={styles.waypointsTitle}>Waypoints:</Text>
          {route.waypoints.slice(0, 2).map((waypoint) => (
            <Text key={waypoint.id} style={styles.waypointText}>
              {waypoint.order}. {waypoint.name}
            </Text>
          ))}
          {route.waypoints.length > 2 && (
            <Text style={styles.moreWaypoints}>
              +{route.waypoints.length - 2} more...
            </Text>
          )}
        </View>
      )}
      
      <Image source={{ uri: route.qr_code }} style={styles.qrCode} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    flex: 1,
  },
  sharedBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sharedText: {
    color: Colors.primary[700],
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.neutral[700],
  },
  waypointsContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: Colors.neutral[50],
    borderRadius: 8,
  },
  waypointsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: 6,
  },
  waypointText: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  moreWaypoints: {
    fontSize: 12,
    color: Colors.primary[600],
    marginTop: 4,
  },
  qrCode: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginTop: 8,
  },
});

export default RouteCard;