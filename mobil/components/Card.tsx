import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle 
} from 'react-native';
import Colors from '../constants/Colors';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

const Card: React.FC<CardProps> = ({ title, children, onPress, style }) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </CardContainer>
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
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 12,
  },
});

export default Card;