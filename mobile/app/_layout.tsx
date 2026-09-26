import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ToastContainer } from '../components/shared/Toast';
import { Colors } from '../constants/Colors';
import { useIdeaStore } from '../store/ideaStore';
import { useProjectStore } from '../store/projectStore';
import { useSearchStore } from '../store/searchStore';
import { useSettingsStore } from '../store/settingsStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const fetchIdeas = useIdeaStore((s) => s.fetchIdeas);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadRecentSearches = useSearchStore((s) => s.loadRecentSearches);

  useEffect(() => {
    async function init() {
      try {
        await Promise.all([
          loadSettings(),
          fetchIdeas(),
          fetchProjects(),
          loadRecentSearches(),
        ]);
      } catch (e) {
        console.error('Error initializing app state:', e);
      } finally {
        setReady(true);
      }
    }
    init();
  }, [fetchIdeas, fetchProjects, loadSettings, loadRecentSearches]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.dark.card,
            },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: {
              fontWeight: '700',
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: Colors.dark.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="capture"
            options={{
              presentation: 'modal',
              title: 'Quick Capture',
              headerStyle: { backgroundColor: '#131826' },
            }}
          />
          <Stack.Screen
            name="ai-assist"
            options={{
              presentation: 'modal',
              title: '✨ AI Second Brain',
              headerStyle: { backgroundColor: '#131826' },
            }}
          />
          <Stack.Screen
            name="idea/[id]"
            options={{
              title: 'Idea Details',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="project/[id]"
            options={{
              title: 'Project Hub',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
        <ToastContainer />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
