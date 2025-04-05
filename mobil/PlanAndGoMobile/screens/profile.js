import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../App';
import axios from 'axios';

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Profil ve rozetleri çek
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get('profile/');
        setProfile(profileResponse.data);

        const badgesResponse = await axios.get('badges/');
        setBadges(badgesResponse.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {profile && (
        <>
          <Text style={styles.title}>Profil: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
        </>
      )}
      <Text style={styles.sectionTitle}>Rozetler:</Text>
      <FlatList
        data={badges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.badgeItem}>
            <Image source={{ uri: item.icon }} style={styles.badgeImage} />
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <Button title="Çıkış Yap" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, marginVertical: 10 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  badgeImage: { width: 50, height: 50, marginRight: 10 },
});