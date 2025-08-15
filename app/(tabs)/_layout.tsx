import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Chrome as Home, CirclePlus as PlusCircle, User, Search, Bell, Settings, BarChart3 } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { TAB_BAR, DEVICE } from '@/constants';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { colors } = useThemeStore();
  const router = useRouter();

  // Temporarily disable authentication for testing
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace('/(auth)/login');
  //   }
  // }, [isAuthenticated]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: TAB_BAR.PADDING.TOP,
          paddingBottom: TAB_BAR.PADDING.BOTTOM + DEVICE.SAFE_AREA_BOTTOM,
          height: TAB_BAR.HEIGHT + DEVICE.SAFE_AREA_BOTTOM,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ size, color }) => (
            <Home size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => (
            <Bell size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={TAB_BAR.ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}