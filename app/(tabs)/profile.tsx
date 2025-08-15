import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  LogOut, 
  Settings, 
  Edit3, 
  BarChart3, 
  Users, 
  Grid3x3, 
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  Camera,
  Plus,
  MoreHorizontal,
  Check,
  Star,
  MapPin,
  Globe,
  Calendar,
  Link
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

const demoPostImages = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const demoStories = [
  { id: 1, title: 'Travel', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, title: 'Food', image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, title: 'Nature', image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, title: 'Art', image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const demoHighlights = [
  { id: 1, title: 'Featured', icon: Star, color: '#FFD700' },
  { id: 2, title: 'Work', icon: BarChart3, color: '#007AFF' },
  { id: 3, title: 'Personal', icon: Heart, color: '#FF3B30' },
];

// Separate component for post image to use hooks properly
const PostImageItem = React.memo(({ item, index }: { item: string; index: number }) => {
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
        styles.postImageContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity style={styles.postImageWrapper}>
        <Image source={{ uri: item }} style={styles.postImage} />
        <View style={styles.postOverlay}>
          <View style={styles.postStats}>
            <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.postStatText}>24</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { colors } = useThemeStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: Edit3,
      title: 'Edit Profile',
      description: 'Update your personal information',
      color: '#007AFF',
      onPress: () => Alert.alert('Coming Soon', 'Edit profile feature will be available soon!'),
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'View your post engagement stats',
      color: '#34C759',
      onPress: () => router.push('/(tabs)/analytics'),
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your account settings',
      color: '#FF9500',
      onPress: () => router.push('/(tabs)/settings'),
    },
  ];

  const renderPostImage = ({ item, index }: { item: string; index: number }) => (
    <PostImageItem item={item} index={index} />
  );

  const renderStory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
        style={styles.storyGradient}
      >
        <Image source={{ uri: item.image }} style={styles.storyImage} />
      </LinearGradient>
      <Text style={styles.storyTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderHighlight = ({ item }: { item: any }) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity style={styles.highlightContainer}>
        <View style={[styles.highlightIcon, { backgroundColor: item.color }]}>
          <Icon size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.highlightTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.profileHeader}
        >
          <Animated.View 
            style={[
              styles.profileContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatar}
              />
              <View style={styles.statusIndicator} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.username || 'Alex Johnson'}</Text>
              <Text style={styles.profileUsername}>@{user?.username || 'alexjohnson'}</Text>
              <View style={styles.verifiedContainer}>
                <Check size={14} color="#007AFF" fill="#007AFF" />
                <Text style={styles.verifiedText}>Verified Creator</Text>
              </View>
            </View>

            <Text style={styles.profileBio}>
              📸 Photography enthusiast | 🌍 Travel lover | ✨ Creating memories one post at a time
            </Text>
            
            <View style={styles.profileDetails}>
              <View style={styles.detailItem}>
                <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.detailText}>San Francisco, CA</Text>
              </View>
              <View style={styles.detailItem}>
                <Globe size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.detailText}>alexjohnson.com</Text>
              </View>
              <View style={styles.detailItem}>
                <Calendar size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.detailText}>Joined March 2023</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>890</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileActionButtons}>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: isFollowing ? 'transparent' : '#FFFFFF' }]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={[styles.primaryButtonText, { color: isFollowing ? '#FFFFFF' : '#667eea' }]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <MessageCircle size={16} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <MoreHorizontal size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stories */}
        <View style={[styles.storiesContainer, { backgroundColor: colors.surface }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
            <TouchableOpacity style={styles.addStoryContainer}>
              <View style={styles.addStoryButton}>
                <Plus size={20} color={colors.primary} />
              </View>
              <Text style={[styles.addStoryText, { color: colors.textSecondary }]}>New</Text>
            </TouchableOpacity>
            {demoStories.map((item) => (
              <View key={item.id}>
                {renderStory({ item })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Highlights */}
        <View style={[styles.highlightsContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.highlightsTitle, { color: colors.text }]}>Highlights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsScroll}>
            {demoHighlights.map((item) => (
              <View key={item.id}>
                {renderHighlight({ item })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Profile Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'posts' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('posts')}
          >
            <Grid3x3 size={20} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.tabText, { color: activeTab === 'posts' ? colors.primary : colors.textSecondary }]}>
              Posts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'saved' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('saved')}
          >
            <Bookmark size={20} color={activeTab === 'saved' ? colors.primary : colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.tabText, { color: activeTab === 'saved' ? colors.primary : colors.textSecondary }]}>
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'tagged' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('tagged')}
          >
            <Users size={20} color={activeTab === 'tagged' ? colors.primary : colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.tabText, { color: activeTab === 'tagged' ? colors.primary : colors.textSecondary }]}>
              Tagged
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          <FlatList
            data={demoPostImages}
            renderItem={renderPostImage}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
          />
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
          <Text style={[styles.quickActionsTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionButtons}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickActionButton, { backgroundColor: `${item.color}15`, borderColor: colors.border }]}
                  onPress={item.onPress}
                >
                  <Icon size={24} color={item.color} strokeWidth={2} />
                  <Text style={[styles.quickActionButtonText, { color: colors.text }]}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  profileBio: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  profileDetails: {
    marginBottom: 24,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  storiesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  storiesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  addStoryContainer: {
    alignItems: 'center',
    gap: 8,
  },
  addStoryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    borderStyle: 'dashed',
  },
  addStoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  storyContainer: {
    alignItems: 'center',
    gap: 8,
  },
  storyGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  highlightsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  highlightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  highlightsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  highlightContainer: {
    alignItems: 'center',
    gap: 8,
  },
  highlightIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postsGrid: {
    padding: 16,
  },
  gridContent: {
    gap: 4,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  postImageContainer: {
    width: imageSize,
    height: imageSize,
    marginBottom: 4,
  },
  postImageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 8,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickActions: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  quickActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});