import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FloatingButton } from '../../components/shared/FloatingButton';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Theme';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.dark.primaryLight,
          tabBarInactiveTintColor: Colors.dark.textDim,
          tabBarStyle: {
            backgroundColor: '#0F131E',
            borderTopColor: Colors.dark.cardBorder,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: Typography.sizes.xs,
            fontWeight: Typography.weights.semibold,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ideas"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'bulb' : 'bulb-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'rocket' : 'rocket-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Second Brain',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'finger-print' : 'finger-print-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Persistent Floating '+' Button */}
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
