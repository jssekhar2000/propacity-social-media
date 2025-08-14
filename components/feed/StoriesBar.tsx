import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface Story {
  id: number;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

interface StoriesBarProps {
  stories: Story[];
  onStoryPress: (storyId: number) => void;
  onAddStory: () => void;
}

export default function StoriesBar({ stories, onStoryPress, onAddStory }: StoriesBarProps) {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Story Button */}
        <TouchableOpacity
          style={[styles.storyItem, { borderColor: colors.border }]}
          onPress={onAddStory}
        >
          <View style={[styles.addStoryButton, { backgroundColor: colors.primary }]}>
            <Plus size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={[styles.storyUsername, { color: colors.text }]} numberOfLines={1}>
            Add Story
          </Text>
        </TouchableOpacity>

        {/* Stories */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={[
              styles.storyItem,
              { borderColor: story.hasStory && !story.isViewed ? colors.primary : colors.border }
            ]}
            onPress={() => onStoryPress(story.id)}
          >
            <View style={[
              styles.storyAvatar,
              {
                borderColor: story.hasStory && !story.isViewed ? colors.primary : 'transparent',
                opacity: story.isViewed ? 0.6 : 1,
              }
            ]}>
              <Image source={{ uri: story.avatar }} style={styles.avatarImage} />
            </View>
            <Text style={[styles.storyUsername, { color: colors.text }]} numberOfLines={1}>
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  addStoryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  storyUsername: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

