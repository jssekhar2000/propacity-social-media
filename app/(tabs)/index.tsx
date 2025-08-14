import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfinitePosts, useInfiniteDummyPosts, useDummyUsers, useSearchPosts } from '@/hooks/useApi';
import PostCard from '@/components/feed/PostCard';
import SearchBar from '@/components/feed/SearchBar';
import StoriesBar from '@/components/feed/StoriesBar';
import FloatingActionButton from '@/components/feed/FloatingActionButton';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { PostSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { Post, DummyPost } from '@/types/api';

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [useAlternateAPI, setUseAlternateAPI] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { initializePosts, posts: socialPosts } = useSocialStore();

  // Data fetching
  const {
    data: postsData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
    isLoading: isLoadingPosts,
    error: postsError,
    refetch: refetchPosts,
  } = useInfinitePosts();

  const {
    data: dummyPostsData,
    fetchNextPage: fetchNextDummyPosts,
    hasNextPage: hasNextDummyPosts,
    isFetchingNextPage: isFetchingNextDummyPosts,
    isLoading: isLoadingDummyPosts,
    error: dummyPostsError,
    refetch: refetchDummyPosts,
  } = useInfiniteDummyPosts();

  const { data: usersData } = useDummyUsers();
  const { data: searchResults, isLoading: isSearching } = useSearchPosts(searchQuery);

  // Choose data source
  const currentData = useAlternateAPI ? dummyPostsData : postsData;
  const currentError = useAlternateAPI ? dummyPostsError : postsError;
  const isCurrentLoading = useAlternateAPI ? isLoadingDummyPosts : isLoadingPosts;
  const fetchNext = useAlternateAPI ? fetchNextDummyPosts : fetchNextPosts;
  const hasNext = useAlternateAPI ? hasNextDummyPosts : hasNextPosts;
  const isFetchingNext = useAlternateAPI ? isFetchingNextDummyPosts : isFetchingNextPosts;
  const refetch = useAlternateAPI ? refetchDummyPosts : refetchPosts;

  // Define enhancePost function before using it
  const enhancePost = useCallback((post: Post | DummyPost): Post | DummyPost => {
    const isDummyPost = 'reactions' in post;
    const basePost = {
      ...post,
      likes: post.likes || (isDummyPost && post.reactions ? post.reactions.likes : Math.floor(Math.random() * 50) + 1),
      comments: post.comments || Math.floor(Math.random() * 20) + 1,
      shares: post.shares || Math.floor(Math.random() * 10) + 1,
      isLiked: post.isLiked ?? false,
      isSaved: post.isSaved ?? false,
      createdAt: post.createdAt || new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      location: post.location || (Math.random() > 0.7 ? ['New York, NY', 'Los Angeles, CA', 'London, UK', 'Tokyo, Japan'][Math.floor(Math.random() * 4)] : undefined),
      image: post.image || (Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${post.id}` : undefined),
    };

    if (isDummyPost) {
      return {
        ...basePost,
        tags: post.tags || ['social', 'life', 'inspiration'].slice(0, Math.floor(Math.random() * 3) + 1),
      } as DummyPost;
    }

    return basePost as Post;
  }, []);

  // Process and enhance data
  const allPosts = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults.posts.map(post => enhancePost(post));
    }
    
    if (!currentData) return [];
    
    let rawPosts: (Post | DummyPost)[] = [];
    if (useAlternateAPI) {
      rawPosts = currentData.pages.flatMap(page => page.posts);
    } else {
      rawPosts = currentData.pages.flatMap(page => page);
    }

    return rawPosts.map(post => enhancePost(post));
  }, [currentData, searchResults, searchQuery, useAlternateAPI]);

  // Initialize social store with enhanced posts
  useEffect(() => {
    if (allPosts.length > 0) {
      initializePosts(allPosts);
    }
    }, [allPosts, initializePosts]);

  const usersMap = useMemo(() => {
    if (!usersData?.users) return {};
    return usersData.users.reduce((acc, user) => {
      acc[user.id] = {
        ...user,
        followers: Math.floor(Math.random() * 10000) + 100,
        following: Math.floor(Math.random() * 5000) + 50,
        bio: 'Living life one post at a time ✨',
      };
      return acc;
    }, {} as Record<number, any>);
  }, [usersData]);

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isFetchingNext && !searchQuery) {
      fetchNext();
    }
  }, [hasNext, isFetchingNext, fetchNext, searchQuery]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleApiToggle = useCallback(() => {
    setUseAlternateAPI(!useAlternateAPI);
  }, [useAlternateAPI]);

  const handleCreatePost = useCallback(() => {
    setShowCreatePost(true);
  }, []);

  const handleStoryPress = useCallback((storyId: number) => {
    Alert.alert('Story', `Viewing story ${storyId}`);
  }, []);

  const handleAddStory = useCallback(() => {
    Alert.alert('Add Story', 'Story creation feature coming soon!');
  }, []);

  const renderPost = useCallback(({ item }: { item: Post | DummyPost }) => {
    const user = usersMap[item.userId];
    
    return (
      <PostCard
        post={item}
        user={user}
      />
    );
  }, [usersMap]);

  const renderFooter = useCallback(() => {
    if (isFetchingNext) {
      return <PostSkeleton />;
    }
    return null;
  }, [isFetchingNext]);

  const renderEmpty = useCallback(() => {
    if (searchQuery && !isSearching) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No posts found for "{searchQuery}"
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Try searching for something else
          </Text>
        </View>
      );
    }
    return null;
  }, [searchQuery, isSearching, colors]);

  const renderHeader = useCallback(() => {
    const stories = usersData?.users?.slice(0, 8).map((user, index) => ({
      id: user.id,
      username: user.firstName || user.name,
      avatar: user.image || user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      hasStory: Math.random() > 0.3,
      isViewed: Math.random() > 0.7,
    })) || [];

    return (
      <View>
        {!currentUser && (
          <View style={[styles.welcomeBanner, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.welcomeText, { color: colors.primary }]}>
              Welcome to Propacity! Log in to like, comment, and share posts.
            </Text>
          </View>
        )}
        <StoriesBar
          stories={stories}
          onStoryPress={handleStoryPress}
          onAddStory={handleAddStory}
        />
      </View>
    );
  }, [currentUser, colors, usersData, handleStoryPress, handleAddStory]);

  if (isCurrentLoading && !searchQuery) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Social Feed</Text>
          <TouchableOpacity
            style={[styles.apiToggle, { backgroundColor: colors.primary }]}
            onPress={handleApiToggle}
          >
            <Text style={styles.apiToggleText}>
              {useAlternateAPI ? 'DummyJSON' : 'JSONPlaceholder'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  if (currentError && !searchQuery) {
    return (
      <ErrorMessage
        message="Failed to load posts. Please check your internet connection."
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Social Feed</Text>
        <TouchableOpacity
          style={[styles.apiToggle, { backgroundColor: colors.primary }]}
          onPress={handleApiToggle}
        >
          <Text style={styles.apiToggleText}>
            {useAlternateAPI ? 'DummyJSON' : 'JSONPlaceholder'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={clearSearch}
      />

      {/* Feed */}
      <FlatList
        data={allPosts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderPost}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCreatePost} />

      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
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
  apiToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  apiToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
  },
  skeletonContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeBanner: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});