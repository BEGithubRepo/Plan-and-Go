import { FlatList } from 'react-native';

export default function WaypointList({ waypoints, onAdd, onRemove }) {
  return (
    <View>
      <Button title="Durak Ekle" onPress={() => onAdd({ name: '', coords: null })} />
      
      <FlatList
        data={waypoints}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TextInput
              placeholder="Durak Adı"
              value={item.name}
              onChangeText={(text) => updateWaypoint(index, 'name', text)}
            />
            
            <MapPinPicker 
              onSelectLocation={(coords) => updateWaypoint(index, 'coords', coords)}
            />

            <Button title="Sil" onPress={() => onRemove(index)} />
          </View>
        )}
      />
    </View>
  );
}