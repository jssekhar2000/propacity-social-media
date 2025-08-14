import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfinitePosts, useInfiniteDummyPosts, useDummyUsers, useSearchPosts } from '@/hooks/useApi';
import PostCard from '@/components/feed/PostCard';
import SearchBar from '@/components/feed/SearchBar';
import { PostSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useThemeStore } from '@/store/themeStore';
import { Post, DummyPost } from '@/types/api';

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [useAlternateAPI, setUseAlternateAPI] = useState(false);
  const { colors } = useThemeStore();

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

  // Process data
  const allPosts = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults.posts;
    }
    
    if (!currentData) return [];
    
    if (useAlternateAPI) {
      return currentData.pages.flatMap(page => page.posts);
    } else {
      return currentData.pages.flatMap(page => page);
    }
  }, [currentData, searchResults, searchQuery, useAlternateAPI]);

  const usersMap = useMemo(() => {
    if (!usersData?.users) return {};
    return usersData.users.reduce((acc, user) => {
      acc[user.id] = user;
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

  const renderPost = useCallback(({ item }: { item: Post | DummyPost }) => {
    const user = usersMap[item.userId];
    
    return (
      <PostCard
        post={item}
        user={user}
        onLike={() => console.log('Like post', item.id)}
        onComment={() => console.log('Comment on post', item.id)}
        onShare={() => console.log('Share post', item.id)}
        onMore={() => console.log('More options for post', item.id)}
      />
    );
  }, [usersMap]);

  const renderFooter = useCallback(() => {
    if (isFetchingNext) {
      return (
        <PostSkeleton />
      );
    }
    return null;
  }, [isFetchingNext]);

  const renderEmpty = useCallback(() => {
    if (searchQuery && !isSearching) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No posts found for "{searchQuery}"</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try searching for something else</Text>
        </View>
      );
    }
    return null;
  }, [searchQuery, isSearching]);

  if (isCurrentLoading && !searchQuery) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Social Feed</Text>
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
          onPress={() => setUseAlternateAPI(!useAlternateAPI)}
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
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
});