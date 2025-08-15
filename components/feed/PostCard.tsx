import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { 
  Heart, 
  MessageCircle, 
  Share2 as ShareIcon, 
  Bookmark,
  MoreHorizontal,
  User,
  MapPin,
  Hash
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost } from '@/types/api';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post | DummyPost;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onSave?: (postId: number) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onSave }: PostCardProps) {
  const { colors } = useThemeStore();
  const { likePost, unlikePost, savePost, unsavePost } = useSocialStore();
  const { user: currentUser } = useAuthStore();
  
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const isDummyPost = 'reactions' in post && typeof post.reactions === 'object';
  
  const postData = {
    id: post.id,
    title: post.title,
    body: post.body,
    image: post.image,
    tags: post.tags,
    location: post.location,
    likes: post.likes || (isDummyPost && post.reactions && typeof post.reactions === 'object' ? post.reactions.likes : Math.floor(Math.random() * 50) + 1),
    comments: post.comments || Math.floor(Math.random() * 20) + 1,
    shares: post.shares || Math.floor(Math.random() * 10) + 1,
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    createdAt: post.createdAt || new Date().toISOString(),
  };

  const handleLike = () => {
    if (postData.isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
      Animated.sequence([
        Animated.timing(heartScaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    onLike?.(post.id);
  };

  const handleComment = () => {
    setShowComments(true);
    onComment?.(post.id);
  };

  const handleShare = () => {
    setShowShare(true);
    onShare?.(post.id);
  };

  const handleSave = () => {
    if (postData.isSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
    onSave?.(post.id);
  };

  const handleLongPress = () => {
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
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `${postData.title}\n\n${postData.body}`,
        title: postData.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRandomUser = () => {
    const users = [
      { id: 1, name: 'Alex Johnson', username: '@alexj', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', firstName: 'Alex', lastName: 'Johnson' },
      { id: 2, name: 'Sarah Wilson', username: '@sarahw', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', firstName: 'Sarah', lastName: 'Wilson' },
      { id: 3, name: 'Mike Chen', username: '@mikec', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', firstName: 'Mike', lastName: 'Chen' },
      { id: 4, name: 'Emma Davis', username: '@emmad', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', firstName: 'Emma', lastName: 'Davis' },
    ];
    return users[Math.floor(Math.random() * users.length)];
  };

  const user = getRandomUser();

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface, borderColor: colors.border },
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar || user?.image || `https://picsum.photos/40/40?random=${user?.id || '1'}` }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={[styles.username, { color: colors.text }]}>
                {user?.name || `${user?.firstName || 'User'} ${user?.lastName || user?.id || ''}`}
              </Text>
              <Text style={[styles.userHandle, { color: colors.textSecondary }]}>
                {user?.username || '@user'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {postData.title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {postData.title}
            </Text>
          )}
          <Text style={[styles.body, { color: colors.text }]}>
            {postData.body}
          </Text>
          
          {postData.image && (
            <Image source={{ uri: postData.image }} style={styles.postImage} />
          )}
          
          {postData.tags && postData.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {postData.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primary }]}>
                  <Hash size={12} color="#FFFFFF" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {postData.tags.length > 3 && (
                <Text style={[styles.moreTags, { color: colors.textSecondary }]}>
                  +{postData.tags.length - 3} more
                </Text>
              )}
            </View>
          )}
          
          {postData.location && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                {postData.location}
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {postData.likes} likes • {postData.comments} comments • {postData.shares} shares
          </Text>
        </View>

        {/* Actions */}
        <View style={[styles.actionsContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            onLongPress={handleLongPress}
          >
            <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
              <Heart
                size={24}
                color={postData.isLiked ? '#FF3B30' : colors.textSecondary}
                fill={postData.isLiked ? '#FF3B30' : 'none'}
                strokeWidth={2}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: postData.isLiked ? '#FF3B30' : colors.textSecondary }]}>
              Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <MessageCircle size={24} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Comment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <ShareIcon size={24} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Bookmark
              size={24}
              color={postData.isSaved ? colors.primary : colors.textSecondary}
              fill={postData.isSaved ? colors.primary : 'none'}
              strokeWidth={2}
            />
            <Text style={[styles.actionText, { color: postData.isSaved ? colors.primary : colors.textSecondary }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modals */}
      <CommentModal
        visible={showComments}
        post={post}
        onClose={() => setShowComments(false)}
      />
      
      <ShareModal
        visible={showShare}
        post={post}
        onClose={() => setShowShare(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});