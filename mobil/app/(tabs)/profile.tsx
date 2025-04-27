import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi, badgeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Award, Settings, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, badgesResponse] = await Promise.all([
        profileApi.getProfile(),
        badgeApi.getBadges(),
      ]);
      
      setProfile(profileResponse);
      setRecentBadges(badgesResponse.slice(0, 3)); // Get only first 3 badges
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Profile" 
        rightElement={
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={Colors.neutral[700]} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image 
            source={{ 
              uri: profile?.avatar_url 
                ? `http://127.0.0.1:8000${profile.avatar_url}` 
                : 'https://via.placeholder.com/150'
            }} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{profile?.user || 'User'}</Text>
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{recentBadges.length}</Text>
            <Text style={styles.statsLabel}>Badges</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>0</Text>
            <Text style={styles.statsLabel}>Routes</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          
          {recentBadges.length > 0 ? (
            <View style={styles.badgesGrid}>
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
            <View style={styles.emptyBadges}>
              <Award size={30} color={Colors.neutral[400]} />
              <Text style={styles.emptyText}>No badges earned yet</Text>
            </View>
          )}
          
          <Button
            title="View All Badges"
            onPress={() => router.push('/(tabs)/badges')}
            type="outline"
            style={styles.viewAllButton}
          />
        </View>
        
        <Card>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{profile?.user || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoValue}>{profile?.bio || 'No bio added'}</Text>
          </View>
        </Card>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          type="outline"
          style={styles.logoutButtonLarge}
        />
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
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral[200],
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  bio: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  statsItem: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[700],
    fontFamily: 'Inter_700Bold',
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  statsDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.neutral[300],
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  emptyBadges: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  viewAllButton: {
    marginTop: 8,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: 4,
    fontFamily: 'Inter_500Medium',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.neutral[800],
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonLarge: {
    marginTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral[600],
    fontFamily: 'Inter_400Regular',
  },
});