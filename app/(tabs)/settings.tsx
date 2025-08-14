import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Moon, Sun, User, Shield, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Palette } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const router = useRouter();

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

  const settingsItems = [
    {
      section: 'Account',
      items: [
        {
          icon: User,
          title: 'Edit Profile',
          description: 'Update your personal information',
          onPress: () => Alert.alert('Coming Soon', 'Edit profile feature will be available soon!'),
          showChevron: true,
        },
        {
          icon: Shield,
          title: 'Privacy & Security',
          description: 'Manage your privacy settings',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon!'),
          showChevron: true,
        },
      ]
    },
    {
      section: 'Preferences',
      items: [
        {
          icon: isDarkMode ? Sun : Moon,
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          onPress: toggleTheme,
          showSwitch: true,
          switchValue: isDarkMode,
        },
        {
          icon: Bell,
          title: 'Notifications',
          description: 'Manage notification preferences',
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
          showChevron: true,
        },
        {
          icon: Palette,
          title: 'Appearance',
          description: 'Customize app appearance',
          onPress: () => Alert.alert('Coming Soon', 'Appearance settings will be available soon!'),
          showChevron: true,
        },
      ]
    },
    {
      section: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          description: 'Get help and contact support',
          onPress: () => Alert.alert('Help & Support', 'For support, please contact us at support@socialapp.com'),
          showChevron: true,
        },
      ]
    },
  ];

  const renderSettingItem = (item: any) => {
    const Icon = item.icon;
    
    return (
      <TouchableOpacity
        key={item.title}
        style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={item.onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
          <Icon size={20} color={colors.primary} strokeWidth={2} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        
        {item.showSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onPress}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        )}
        
        {item.showChevron && (
          <ChevronRight size={20} color={colors.textSecondary} strokeWidth={2} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Account Info */}
        <View style={[styles.accountSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.accountInfo}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.accountDetails}>
              <Text style={[styles.accountName, { color: colors.text }]}>{user?.username || 'User'}</Text>
              <Text style={[styles.accountEmail, { color: colors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsItems.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.section}</Text>
            <View style={styles.sectionItems}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]} 
            onPress={handleLogout}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FF3B3015' }]}>
              <LogOut size={20} color="#FF3B30" strokeWidth={2} />
            </View>
            <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>Social Dashboard v1.0.0</Text>
          <Text style={[styles.appInfoSubtext, { color: colors.textSecondary }]}>Built with React Native & AI</Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  accountSection: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  sectionItems: {
    gap: 8,
  },
  settingItem: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  logoutSection: {
    marginTop: 8,
  },
  logoutButton: {
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
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  appInfoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  appInfoSubtext: {
    fontSize: 12,
  },
});