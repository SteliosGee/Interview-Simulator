import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomePage from '../screens/HomePage';
import InterviewPage from '../screens/InterviewPage';
import PreInterviewPage from '../screens/PreInterviewPage';
import ProfilePage from '../screens/ProfilePage';
import SettingsPage from '../screens/SettingsPage';
import { useTheme } from '../components/ThemeProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomePage} />
    <Stack.Screen name="Interview" component={InterviewPage} />
    <Stack.Screen name="PreInterview" component={PreInterviewPage} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Extra') {
            iconName = focused ? 'bookmarks' : 'bookmarks-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.background },
        headerShown: false, // Hide header for all tabs
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Extra" component={SettingsPage} />
    </Tab.Navigator>
  );
}