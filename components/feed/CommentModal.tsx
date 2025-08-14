import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, Heart, MoreHorizontal } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Comment, Post, DummyPost } from '@/types/api';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post | DummyPost;
  user?: any;
}

export default function CommentModal({ visible, onClose, post, user }: CommentModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { 
    getPostComments, 
    addComment, 
    likeComment, 
    unlikeComment 
  } = useSocialStore();

  const comments = getPostComments(post.id);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      addComment({
        postId: post.id,
        userId: currentUser.id,
        body: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: number) => {
    if (!currentUser) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (comment?.isLiked) {
      unlikeComment(commentId, currentUser.id);
    } else {
      likeComment(commentId, currentUser.id);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image 
        source={{ uri: item.user.avatar || `https://i.pravatar.cc/150?u=${item.user.id}` }} 
        style={styles.commentAvatar} 
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentUsername, { color: colors.text }]}>
            {item.user.name}
          </Text>
          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
        <Text style={[styles.commentBody, { color: colors.text }]}>
          {item.body}
        </Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentAction} 
            onPress={() => handleLikeComment(item.id)}
          >
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              {item.likes > 0 ? `${item.likes} like${item.likes > 1 ? 's' : ''}` : 'Like'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.commentMore}>
        <MoreHorizontal size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Comments</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyComments}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          }
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.inputContainer, { borderTopColor: colors.border }]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={[styles.input, { 
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: commentText.trim() ? colors.primary : colors.border,
                  opacity: commentText.trim() && !isSubmitting ? 1 : 0.5,
                }
              ]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || isSubmitting}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  headerSpacer: {
    width: 32,
  },
  commentsList: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
  },
  commentBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    paddingVertical: 2,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentMore: {
    padding: 4,
    marginLeft: 8,
  },
  emptyComments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

