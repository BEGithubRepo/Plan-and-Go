import MapView, { Marker, Polyline } from 'react-native-maps';

export default function MapPreview({ route }) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: route.start_point.lat,
        longitude: route.start_point.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker coordinate={route.start_point} title="Başlangıç" />
      <Marker coordinate={route.destination} title="Varış" />
      
      {route.waypoints.map((wp, index) => (
        <Marker key={index} coordinate={wp.coords} title={wp.name} />
      ))}

      <Polyline
        coordinates={[route.start_point, ...route.waypoints.map(wp => wp.coords), route.destination]}
        strokeColor="#000"
        strokeWidth={2}
      />
    </MapView>
  );
}