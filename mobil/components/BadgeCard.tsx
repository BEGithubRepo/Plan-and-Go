import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

type BadgeProps = {
  badge: {
    id: number;
    name: string;
    description: string;
    image: string;
    created: string;
  };
  earnedAt?: string;
  onPress: () => void;
};

const BadgeCard: React.FC<BadgeProps> = ({ badge, earnedAt, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: badge.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{badge.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {badge.description}
        </Text>
        {earnedAt && (
          <Text style={styles.earnedAt}>
            Earned: {new Date(earnedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  earnedAt: {
    fontSize: 12,
    color: Colors.primary[700],
    marginTop: 8,
  },
});

export default BadgeCard;