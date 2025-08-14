import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Bookmark,
  BookmarkCheck,
  HeartOff,
  MapPin,
  Clock
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost } from '@/types/api';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

interface PostCardProps {
  post: Post | DummyPost;
  user?: any;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onMore?: () => void;
}

export default function PostCard({ post, user }: PostCardProps) {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { 
    likePost, 
    unlikePost, 
    savePost, 
    unsavePost, 
    isPostLiked, 
    isPostSaved,
    getPostComments 
  } = useSocialStore();

  const isDummyPost = 'reactions' in post;
  const reactions = isDummyPost ? post.reactions : null;
  
  // Enhanced post data with defaults
  const postData = {
    likes: post.likes || (reactions ? reactions.likes : Math.floor(Math.random() * 50) + 1),
    comments: post.comments || Math.floor(Math.random() * 20) + 1,
    shares: post.shares || Math.floor(Math.random() * 10) + 1,
    isLiked: post.isLiked ?? isPostLiked(post.id),
    isSaved: post.isSaved ?? isPostSaved(post.id),
    createdAt: post.createdAt || new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    location: post.location,
    image: post.image,
  };

  const handleLike = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to like posts.');
      return;
    }

    if (postData.isLiked) {
      unlikePost(post.id, currentUser.id);
    } else {
      likePost(post.id, currentUser.id);
    }
  };

  const handleComment = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to comment on posts.');
      return;
    }
    setShowCommentModal(true);
  };

  const handleShare = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to share posts.');
      return;
    }
    setShowShareModal(true);
  };

  const handleSave = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to save posts.');
      return;
    }

    if (postData.isSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  };

  const handleMore = () => {
    setShowMoreOptions(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: user?.image || user?.avatar || `https://i.pravatar.cc/150?u=${post.userId}` }} 
              style={styles.avatar} 
            />
            <View style={styles.userDetails}>
              <Text style={[styles.username, { color: colors.text }]}>
                {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || `User ${post.userId}`}
              </Text>
              <View style={styles.postMeta}>
                {postData.location && (
                  <View style={styles.metaItem}>
                    <MapPin size={12} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                      {postData.location}
                    </Text>
                  </View>
                )}
                <View style={styles.metaItem}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {formatTimeAgo(postData.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleMore} style={styles.moreButton}>
            <MoreHorizontal size={20} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Image */}
        {postData.image && (
          <Image source={{ uri: postData.image }} style={styles.postImage} />
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={3}>
            {post.body}
          </Text>
          
          {isDummyPost && post.tags && post.tags.length > 0 && (
            <View style={styles.tags}>
              {post.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.stats, { borderTopColor: colors.border }]}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {formatNumber(postData.likes)} likes • {formatNumber(postData.comments)} comments • {formatNumber(postData.shares)} shares
          </Text>
        </View>

        {/* Actions */}
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLike}
            activeOpacity={0.7}
          >
            {postData.isLiked ? (
              <Heart size={24} color="#FF3B30" fill="#FF3B30" strokeWidth={2} />
            ) : (
              <Heart size={24} color={colors.textSecondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleComment}
            activeOpacity={0.7}
          >
            <MessageCircle size={24} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share size={24} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.actionSpacer} />
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            {postData.isSaved ? (
              <BookmarkCheck size={24} color={colors.primary} fill={colors.primary} strokeWidth={2} />
            ) : (
              <Bookmark size={24} color={colors.textSecondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        {/* Comments Preview */}
        {getPostComments(post.id).length > 0 && (
          <View style={[styles.commentsPreview, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowCommentModal(true)}>
              <Text style={[styles.commentsPreviewText, { color: colors.textSecondary }]}>
                View all {getPostComments(post.id).length} comments
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modals */}
      <CommentModal
        visible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        post={post}
        user={user}
      />

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
        user={user}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  stats: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 16,
  },
  actionSpacer: {
    flex: 1,
  },
  commentsPreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  commentsPreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
});