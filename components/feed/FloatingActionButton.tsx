import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Plus, Edit3 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Edit3 size={24} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
