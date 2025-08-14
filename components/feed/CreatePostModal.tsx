import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  MapPin, 
  Hash, 
  Sparkles,
  Type,
  List,
  Quote,
  Smile,
  Camera,
  ImagePlus,
  Mic,
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost } from '@/types/api';
import AIContentEnhancer from './AIContentEnhancer';
import HashtagSuggestions from './HashtagSuggestions';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PostStep {
  id: number;
  title: string;
  description: string;
}

const POST_STEPS: PostStep[] = [
  { id: 1, title: 'Content', description: 'Write your post' },
  { id: 2, title: 'Media', description: 'Add images' },
  { id: 3, title: 'Enhance', description: 'Add tags & location' },
  { id: 4, title: 'Review', description: 'Preview & publish' },
];

const AI_SUGGESTIONS = [
  "Share your thoughts on today's events!",
  "What's the highlight of your day?",
  "Tell us about your latest adventure!",
  "Share a moment that made you smile today.",
  "What are you grateful for right now?",
  "Share a tip or advice with the community!",
  "What's your current mood? Express it!",
  "Share something you learned today.",
];

export default function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const { colors } = useThemeStore();
  
  const FORMATTING_OPTIONS = [
    { id: 'bold', icon: Type, label: 'Bold' },
    { id: 'italic', icon: Type, label: 'Italic' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'quote', icon: Quote, label: 'Quote' },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [appliedFormatting, setAppliedFormatting] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const inputRef = useRef<TextInput>(null);
  const { user: currentUser } = useAuthStore();
  const { addPost } = useSocialStore();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (postContent.trim() || postTitle.trim() || selectedImages.length > 0) {
      Alert.alert(
        'Discard Post?',
        'You have unsaved changes. Are you sure you want to discard this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            }
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setPostContent('');
    setPostTitle('');
    setSelectedImages([]);
    setTags([]);
    setLocation('');
    setAppliedFormatting([]);
    setNewTag('');
  };

  const handleAddImage = () => {
    // Simulate image selection
    const newImage = `https://picsum.photos/400/300?random=${Date.now()}`;
    setSelectedImages([...selectedImages, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAISuggestion = (suggestion: string) => {
    setPostContent(suggestion);
    setShowAISuggestions(false);
  };

  const handleAIEnhancement = (enhancedContent: string) => {
    setPostContent(enhancedContent);
  };

  const handleAddHashtag = (hashtag: string) => {
    if (!tags.includes(hashtag)) {
      setTags([...tags, hashtag]);
    }
  };

  const handleFormatting = (format: string) => {
    if (appliedFormatting.includes(format)) {
      setAppliedFormatting(appliedFormatting.filter(f => f !== format));
    } else {
      setAppliedFormatting([...appliedFormatting, format]);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please log in to create posts.');
      return;
    }

    if (!postContent.trim() && !postTitle.trim()) {
      Alert.alert('Error', 'Please add some content to your post.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost: Post = {
        id: Date.now(),
        userId: currentUser.id,
        title: postTitle.trim() || 'New Post',
        body: postContent.trim(),
        image: selectedImages[0],
        tags: tags,
        location: location,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        user: currentUser,
      };

      addPost(newPost);
      Alert.alert('Success', 'Your post has been published!');
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {POST_STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            {
              backgroundColor: currentStep >= step.id ? colors.primary : colors.border,
              borderColor: currentStep === step.id ? colors.primary : colors.border,
            }
          ]}>
            {currentStep > step.id ? (
              <Check size={16} color="#FFFFFF" />
            ) : (
              <Text style={[styles.stepNumber, { color: currentStep >= step.id ? '#FFFFFF' : colors.textSecondary }]}>
                {step.id}
              </Text>
            )}
          </View>
          <Text style={[styles.stepTitle, { color: currentStep >= step.id ? colors.text : colors.textSecondary }]}>
            {step.title}
          </Text>
          {index < POST_STEPS.length - 1 && (
            <View style={[styles.stepLine, { backgroundColor: currentStep > step.id ? colors.primary : colors.border }]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderContentStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.titleInput, { 
            color: colors.text, 
            borderColor: colors.border,
            backgroundColor: colors.surface 
          }]}
          placeholder="Post title (optional)"
          placeholderTextColor={colors.textSecondary}
          value={postTitle}
          onChangeText={setPostTitle}
          multiline
        />
        
        <TextInput
          style={[styles.contentInput, { 
            color: colors.text, 
            borderColor: colors.border,
            backgroundColor: colors.surface 
          }]}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.textSecondary}
          value={postContent}
          onChangeText={setPostContent}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* AI Suggestions */}
      <TouchableOpacity
        style={[styles.aiSuggestionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowAISuggestions(!showAISuggestions)}
      >
        <Sparkles size={16} color={colors.primary} />
        <Text style={[styles.aiSuggestionText, { color: colors.text }]}>
          Get AI Suggestions
        </Text>
      </TouchableOpacity>

      {showAISuggestions && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {AI_SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleAISuggestion(suggestion)}
            >
              <Text style={[styles.suggestionText, { color: colors.text }]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* AI Content Enhancement */}
      <AIContentEnhancer
        content={postContent}
        onEnhance={handleAIEnhancement}
      />

      {/* Formatting Options */}
      <View style={styles.formattingSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Formatting Options
        </Text>
        <View style={styles.formattingButtons}>
          {FORMATTING_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.formattingButton,
                  {
                    backgroundColor: appliedFormatting.includes(option.id) ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => handleFormatting(option.id)}
              >
                <IconComponent 
                  size={16} 
                  color={appliedFormatting.includes(option.id) ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.formattingButtonText,
                  { color: appliedFormatting.includes(option.id) ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderMediaStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Add Images to Your Post
      </Text>
      
      <View style={styles.mediaOptions}>
        <TouchableOpacity
          style={[styles.mediaOption, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleAddImage}
        >
          <Camera size={24} color={colors.primary} />
          <Text style={[styles.mediaOptionText, { color: colors.text }]}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mediaOption, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleAddImage}
        >
          <ImagePlus size={24} color={colors.primary} />
          <Text style={[styles.mediaOptionText, { color: colors.text }]}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.selectedImages}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Selected Images ({selectedImages.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderEnhanceStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Enhance Your Post
      </Text>

      {/* Hashtag Suggestions */}
      <HashtagSuggestions
        content={postContent}
        onAddHashtag={handleAddHashtag}
        selectedHashtags={tags}
      />

      {/* Tags */}
      <View style={styles.tagsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tags
        </Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[styles.tagInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.surface 
            }]}
            placeholder="Add a tag"
            placeholderTextColor={colors.textSecondary}
            value={newTag}
            onChangeText={setNewTag}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity
            style={[styles.addTagButton, { backgroundColor: colors.primary }]}
            onPress={handleAddTag}
          >
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {tags.length > 0 && (
          <View style={styles.tagsList}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tagChip, { backgroundColor: colors.primary }]}
                onPress={() => handleRemoveTag(tag)}
              >
                <Hash size={12} color="#FFFFFF" />
                <Text style={styles.tagText}>{tag}</Text>
                <X size={12} color="#FFFFFF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Location (Optional)
        </Text>
        <View style={styles.locationInputContainer}>
          <MapPin size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.locationInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.surface 
            }]}
            placeholder="Add location"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Review Your Post
      </Text>
      
      <View style={[styles.previewContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.previewHeader}>
          <Image
            source={{ uri: currentUser?.avatar || `https://picsum.photos/40/40?random=${currentUser?.id}` }}
            style={styles.previewAvatar}
          />
          <View style={styles.previewUserInfo}>
            <Text style={[styles.previewUsername, { color: colors.text }]}>
              {currentUser?.name || 'User'}
            </Text>
            <Text style={[styles.previewTime, { color: colors.textSecondary }]}>
              Just now
            </Text>
          </View>
        </View>
        
        {postTitle && (
          <Text style={[styles.previewTitle, { color: colors.text }]}>
            {postTitle}
          </Text>
        )}
        
        {postContent && (
          <Text style={[styles.previewContent, { color: colors.text }]}>
            {postContent}
          </Text>
        )}
        
        {selectedImages.length > 0 && (
          <Image source={{ uri: selectedImages[0] }} style={styles.previewImage} />
        )}
        
        {tags.length > 0 && (
          <View style={styles.previewTags}>
            {tags.map((tag, index) => (
              <View key={index} style={[styles.previewTag, { backgroundColor: colors.primary }]}>
                <Text style={[styles.previewTagText, { color: '#FFFFFF' }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {location && (
          <View style={styles.previewLocation}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={[styles.previewLocationText, { color: colors.textSecondary }]}>
              {location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderContentStep();
      case 2:
        return renderMediaStep();
      case 3:
        return renderEnhanceStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
          <TouchableOpacity
            style={[
              styles.publishButton,
              { 
                backgroundColor: (postContent.trim() || postTitle.trim()) ? colors.primary : colors.border,
                opacity: (postContent.trim() || postTitle.trim()) && !isSubmitting ? 1 : 0.5,
              }
            ]}
            onPress={currentStep === 4 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : currentStep === 4 ? (
              <Text style={styles.publishButtonText}>Publish</Text>
            ) : (
              <ArrowRight size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Navigation */}
        {currentStep > 1 && (
          <View style={[styles.navigation, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handlePrevious}
            >
              <ArrowLeft size={20} color={colors.text} />
              <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stepContent: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    gap: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  aiSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  aiSuggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  formattingSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  formattingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formattingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  formattingButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  mediaOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedImages: {
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsSection: {
    gap: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  addTagButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  locationContainer: {
    gap: 12,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  previewContainer: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  previewUserInfo: {
    flex: 1,
  },
  previewUsername: {
    fontSize: 16,
    fontWeight: '600',
  },
  previewTime: {
    fontSize: 14,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  previewContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  previewTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewLocationText: {
    fontSize: 14,
  },
  navigation: {
    padding: 16,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
