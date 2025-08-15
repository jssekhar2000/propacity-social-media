import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AnalyticsDashboard />
    </SafeAreaView>
  );
}
