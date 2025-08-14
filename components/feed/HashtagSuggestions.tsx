import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Hash, TrendingUp, Sparkles } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface HashtagSuggestionsProps {
  content: string;
  onAddHashtag: (hashtag: string) => void;
  selectedHashtags: string[];
}

export default function HashtagSuggestions({ content, onAddHashtag, selectedHashtags }: HashtagSuggestionsProps) {
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const { colors } = useThemeStore();

  useEffect(() => {
    // Simulate fetching trending hashtags
    const mockTrendingHashtags = [
      { tag: 'socialmedia', count: 15420, category: 'general' },
      { tag: 'lifestyle', count: 12340, category: 'lifestyle' },
      { tag: 'tech', count: 9870, category: 'technology' },
      { tag: 'food', count: 8760, category: 'food' },
      { tag: 'travel', count: 7650, category: 'travel' },
      { tag: 'fitness', count: 6540, category: 'health' },
      { tag: 'fashion', count: 5430, category: 'fashion' },
      { tag: 'music', count: 4320, category: 'entertainment' },
      { tag: 'photography', count: 3210, category: 'art' },
      { tag: 'motivation', count: 2100, category: 'inspiration' },
    ];

    setTrendingHashtags(mockTrendingHashtags);
  }, []);

  useEffect(() => {
    // Generate smart suggestions based on content
    const suggestions: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('amazing') || lowerContent.includes('awesome') || lowerContent.includes('great')) {
      suggestions.push('amazing', 'awesome', 'great');
    }

    if (lowerContent.includes('day') || lowerContent.includes('today') || lowerContent.includes('morning')) {
      suggestions.push('day', 'today', 'morning');
    }

    if (lowerContent.includes('love') || lowerContent.includes('happy') || lowerContent.includes('joy')) {
      suggestions.push('love', 'happy', 'joy', 'blessed');
    }

    if (lowerContent.includes('work') || lowerContent.includes('job') || lowerContent.includes('career')) {
      suggestions.push('work', 'career', 'professional', 'success');
    }

    if (lowerContent.includes('food') || lowerContent.includes('eat') || lowerContent.includes('dinner')) {
      suggestions.push('food', 'foodie', 'delicious', 'yummy');
    }

    if (lowerContent.includes('travel') || lowerContent.includes('trip') || lowerContent.includes('vacation')) {
      suggestions.push('travel', 'adventure', 'explore', 'wanderlust');
    }

    if (lowerContent.includes('fitness') || lowerContent.includes('workout') || lowerContent.includes('exercise')) {
      suggestions.push('fitness', 'workout', 'healthy', 'motivation');
    }

    if (lowerContent.includes('music') || lowerContent.includes('song') || lowerContent.includes('concert')) {
      suggestions.push('music', 'song', 'concert', 'artist');
    }

    if (lowerContent.includes('photo') || lowerContent.includes('picture') || lowerContent.includes('camera')) {
      suggestions.push('photography', 'photo', 'picture', 'camera');
    }

    if (lowerContent.includes('learn') || lowerContent.includes('study') || lowerContent.includes('education')) {
      suggestions.push('learning', 'education', 'knowledge', 'growth');
    }

    // Remove duplicates and limit to 10 suggestions
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 10);
    setSmartSuggestions(uniqueSuggestions);
  }, [content]);

  const handleAddHashtag = (hashtag: string) => {
    if (!selectedHashtags.includes(hashtag)) {
      onAddHashtag(hashtag);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (!content.trim()) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Smart Suggestions
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {smartSuggestions.map((hashtag) => (
              <TouchableOpacity
                key={hashtag}
                style={[
                  styles.hashtagChip,
                  {
                    backgroundColor: selectedHashtags.includes(hashtag) ? colors.primary : colors.background,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => handleAddHashtag(hashtag)}
              >
                <Hash size={12} color={selectedHashtags.includes(hashtag) ? '#FFFFFF' : colors.primary} />
                <Text style={[
                  styles.hashtagText,
                  { color: selectedHashtags.includes(hashtag) ? '#FFFFFF' : colors.text }
                ]}>
                  {hashtag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Trending Hashtags */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Trending Now
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trendingHashtags.slice(0, 8).map((hashtag) => (
            <TouchableOpacity
              key={hashtag.tag}
              style={[
                styles.trendingChip,
                {
                  backgroundColor: selectedHashtags.includes(hashtag.tag) ? colors.primary : colors.background,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleAddHashtag(hashtag.tag)}
            >
              <View style={styles.trendingContent}>
                <View style={styles.trendingHeader}>
                  <Hash size={12} color={selectedHashtags.includes(hashtag.tag) ? '#FFFFFF' : colors.primary} />
                  <Text style={[
                    styles.trendingTag,
                    { color: selectedHashtags.includes(hashtag.tag) ? '#FFFFFF' : colors.text }
                  ]}>
                    {hashtag.tag}
                  </Text>
                </View>
                <Text style={[
                  styles.trendingCount,
                  { color: selectedHashtags.includes(hashtag.tag) ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {formatCount(hashtag.count)} posts
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Suggestions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Popular Categories
        </Text>
        <View style={styles.categoryGrid}>
          {[
            { name: 'Lifestyle', icon: '🌟' },
            { name: 'Technology', icon: '💻' },
            { name: 'Food', icon: '🍕' },
            { name: 'Travel', icon: '✈️' },
            { name: 'Fitness', icon: '💪' },
            { name: 'Fashion', icon: '👗' },
          ].map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryChip,
                { backgroundColor: colors.background, borderColor: colors.border }
              ]}
              onPress={() => handleAddHashtag(category.name.toLowerCase())}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryText, { color: colors.text }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 4,
  },
  hashtagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trendingChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 100,
  },
  trendingContent: {
    gap: 4,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingTag: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendingCount: {
    fontSize: 12,
    marginLeft: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

