import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { ANALYTICS, UI_CONSTANTS } from '@/constants';

const { width } = Dimensions.get('window');

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  x: string;
  y: number;
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const { colors } = useThemeStore();
  const { posts, getLikedPosts, getSavedPosts } = useSocialStore();
  const { user: currentUser } = useAuthStore();

  // Animated values for smooth transitions
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + (post.shares || 0), 0);
    const engagementRate = totalPosts > 0 ? ((totalLikes + totalComments + totalShares) / totalPosts).toFixed(1) : '0';

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      engagementRate,
    };
  }, [posts]);

  // Generate mock chart data
  const generateChartData = (metric: string, period: string): ChartData[] => {
    const data: ChartData[] = [];
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      let value = 0;
      switch (metric) {
        case 'engagement':
          value = Math.floor(Math.random() * 100) + 20;
          break;
        case 'posts':
          value = Math.floor(Math.random() * 10) + 1;
          break;
        case 'reach':
          value = Math.floor(Math.random() * 1000) + 100;
          break;
        case 'growth':
          value = Math.floor(Math.random() * 50) + 10;
          break;
      }
      
      data.push({
        x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: value,
      });
    }
    
    return data;
  };

  const metrics: AnalyticsMetric[] = [
    {
      id: 'posts',
      title: 'Total Posts',
      value: analyticsData.totalPosts.toString(),
      change: 12.5,
      icon: <MessageCircle size={24} color="#FFFFFF" />,
      color: '#6366F1',
    },
    {
      id: 'likes',
      title: 'Total Likes',
      value: analyticsData.totalLikes.toString(),
      change: 8.2,
      icon: <Heart size={24} color="#FFFFFF" />,
      color: '#EF4444',
    },
    {
      id: 'comments',
      title: 'Comments',
      value: analyticsData.totalComments.toString(),
      change: 15.7,
      icon: <MessageCircle size={24} color="#FFFFFF" />,
      color: '#10B981',
    },
    {
      id: 'shares',
      title: 'Shares',
      value: analyticsData.totalShares.toString(),
      change: 23.1,
      icon: <Share size={24} color="#FFFFFF" />,
      color: '#F59E0B',
    },
    {
      id: 'engagement',
      title: 'Engagement Rate',
      value: `${analyticsData.engagementRate}%`,
      change: 5.3,
      icon: <TrendingUp size={24} color="#FFFFFF" />,
      color: '#8B5CF6',
    },
    {
      id: 'reach',
      title: 'Total Reach',
      value: '12.5K',
      change: 18.9,
      icon: <Eye size={24} color="#FFFFFF" />,
      color: '#06B6D4',
    },
  ];

  const chartData = generateChartData(selectedMetric, selectedPeriod);

  const renderMetricCard = (metric: AnalyticsMetric, index: number) => (
    <Animated.View
      key={metric.id}
      style={[
        styles.metricCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[metric.color, `${metric.color}80`]}
        style={styles.metricGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.metricHeader}>
          {metric.icon}
          <View style={styles.changeIndicator}>
            <TrendingUp size={12} color="#FFFFFF" />
            <Text style={styles.changeText}>{metric.change}%</Text>
          </View>
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricTitle}>{metric.title}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const renderSimpleChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.y));
    const minValue = Math.min(...chartData.map(d => d.y));
    const range = maxValue - minValue;
    const isLongPeriod = selectedPeriod === '90d';

    return (
      <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time
          </Text>
          <View style={styles.chartPeriodControls}>
            {ANALYTICS.PERIODS.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[styles.periodButton, selectedPeriod === period.id && { backgroundColor: colors.primary }]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[styles.periodText, { color: selectedPeriod === period.id ? '#FFFFFF' : colors.textSecondary }]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.chartArea, { height: isLongPeriod ? 250 : 200 }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScrollContainer}
          >
            <View style={[styles.chartBars, { width: isLongPeriod ? chartData.length * 40 : '100%' }]}>
              {chartData.map((data, index) => {
                const height = range > 0 ? ((data.y - minValue) / range) * (isLongPeriod ? 180 : 150) : 0;
                return (
                  <View key={index} style={[styles.barContainer, { minWidth: isLongPeriod ? 35 : 20 }]}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(height, ANALYTICS.CHART.MIN_BAR_HEIGHT),
                          backgroundColor: colors.primary,
                          width: isLongPeriod ? 16 : ANALYTICS.CHART.BAR_WIDTH,
                        },
                      ]}
                    />
                    <Text style={[
                      styles.barLabel, 
                      { 
                        color: colors.textSecondary,
                        fontSize: isLongPeriod ? 8 : ANALYTICS.CHART.LABEL_FONT_SIZE,
                        transform: isLongPeriod ? [{ rotate: '-45deg' }] : [],
                      }
                    ]}>
                      {isLongPeriod ? data.x.split(' ')[1] : data.x}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    const pieData = [
      { label: 'Likes', value: analyticsData.totalLikes, color: '#EF4444' },
      { label: 'Comments', value: analyticsData.totalComments, color: '#10B981' },
      { label: 'Shares', value: analyticsData.totalShares, color: '#F59E0B' },
    ];

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    return (
      <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Engagement Breakdown
        </Text>
        <View style={styles.pieChart}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.pieItem}>
              <View style={[styles.pieColor, { backgroundColor: item.color }]} />
              <View style={styles.pieInfo}>
                <Text style={[styles.pieLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.pieValue, { color: colors.textSecondary }]}>
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'}% ({item.value})
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Analytics Dashboard
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your social media performance
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Download size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <RefreshCw size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => renderMetricCard(metric, index))}
      </View>

      {/* Chart Controls */}
      <View style={styles.chartControls}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Performance Analytics
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricTabs}>
          {ANALYTICS.METRICS.map((metric) => (
            <TouchableOpacity
              key={metric.id}
              style={[
                styles.metricTab,
                selectedMetric === metric.id && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedMetric(metric.id)}
            >
              <Text style={[
                styles.metricTabText,
                { color: selectedMetric === metric.id ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {metric.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Charts */}
      {renderSimpleChart()}
      {renderPieChart()}

      {/* Quick Actions */}
      <View style={[styles.quickActions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.background }]}>
            <Calendar size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Schedule Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.background }]}>
            <Filter size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Filter Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.background }]}>
            <Users size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Audience
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.background }]}>
            <TrendingUp size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Trends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  metricGradient: {
    padding: 16,
    minHeight: 120,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  chartControls: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  metricTabs: {
    marginBottom: 8,
  },
  metricTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  metricTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartPeriodControls: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartArea: {
    height: 200,
    justifyContent: 'flex-end',
  },
  chartScrollContainer: {
    paddingHorizontal: 10,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  pieChart: {
    gap: 12,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pieColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pieInfo: {
    flex: 1,
  },
  pieLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  pieValue: {
    fontSize: 12,
  },
  quickActions: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 88) / 2,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
