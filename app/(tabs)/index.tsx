import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Plus, 
  Search, 
  Bell, 
  TrendingUp, 
  Sparkles,
  Filter,
  Grid3x3,
  List
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost } from '@/types/api';
import PostCard from '@/components/feed/PostCard';
import StoriesBar from '@/components/feed/StoriesBar';
import SearchBar from '@/components/feed/SearchBar';
import FloatingActionButton from '@/components/feed/FloatingActionButton';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Dummy data for demonstration
const generateDummyPosts = (startId: number, count: number): DummyPost[] => {
  const posts: DummyPost[] = [];
  const titles = [
    'Amazing Sunset at the Beach',
    'New Coffee Shop Discovery',
    'Weekend Hiking Adventure',
    'Art Gallery Opening',
    'Cooking Experiment Success',
    'City Lights at Night',
    'Morning Yoga Session',
    'Book Club Meeting',
    'Street Photography Walk',
    'Local Market Finds',
    'Sunset Yoga by the Lake',
    'New Restaurant Review',
    'Travel Photography Tips',
    'Home Garden Update',
    'Music Festival Experience'
  ];
  
  const bodies = [
    'Just captured this incredible sunset during my evening walk. The colors were absolutely breathtaking! 🌅 #sunset #beach #photography',
    'Found this amazing coffee shop downtown! The latte art is incredible and the atmosphere is perfect for working. ☕️ #coffee #work #discovery',
    'Spent the weekend exploring the mountain trails. The views were absolutely worth the climb! 🏔️ #hiking #adventure #nature',
    'Attended the opening of the new contemporary art gallery. Some really thought-provoking pieces on display! 🎨 #art #gallery #culture',
    'Tried making homemade pasta for the first time and it turned out amazing! The secret is in the dough consistency. 🍝 #cooking #pasta #homemade',
    'The city looks magical at night! Captured some amazing long exposure shots. 🌃 #city #night #photography',
    'Started my day with a peaceful yoga session. Perfect way to center yourself. 🧘‍♀️ #yoga #morning #wellness',
    'Had a great discussion about the latest book we read. Book clubs are the best! 📚 #books #discussion #community',
    'Exploring the city streets with my camera. You never know what you\'ll discover! 📸 #streetphotography #exploration',
    'Found some amazing local produce at the farmers market. Supporting local businesses! 🥬 #local #market #fresh',
    'Practicing yoga by the lake as the sun sets. Pure tranquility. 🧘‍♀️🌅 #yoga #sunset #peace',
    'Tried this new restaurant downtown. The flavors were incredible! 🍽️ #food #restaurant #review',
    'Sharing some tips I learned about travel photography. Composition is everything! 📸✈️ #photography #travel #tips',
    'My garden is thriving! The tomatoes are finally ready to harvest. 🍅 #garden #homegrown #organic',
    'Amazing experience at the music festival this weekend! The energy was electric! 🎵🎪 #music #festival #live'
  ];
  
  const images = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];
  
  const tags = [
    ['sunset', 'beach', 'photography'],
    ['coffee', 'work', 'discovery'],
    ['hiking', 'adventure', 'nature'],
    ['art', 'gallery', 'culture'],
    ['cooking', 'pasta', 'homemade'],
    ['city', 'night', 'photography'],
    ['yoga', 'morning', 'wellness'],
    ['books', 'discussion', 'community'],
    ['streetphotography', 'exploration'],
    ['local', 'market', 'fresh'],
    ['yoga', 'sunset', 'peace'],
    ['food', 'restaurant', 'review'],
    ['photography', 'travel', 'tips'],
    ['garden', 'homegrown', 'organic'],
    ['music', 'festival', 'live']
  ];
  
  const locations = [
    'Miami Beach, FL',
    'Downtown',
    'Mountain Trail',
    'Art District',
    'Home Kitchen',
    'City Center',
    'Local Park',
    'Community Center',
    'Downtown Streets',
    'Farmers Market',
    'Lakeside',
    'Restaurant District',
    'Travel Destination',
    'Backyard Garden',
    'Music Festival Grounds'
  ];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * titles.length);
    posts.push({
      id: startId + i,
      title: titles[randomIndex],
      body: bodies[randomIndex],
      userId: Math.floor(Math.random() * 5) + 1,
      tags: tags[randomIndex],
      image: images[Math.floor(Math.random() * images.length)],
      reactions: { 
        likes: Math.floor(Math.random() * 50) + 10, 
        dislikes: Math.floor(Math.random() * 5) 
      },
      comments: Math.floor(Math.random() * 20) + 1,
      shares: Math.floor(Math.random() * 10) + 1,
      likes: Math.floor(Math.random() * 50) + 10,
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: locations[randomIndex]
    });
  }
  
  return posts;
};

