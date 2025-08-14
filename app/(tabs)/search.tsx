import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Users, FileText } from 'lucide-react-native';
import { useSearchPosts, useDummyUsers } from '@/hooks/useApi';
import { useThemeStore } from '@/store/themeStore';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

const demoUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    username: '@sarahj',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    followers: '2.3K',
    verified: true,
  },
  {
    id: 2,
    name: 'Mike Chen',
    username: '@mikechen',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    followers: '1.8K',
    verified: false,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    username: '@emmaw',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    followers: '3.1K',
    verified: true,
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const { colors } = useThemeStore();
  
  const { data: searchResults, isLoading: isSearching } = useSearchPosts(searchQuery);
  const { data: usersData } = useDummyUsers();

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return demoUsers;
    return demoUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery || !searchResults) return [];
    return searchResults.posts.slice(0, 10);
  }, [searchQuery, searchResults]);

  const renderUser = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.userItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
          {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
        </View>
        <Text style={[styles.userUsername, { color: colors.textSecondary }]}>{item.username}</Text>
        <Text style={[styles.userFollowers, { color: colors.textSecondary }]}>{item.followers} followers</Text>
      </View>
      <TouchableOpacity style={[styles.followButton, { borderColor: colors.primary }]}>
        <Text style={[styles.followButtonText, { color: colors.primary }]}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), [colors]);

  const renderPost = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.postItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
      <Text style={[styles.postBody, { color: colors.textSecondary }]} numberOfLines={3}>{item.body}</Text>
      <View style={styles.postMeta}>
        <Text style={[styles.postMetaText, { color: colors.textSecondary }]}>2 hours ago</Text>
        <Text style={[styles.postMetaText, { color: colors.textSecondary }]}>•</Text>
        <Text style={[styles.postMetaText, { color: colors.textSecondary }]}>{item.reactions?.likes || Math.floor(Math.random() * 50)} likes</Text>
      </View>
    </TouchableOpacity>
  ), [colors]);

  const renderTabButton = (tab: 'all' | 'users' | 'posts', label: string, icon: any) => {
    const Icon = icon;
    const isActive = activeTab === tab;
    
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          { borderColor: colors.border },
          isActive && { backgroundColor: colors.primary }
        ]}
        onPress={() => setActiveTab(tab)}
      >
        <Icon size={16} color={isActive ? '#FFFFFF' : colors.textSecondary} strokeWidth={2} />
        <Text style={[
          styles.tabButtonText,
          { color: isActive ? '#FFFFFF' : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isSearching && searchQuery) {
      return (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.skeletonItem, { backgroundColor: colors.surface }]}>
              <SkeletonLoader width={50} height={50} borderRadius={25} />
              <View style={styles.skeletonText}>
                <SkeletonLoader width="60%" height={16} />
                <SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (!searchQuery) {
      return (
        <View style={styles.emptyState}>
          <Search size={64} color={colors.textSecondary} strokeWidth={1} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Search Social</Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Find people, posts, and trending topics
          </Text>
        </View>
      );
    }

    const data = activeTab === 'users' ? filteredUsers : 
                 activeTab === 'posts' ? filteredPosts : 
                 [...filteredUsers, ...filteredPosts];

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No results found</Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Try searching for something else
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => {
          if ('username' in item) {
            return renderUser({ item });
          } else {
            return renderPost({ item });
          }
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} strokeWidth={2} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search people and posts..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Tabs */}
      {searchQuery && (
        <View style={[styles.tabsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {renderTabButton('all', 'All', Search)}
          {renderTabButton('users', 'People', Users)}
          {renderTabButton('posts', 'Posts', FileText)}
        </View>
      )}

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedBadge: {
    fontSize: 14,
    color: '#007AFF',
  },
  userUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  userFollowers: {
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  postBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postMetaText: {
    fontSize: 12,
  },
  loadingContainer: {
    padding: 16,
    gap: 12,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skeletonText: {
    flex: 1,
    marginLeft: 12,
  },
});