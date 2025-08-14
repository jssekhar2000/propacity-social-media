import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

const demoNotifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'liked your post',
    time: '2m',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'commented on your post: "Great shot! 📸"',
    time: '5m',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'started following you',
    time: '1h',
    read: true,
  },
  {
    id: 4,
    type: 'mention',
    user: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'mentioned you in a comment',
    time: '2h',
    read: true,
  },
  {
    id: 5,
    type: 'like',
    user: {
      name: 'Lisa Park',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'and 12 others liked your post',
    time: '3h',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: true,
  },
  {
    id: 6,
    type: 'follow',
    user: {
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'started following you',
    time: '1d',
    read: true,
  },
];

export default function NotificationsScreen() {
  const { colors } = useThemeStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color="#FF3B30" fill="#FF3B30" strokeWidth={2} />;
      case 'comment':
        return <MessageCircle size={16} color="#34C759" strokeWidth={2} />;
      case 'follow':
        return <UserPlus size={16} color="#007AFF" strokeWidth={2} />;
      case 'mention':
        return <AtSign size={16} color="#FF9500" strokeWidth={2} />;
      default:
        return <Heart size={16} color="#8E8E93" strokeWidth={2} />;
    }
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        !item.read && { backgroundColor: `${colors.primary}08` }
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.iconBadge}>
            {getNotificationIcon(item.type)}
          </View>
        </View>
        
        <View style={styles.textContent}>
          <Text style={[styles.notificationText, { color: colors.text }]}>
            <Text style={styles.userName}>{item.user.name}</Text>
            {' '}
            <Text style={{ color: colors.textSecondary }}>{item.message}</Text>
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
        </View>
        
        {item.postImage && (
          <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
        )}
        
        {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity>
          <Text style={[styles.markAllRead, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={demoNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  markAllRead: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  notificationItem: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  textContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
  },
  timeText: {
    fontSize: 13,
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginLeft: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});