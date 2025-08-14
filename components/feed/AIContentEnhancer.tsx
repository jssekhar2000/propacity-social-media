import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, Zap, TrendingUp, Target, Lightbulb } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface AIContentEnhancerProps {
  content: string;
  onEnhance: (enhancedContent: string) => void;
}

export default function AIContentEnhancer({ content, onEnhance }: AIContentEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null);
  const { colors } = useThemeStore();

  const enhancementSuggestions = [
    {
      id: 'improve',
      title: 'Improve Writing',
      description: 'Enhance grammar, style, and clarity',
      action: 'Improve',
    },
    {
      id: 'expand',
      title: 'Expand Content',
      description: 'Add more details and context',
      action: 'Expand',
    },
    {
      id: 'optimize',
      title: 'Optimize for Engagement',
      description: 'Make it more engaging and shareable',
      action: 'Optimize',
    },
    {
      id: 'creative',
      title: 'Creative Rewrite',
      description: 'Rewrite with creative flair',
      action: 'Rewrite',
    },
  ];

  const handleEnhancement = async (enhancement: any) => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    setSelectedEnhancement(enhancement.id);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      let enhancedContent = content;

      switch (enhancement.id) {
        case 'improve':
          enhancedContent = improveWriting(content);
          break;
        case 'expand':
          enhancedContent = expandContent(content);
          break;
        case 'optimize':
          enhancedContent = optimizeForEngagement(content);
          break;
        case 'creative':
          enhancedContent = creativeRewrite(content);
          break;
      }

      onEnhance(enhancedContent);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
      setSelectedEnhancement(null);
    }
  };

  const improveWriting = (text: string): string => {
    // Simulate AI writing improvement
    return text
      .replace(/\b(i)\b/g, 'I')
      .replace(/\b(im)\b/g, "I'm")
      .replace(/\b(ur)\b/g, 'your')
      .replace(/\b(u)\b/g, 'you')
      .replace(/\b(2)\b/g, 'to')
      .replace(/\b(4)\b/g, 'for')
      .replace(/\b(gr8)\b/g, 'great')
      .replace(/\b(awesome)\b/gi, 'amazing')
      .replace(/\b(good)\b/gi, 'excellent')
      .replace(/\b(nice)\b/gi, 'wonderful');
  };

  const expandContent = (text: string): string => {
    // Simulate AI content expansion
    const expansions = [
      'This is truly remarkable and worth sharing with everyone!',
      'I can\'t help but feel excited about this amazing experience.',
      'It\'s moments like these that make life so special and meaningful.',
      'I hope this inspires others to discover similar joy in their own lives.',
      'What an incredible journey this has been - full of learning and growth!',
    ];

    const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)];
    return `${text}\n\n${randomExpansion}`;
  };

  const optimizeForEngagement = (text: string): string => {
    // Simulate AI engagement optimization
    const engagementPhrases = [
      'What do you think about this?',
      'I\'d love to hear your thoughts!',
      'Has anyone else experienced something similar?',
      'Share your story in the comments below!',
      'Let\'s discuss this together!',
    ];

    const randomPhrase = engagementPhrases[Math.floor(Math.random() * engagementPhrases.length)];
    return `${text}\n\n${randomPhrase}`;
  };

  const creativeRewrite = (text: string): string => {
    // Simulate AI creative rewriting
    const creativeTemplates = [
      `✨ ${text} ✨`,
      `🌟 ${text} 🌟`,
      `💫 ${text} 💫`,
      `🎉 ${text} 🎉`,
      `🔥 ${text} 🔥`,
    ];

    return creativeTemplates[Math.floor(Math.random() * creativeTemplates.length)];
  };

  if (!content.trim()) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Sparkles size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          AI Content Enhancement
        </Text>
      </View>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Let AI help you create better content
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
        {enhancementSuggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[
              styles.suggestionCard,
              {
                backgroundColor: colors.background,
                borderColor: selectedEnhancement === suggestion.id ? colors.primary : colors.border,
                opacity: isEnhancing && selectedEnhancement !== suggestion.id ? 0.5 : 1,
              }
            ]}
            onPress={() => handleEnhancement(suggestion)}
            disabled={isEnhancing}
          >
            {isEnhancing && selectedEnhancement === suggestion.id ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Sparkles size={20} color={colors.primary} />
            )}
            
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>
              {suggestion.title}
            </Text>
            
            <Text style={[styles.suggestionDescription, { color: colors.textSecondary }]}>
              {suggestion.description}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={() => handleEnhancement(suggestion)}
              disabled={isEnhancing}
            >
              <Text style={styles.actionButtonText}>
                {suggestion.action}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isEnhancing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.processingText, { color: colors.textSecondary }]}>
            AI is enhancing your content...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  suggestionsContainer: {
    marginBottom: 8,
  },
  suggestionCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  suggestionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  processingText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

