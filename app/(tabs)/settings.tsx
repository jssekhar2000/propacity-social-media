import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Moon, 
  Sun, 
  User, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Palette,
  Settings as SettingsIcon,
  CreditCard,
  Globe,
  Lock,
  Eye,
  Download,
  Share2,
  Star,
  Heart,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

// Separate component for setting item to use hooks properly
const SettingItem = React.memo(({ item, index, colors }: any) => {
  const Icon = item.icon;
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
        styles.settingItem,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.settingContent, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={item.onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <Icon size={20} color={item.color} strokeWidth={2} />
        </View>
        
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        
        {item.showSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange || item.onPress}
            trackColor={{ false: colors.border, true: item.color }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.border}
          />
        )}
        
        {item.showChevron && (
          <ChevronRight size={20} color={colors.textSecondary} strokeWidth={2} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

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
          color: '#007AFF',
        },
        {
          icon: Shield,
          title: 'Privacy & Security',
          description: 'Manage your privacy settings',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon!'),
          showChevron: true,
          color: '#34C759',
        },
        {
          icon: CreditCard,
          title: 'Payment Methods',
          description: 'Manage your payment options',
          onPress: () => Alert.alert('Coming Soon', 'Payment methods will be available soon!'),
          showChevron: true,
          color: '#FF9500',
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
          color: '#8B5CF6',
        },
        {
          icon: Bell,
          title: 'Notifications',
          description: 'Manage notification preferences',
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
          color: '#EF4444',
        },
        {
          icon: Palette,
          title: 'Appearance',
          description: 'Customize app appearance',
          onPress: () => Alert.alert('Coming Soon', 'Appearance settings will be available soon!'),
          showChevron: true,
          color: '#06B6D4',
        },
        {
          icon: Eye,
          title: 'Location Services',
          description: 'Control location-based features',
          onPress: () => Alert.alert('Coming Soon', 'Location settings will be available soon!'),
          showSwitch: true,
          switchValue: locationEnabled,
          onSwitchChange: setLocationEnabled,
          color: '#10B981',
        },
        {
          icon: Download,
          title: 'Auto Save',
          description: 'Automatically save your content',
          onPress: () => Alert.alert('Coming Soon', 'Auto save settings will be available soon!'),
          showSwitch: true,
          switchValue: autoSaveEnabled,
          onSwitchChange: setAutoSaveEnabled,
          color: '#F59E0B',
        },
      ]
    },
    {
      section: 'Support & About',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          description: 'Get help and contact support',
          onPress: () => Alert.alert('Help & Support', 'For support, please contact us at support@socialapp.com'),
          showChevron: true,
          color: '#8B5CF6',
        },
        {
          icon: Share2,
          title: 'Share App',
          description: 'Share with friends and family',
          onPress: () => Alert.alert('Share App', 'Share feature will be available soon!'),
          showChevron: true,
          color: '#06B6D4',
        },
        {
          icon: Star,
          title: 'Rate App',
          description: 'Rate us on the App Store',
          onPress: () => Alert.alert('Rate App', 'Rating feature will be available soon!'),
          showChevron: true,
          color: '#FFD700',
        },
      ]
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, `${colors.primary}80`]}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your account preferences</Text>
          </View>
          <View style={styles.headerIcon}>
            <SettingsIcon size={24} color="#FFFFFF" />
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Account Info */}
        <View style={[styles.accountSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.accountInfo}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.accountAvatar}
            />
            <View style={styles.accountDetails}>
              <Text style={[styles.accountName, { color: colors.text }]}>{user?.username || 'Alex Johnson'}</Text>
              <Text style={[styles.accountEmail, { color: colors.textSecondary }]}>{user?.email || 'alex@example.com'}</Text>
              <View style={styles.accountStatus}>
                <CheckCircle size={14} color="#34C759" />
                <Text style={[styles.accountStatusText, { color: colors.textSecondary }]}>Premium Member</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Banner */}
        <View style={[styles.premiumBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumContent}>
              <Crown size={24} color="#FFFFFF" />
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>Unlock exclusive features and remove ads</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Settings Sections */}
        {settingsItems.map((section, sectionIndex) => (
          <View key={section.section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.section}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item, index) => (
                <SettingItem
                  key={item.title}
                  item={item}
                  index={sectionIndex * 10 + index}
                  colors={colors}
                />
              ))}
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
          <View style={styles.appInfoHeader}>
            <Heart size={16} color={colors.textSecondary} />
            <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>Social Dashboard v1.0.0</Text>
          </View>
          <Text style={[styles.appInfoSubtext, { color: colors.textSecondary }]}>Built with React Native & AI</Text>
          <View style={styles.appInfoFooter}>
            <TouchableOpacity style={styles.infoButton}>
              <Info size={14} color={colors.textSecondary} />
              <Text style={[styles.infoButtonText, { color: colors.textSecondary }]}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoButton}>
              <Info size={14} color={colors.textSecondary} />
              <Text style={[styles.infoButtonText, { color: colors.textSecondary }]}>Terms of Service</Text>
            </TouchableOpacity>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
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
  accountAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
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
    marginBottom: 8,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  premiumBanner: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  upgradeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
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
    gap: 8,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appInfoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  appInfoSubtext: {
    fontSize: 12,
  },
  appInfoFooter: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});