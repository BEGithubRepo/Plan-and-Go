import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightElement 
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft color={Colors.neutral[800]} size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightElement && (
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {},
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
});

export default Header;