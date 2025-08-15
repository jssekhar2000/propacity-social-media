import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Sparkles } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

const { width } = Dimensions.get('window');

interface Story {
  id: number;
  username: string;
  avatar: string;
  hasUnviewed: boolean;
  isLive?: boolean;
}

export default function StoriesBar() {
  const { colors } = useThemeStore();
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  
  // Animation values
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Mock stories data
  const stories: Story[] = [
    { id: 1, username: 'Your Story', avatar: 'https://picsum.photos/60/60?random=1', hasUnviewed: false },
    { id: 2, username: 'john_doe', avatar: 'https://picsum.photos/60/60?random=2', hasUnviewed: true, isLive: true },
    { id: 3, username: 'jane_smith', avatar: 'https://picsum.photos/60/60?random=3', hasUnviewed: true },
    { id: 4, username: 'mike_wilson', avatar: 'https://picsum.photos/60/60?random=4', hasUnviewed: false },
    { id: 5, username: 'sarah_jones', avatar: 'https://picsum.photos/60/60?random=5', hasUnviewed: true },
    { id: 6, username: 'alex_brown', avatar: 'https://picsum.photos/60/60?random=6', hasUnviewed: false },
    { id: 7, username: 'emma_davis', avatar: 'https://picsum.photos/60/60?random=7', hasUnviewed: true, isLive: true },
    { id: 8, username: 'david_miller', avatar: 'https://picsum.photos/60/60?random=8', hasUnviewed: false },
  ];

  useEffect(() => {
    // Pulse animation for live stories
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStoryPress = (storyId: number) => {
    setSelectedStory(storyId);
    
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset selection after animation
    setTimeout(() => {
      setSelectedStory(null);
    }, 200);
  };

  const renderStoryItem = (story: Story, index: number) => {
    const isSelected = selectedStory === story.id;
    const isFirst = index === 0;

    return (
      <TouchableOpacity
        key={story.id}
        style={styles.storyItem}
        onPress={() => handleStoryPress(story.id)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.storyContainer,
            {
              transform: [
                { scale: isSelected ? scaleAnim : 1 },
                { scale: story.isLive ? pulseAnim : 1 },
              ],
            },
          ]}
        >
          {/* Story ring */}
          <LinearGradient
            colors={
              isFirst
                ? ['#6366F1', '#8B5CF6', '#EC4899']
                : story.hasUnviewed
                ? ['#FF6B6B', '#4ECDC4', '#45B7D1']
                : ['#E5E7EB', '#D1D5DB', '#9CA3AF']
            }
            style={styles.storyRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.storyAvatar, { backgroundColor: colors.surface }]}>
              <Image source={{ uri: story.avatar }} style={styles.avatar} />
              
              {/* Add story icon for first item */}
              {isFirst && (
                <View style={[styles.addStoryIcon, { backgroundColor: colors.primary }]}>
                  <Plus size={16} color="#FFFFFF" />
                </View>
              )}
              
              {/* Live indicator */}
              {story.isLive && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>
          </LinearGradient>
          
          {/* Username */}
          <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
            {story.username}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Stories
        </Text>
        <TouchableOpacity style={styles.watchAllButton}>
          <Sparkles size={16} color={colors.primary} />
          <Text style={[styles.watchAllText, { color: colors.primary }]}>
            Watch All
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollAnim } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {stories.map((story, index) => renderStoryItem(story, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  watchAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  watchAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  storyContainer: {
    alignItems: 'center',
    gap: 6,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  liveIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  username: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 70,
  },
});

