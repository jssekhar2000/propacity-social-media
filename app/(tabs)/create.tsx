import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, ImagePlus } from 'lucide-react-native';
import { useCreatePost } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  
  const user = useAuthStore((state) => state.user);
  const createPostMutation = useCreatePost();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { title?: string; body?: string } = {};
    
    if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (body.length < 10) {
      newErrors.body = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    
    try {
      await createPostMutation.mutateAsync({
        title,
        body,
        userId: user.id,
      });
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => {
          setTitle('');
          setBody('');
          router.push('/(tabs)');
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const getCharacterCount = (text: string, max: number) => {
    return `${text.length}/${max}`;
  };

  const getTitleColor = () => {
    if (title.length === 0) return '#8E8E93';
    if (title.length < 5) return '#FF3B30';
    return '#34C759';
  };

  const getBodyColor = () => {
    if (body.length === 0) return '#8E8E93';
    if (body.length < 10) return '#FF3B30';
    return '#34C759';
  };

  if (createPostMutation.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Creating your post...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            style={[styles.publishButton, (!title || !body || title.length < 5 || body.length < 10) && styles.publishButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title || !body || title.length < 5 || body.length < 10}
          >
            <Send size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.publishButtonText}>Publish</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Title</Text>
              <Text style={[styles.characterCount, { color: getTitleColor() }]}>
                {getCharacterCount(title, 100)}
              </Text>
            </View>
            <TextInput
              style={[styles.titleInput, errors.title && styles.inputError]}
              value={title}
              onChangeText={(text) => {
                if (text.length <= 100) {
                  setTitle(text);
                  if (errors.title) {
                    setErrors({ ...errors, title: undefined });
                  }
                }
              }}
              placeholder="What's on your mind?"
              placeholderTextColor="#8E8E93"
              multiline
              textAlignVertical="top"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Body Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Content</Text>
              <Text style={[styles.characterCount, { color: getBodyColor() }]}>
                {getCharacterCount(body, 500)}
              </Text>
            </View>
            <TextInput
              style={[styles.bodyInput, errors.body && styles.inputError]}
              value={body}
              onChangeText={(text) => {
                if (text.length <= 500) {
                  setBody(text);
                  if (errors.body) {
                    setErrors({ ...errors, body: undefined });
                  }
                }
              }}
              placeholder="Share your thoughts with the community..."
              placeholderTextColor="#8E8E93"
              multiline
              textAlignVertical="top"
            />
            {errors.body && <Text style={styles.errorText}>{errors.body}</Text>}
          </View>

          {/* Media Options */}
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Add Media</Text>
            <TouchableOpacity style={styles.mediaButton}>
              <ImagePlus size={24} color="#007AFF" strokeWidth={2} />
              <Text style={styles.mediaButtonText}>Add Image</Text>
              <Text style={styles.comingSoonText}>(Coming Soon)</Text>
            </TouchableOpacity>
          </View>

          {/* Writing Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Writing Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Keep your title concise and engaging</Text>
              <Text style={styles.tip}>• Share personal experiences or insights</Text>
              <Text style={styles.tip}>• Ask questions to encourage discussion</Text>
              <Text style={styles.tip}>• Use clear and friendly language</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  publishButtonDisabled: {
    opacity: 0.5,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  characterCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleInput: {
    fontSize: 18,
    color: '#1C1C1E',
    lineHeight: 24,
    minHeight: 50,
  },
  bodyInput: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
    minHeight: 120,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  mediaSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    gap: 12,
  },
  mediaButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    flex: 1,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
  },
});