const dummyUsers = [
  { id: 1, firstName: 'Alex', lastName: 'Johnson', name: 'Alex Johnson', username: '@alexj', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, firstName: 'Sarah', lastName: 'Wilson', name: 'Sarah Wilson', username: '@sarahw', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, firstName: 'Mike', lastName: 'Chen', name: 'Mike Chen', username: '@mikec', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, firstName: 'Emma', lastName: 'Davis', name: 'Emma Davis', username: '@emmad', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, firstName: 'David', lastName: 'Brown', name: 'David Brown', username: '@davidb', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const HeaderSection = memo(({ 
  colors,
  fadeAnim,
  slideAnim,
  handleSearch,
  handleNotifications,
  viewMode,
  setViewMode,
  showTrending,
  setShowTrending,
  searchQuery,
  setSearchQuery,
}: any) => {
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[colors.primary, `${colors.primary}80`]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Social Feed</Text>
            <Text style={styles.headerSubtitle}>Discover amazing content</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
              <Search size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotifications}>
              <Bell size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <View style={[styles.controlsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.controlsLeft}>
          <TouchableOpacity
            style={[styles.controlButton, viewMode === 'list' && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, viewMode === 'grid' && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3x3 size={16} color={viewMode === 'grid' ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlsRight}>
          <TouchableOpacity
            style={[styles.trendingButton, showTrending && { backgroundColor: colors.primary }]}
            onPress={() => setShowTrending(!showTrending)}
          >
            <TrendingUp size={16} color={showTrending ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.trendingText, { color: showTrending ? '#FFFFFF' : colors.textSecondary }]}>
              Trending
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={[styles.storiesContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <StoriesBar />
      </View>

      {/* Search Bar */}
      {/* <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View> */}
    </Animated.View>
  );
});

export default function HomeScreen() {
  const { colors } = useThemeStore();
  const { posts, addPost } = useSocialStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showTrending, setShowTrending] = useState(false);
  const [allPosts, setAllPosts] = useState<DummyPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current; // ensure visible by default
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Initialize with first page of posts
  useEffect(() => {
    const initialPosts = generateDummyPosts(1, 10);
    setAllPosts(initialPosts);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPosts = generateDummyPosts(1, 10);
    setAllPosts(newPosts);
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  };

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nextPage = page + 1;
    const newPosts = generateDummyPosts((nextPage - 1) * 10 + 1, 10);
    
    // Simulate end of data after 5 pages
    if (nextPage >= 5) {
      setHasMore(false);
    }
    
    setAllPosts(prev => [...prev, ...newPosts]);
    setPage(nextPage);
    setLoading(false);
  };

  const handleCreatePost = () => {
    setShowCreatePostModal(true);
  };

  const handleSearch = () => {
    router.push('/(tabs)/search');
  };

  const handleNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  const renderPost = ({ item, index }: { item: Post | DummyPost; index: number }) => {
    const isDummyPost = 'reactions' in item && typeof item.reactions === 'object';
    const user = dummyUsers.find(u => u.id === item.userId) || dummyUsers[0];
    
    const postData = {
      ...item,
      likes: item.likes || (isDummyPost && item.reactions && typeof item.reactions === 'object' ? item.reactions.likes : Math.floor(Math.random() * 50) + 1),
      comments: item.comments || Math.floor(Math.random() * 20) + 1,
      shares: item.shares || Math.floor(Math.random() * 10) + 1,
      isLiked: item.isLiked || false,
      isSaved: item.isSaved || false,
      createdAt: item.createdAt || new Date().toISOString(),
    };

    return (
      <PostCard
        post={postData}
        onLike={(postId) => console.log('Liked post:', postId)}
        onComment={(postId) => console.log('Comment on post:', postId)}
        onShare={(postId) => console.log('Share post:', postId)}
        onSave={(postId) => console.log('Save post:', postId)}
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading more posts...
        </Text>
      </View>
    );
  };

  const combinedPosts = [...posts, ...allPosts];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={combinedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <HeaderSection
            colors={colors}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            handleSearch={handleSearch}
            handleNotifications={handleNotifications}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showTrending={showTrending}
            setShowTrending={setShowTrending}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
        ListFooterComponent={renderFooter}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
      />
      
      <FloatingActionButton onPress={handleCreatePost} />
      
      <CreatePostModal 
        visible={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  controlsLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  controlsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  trendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  trendingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});