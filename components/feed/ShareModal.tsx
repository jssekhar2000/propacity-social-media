import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Copy, 
  Link,
  Mail,
  MessageSquare
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost, ShareData } from '@/types/api';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post | DummyPost;
  user?: any;
}

interface ShareOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  platform: ShareData['platform'];
}

export default function ShareModal({ visible, onClose, post, user }: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { sharePost } = useSocialStore();

  const shareOptions: ShareOption[] = [
    {
      id: 'instagram',
      title: 'Instagram',
      icon: <Instagram size={24} color="#E4405F" />,
      color: '#E4405F',
      platform: 'instagram',
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: <Facebook size={24} color="#1877F2" />,
      color: '#1877F2',
      platform: 'facebook',
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: <Twitter size={24} color="#1DA1F2" />,
      color: '#1DA1F2',
      platform: 'twitter',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: <MessageCircle size={24} color="#25D366" />,
      color: '#25D366',
      platform: 'whatsapp',
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: <MessageSquare size={24} color="#0088CC" />,
      color: '#0088CC',
      platform: 'copy',
    },
    {
      id: 'email',
      title: 'Email',
      icon: <Mail size={24} color="#EA4335" />,
      color: '#EA4335',
      platform: 'copy',
    },
    {
      id: 'copy',
      title: 'Copy Link',
      icon: <Copy size={24} color="#8E8E93" />,
      color: '#8E8E93',
      platform: 'copy',
    },
  ];

  const handleShare = async (option: ShareOption) => {
    if (!currentUser) {
      Alert.alert('Error', 'Please log in to share posts.');
      return;
    }

    setIsSharing(true);
    try {
      const shareData: ShareData = {
        postId: post.id,
        userId: currentUser.id,
        platform: option.platform,
      };

      const success = await sharePost(shareData);
      
      if (success) {
        // Handle platform-specific sharing
        if (option.platform === 'copy') {
          const postUrl = `https://propacity.app/post/${post.id}`;
          if (Platform.OS === 'ios') {
            await Share.share({
              message: `${post.title}\n\n${post.body}\n\n${postUrl}`,
              url: postUrl,
            });
          } else {
            await Share.share({
              message: `${post.title}\n\n${post.body}\n\n${postUrl}`,
            });
          }
        } else {
          // Simulate platform sharing
          const platformNames = {
            instagram: 'Instagram',
            facebook: 'Facebook',
            twitter: 'Twitter',
            whatsapp: 'WhatsApp',
          };
          
          Alert.alert(
            'Shared Successfully!',
            `Post shared to ${platformNames[option.platform] || 'platform'}`
          );
        }
        
        onClose();
      } else {
        Alert.alert('Error', 'Failed to share post. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sharing the post.');
    } finally {
      setIsSharing(false);
    }
  };

  const renderShareOption = ({ item }: { item: ShareOption }) => (
    <TouchableOpacity
      style={[
        styles.shareOption,
        { borderBottomColor: colors.border }
      ]}
      onPress={() => handleShare(item)}
      disabled={isSharing}
    >
      <View style={styles.shareOptionContent}>
        <View style={[styles.shareIcon, { backgroundColor: `${item.color}15` }]}>
          {item.icon}
        </View>
        <View style={styles.shareText}>
          <Text style={[styles.shareTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.shareSubtitle, { color: colors.textSecondary }]}>
            Share to {item.title}
          </Text>
        </View>
      </View>
      <View style={[styles.shareArrow, { borderColor: colors.border }]} />
    </TouchableOpacity>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Share</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Post Preview */}
        <View style={[styles.postPreview, { borderBottomColor: colors.border }]}>
          <View style={styles.postPreviewContent}>
            <Text style={[styles.postPreviewTitle, { color: colors.text }]} numberOfLines={2}>
              {post.title}
            </Text>
            <Text style={[styles.postPreviewBody, { color: colors.textSecondary }]} numberOfLines={3}>
              {post.body}
            </Text>
            <View style={styles.postPreviewMeta}>
              <Text style={[styles.postPreviewMetaText, { color: colors.textSecondary }]}>
                {post.likes} likes • {post.comments} comments
              </Text>
            </View>
          </View>
        </View>

        {/* Share Options */}
        <FlatList
          data={shareOptions}
          keyExtractor={(item) => item.id}
          renderItem={renderShareOption}
          contentContainerStyle={styles.shareOptionsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Cancel Button */}
        <View style={[styles.cancelContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surface }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
  postPreview: {
    padding: 16,
    borderBottomWidth: 1,
  },
  postPreviewContent: {
    gap: 8,
  },
  postPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  postPreviewBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  postPreviewMeta: {
    marginTop: 4,
  },
  postPreviewMetaText: {
    fontSize: 12,
  },
  shareOptionsList: {
    flexGrow: 1,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  shareOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareText: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  shareSubtitle: {
    fontSize: 14,
  },
  shareArrow: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  cancelContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

