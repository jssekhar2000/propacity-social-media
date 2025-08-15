import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign, 
  MoreHorizontal,
  Check,
  Filter,
  Search
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const demoNotifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'liked your post',
    time: '2m',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: false,
    isVerified: true,
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Mike Chen',
      username: '@mikechen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'commented on your post: "Amazing shot! 📸"',
    time: '5m',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: false,
    isVerified: false,
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'started following you',
    time: '1h',
    read: true,
    isVerified: true,
  },
  {
    id: 4,
    type: 'mention',
    user: {
      name: 'Alex Rodriguez',
      username: '@alexrod',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'mentioned you in a comment',
    time: '2h',
    read: true,
    isVerified: false,
  },
  {
    id: 5,
    type: 'like',
    user: {
      name: 'Lisa Park',
      username: '@lisapark',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'and 12 others liked your post',
    time: '3h',
    postImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: true,
    isVerified: true,
  },
  {
    id: 6,
    type: 'follow',
    user: {
      name: 'David Kim',
      username: '@davidkim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'started following you',
    time: '1d',
    read: true,
    isVerified: false,
  },
  {
    id: 7,
    type: 'comment',
    user: {
      name: 'Maria Garcia',
      username: '@mariag',
      avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    message: 'commented: "Love this! ❤️"',
    time: '2d',
    postImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    read: true,
    isVerified: true,
  },
];

// Separate component for notification item to use hooks properly
const NotificationItem = React.memo(({ item, index, colors, getNotificationIcon, getNotificationColor }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.notificationItem,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.notificationContent,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          !item.read && { 
            backgroundColor: `${getNotificationColor(item.type)}08`,
            borderColor: `${getNotificationColor(item.type)}20`,
          }
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: getNotificationColor(item.type) }]}>
            {getNotificationIcon(item.type)}
          </View>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.textContent}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.user.name}
            </Text>
            <Text style={[styles.userUsername, { color: colors.textSecondary }]}>
              {item.user.username}
            </Text>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {item.time}
            </Text>
          </View>
          <Text style={[styles.notificationText, { color: colors.textSecondary }]}>
            {item.message}
          </Text>
        </View>
        
        {item.postImage && (
          <View style={styles.postThumbnailContainer}>
            <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
          </View>
        )}
        
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        {!item.read && (
          <View style={[styles.unreadDot, { backgroundColor: getNotificationColor(item.type) }]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function NotificationsScreen() {
  const { colors } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(demoNotifications.filter(n => !n.read).length);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={18} color="#FF3B30" fill="#FF3B30" strokeWidth={2} />;
      case 'comment':
        return <MessageCircle size={18} color="#34C759" strokeWidth={2} />;
      case 'follow':
        return <UserPlus size={18} color="#007AFF" strokeWidth={2} />;
      case 'mention':
        return <AtSign size={18} color="#FF9500" strokeWidth={2} />;
      default:
        return <Heart size={18} color="#8E8E93" strokeWidth={2} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return '#FF3B30';
      case 'comment':
        return '#34C759';
      case 'follow':
        return '#007AFF';
      case 'mention':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const filteredNotifications = selectedFilter === 'all' 
    ? demoNotifications 
    : demoNotifications.filter(n => n.type === selectedFilter);

  const renderNotification = ({ item, index }: { item: any; index: number }) => (
    <NotificationItem
      item={item}
      index={index}
      colors={colors}
      getNotificationIcon={getNotificationIcon}
      getNotificationColor={getNotificationColor}
    />
  );

  const renderFilterButton = (filter: string, label: string, count?: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && { 
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        { 
          color: selectedFilter === filter ? '#FFFFFF' : colors.textSecondary,
          fontWeight: selectedFilter === filter ? '600' : '500',
        }
      ]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={[
          styles.filterBadge,
          { backgroundColor: selectedFilter === filter ? '#FFFFFF' : colors.primary }
        ]}>
          <Text style={[
            styles.filterBadgeText,
            { color: selectedFilter === filter ? colors.primary : '#FFFFFF' }
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, `${colors.primary}80`]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount} new notifications
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {renderFilterButton('all', 'All', unreadCount)}
          {renderFilterButton('like', 'Likes', demoNotifications.filter(n => !n.read && n.type === 'like').length)}
          {renderFilterButton('comment', 'Comments', demoNotifications.filter(n => !n.read && n.type === 'comment').length)}
          {renderFilterButton('follow', 'Follows', demoNotifications.filter(n => !n.read && n.type === 'follow').length)}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <View style={[styles.markAllReadContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.markAllReadButton, { backgroundColor: colors.primary }]}
            onPress={() => setUnreadCount(0)}
          >
            <Check size={16} color="#FFFFFF" />
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
  separator: {
    height: 12,
  },
  notificationItem: {
    marginBottom: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  verifiedText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userUsername: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
  },
  postThumbnailContainer: {
    marginRight: 8,
  },
  postThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  moreButton: {
    padding: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markAllReadContainer: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  markAllReadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});