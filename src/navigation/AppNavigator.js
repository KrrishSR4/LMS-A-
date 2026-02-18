/**
 * App navigation - Stack + Tabs based on role.
 * Ready for backend: add auth flow before Main.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useApp } from '../context/AppContext';
import { LoadingSpinner } from '../components';

import { EntryScreen } from '../screens/EntryScreen';
import { AdminDashboardScreen } from '../screens/Admin/AdminDashboardScreen';
import { AdminStudentApprovalScreen } from '../screens/Admin/AdminStudentApprovalScreen';
import { AdminGroupManagementScreen } from '../screens/Admin/AdminGroupManagementScreen';
import { AdminGroupSettingsScreen } from '../screens/Admin/AdminGroupSettingsScreen';
import { AdminGroupChatScreen } from '../screens/Admin/AdminGroupChatScreen';
import { StudentDashboardScreen } from '../screens/Student/StudentDashboardScreen';
import { StudentGroupChatScreen } from '../screens/Student/StudentGroupChatScreen';
import { StudentProfileScreen } from '../screens/Student/StudentProfileScreen';
import { StudentGroupInfoScreen } from '../screens/Student/StudentGroupInfoScreen';
import { AdminGroupMembersScreen } from '../screens/Admin/AdminGroupMembersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { Ionicons } from '@expo/vector-icons';

const TabIcon = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

const HeaderBackBtn = ({ navigation }) => (
  <Ionicons
    name="chevron-back"
    size={28}
    color="#fff"
    style={{ marginLeft: 15 }}
    onPress={() => navigation.goBack()}
  />
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerStyle: { backgroundColor: '#2563eb' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: (props) => <TabIcon name="grid-outline" {...props} />
      }}
    />
    <Tab.Screen
      name="StudentApproval"
      component={AdminStudentApprovalScreen}
      options={{
        title: 'Students',
        tabBarIcon: (props) => <TabIcon name="people-outline" {...props} />
      }}
    />
    <Tab.Screen
      name="GroupManagement"
      component={AdminGroupManagementScreen}
      options={{
        title: 'Groups',
        tabBarIcon: (props) => <TabIcon name="chatbubbles-outline" {...props} />
      }}
    />
  </Tab.Navigator>
);

const StudentTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerStyle: { backgroundColor: '#2563eb' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={StudentDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: (props) => <TabIcon name="home-outline" {...props} />
      }}
    />
    <Tab.Screen
      name="Profile"
      component={StudentProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: (props) => <TabIcon name="person-outline" {...props} />
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => {
  const { role } = useApp();
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '900', fontSize: 20 },
        animation: 'slide_from_right',
        headerShadowVisible: true,
        headerLeft: () => <HeaderBackBtn navigation={navigation} />,
        headerTitleAlign: 'center',
      })}
    >
      <Stack.Screen
        name="Main"
        component={role === 'admin' ? AdminTabs : StudentTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupChat"
        component={AdminGroupChatScreen}
        options={({ route }) => ({
          title: route.params?.groupName || 'Chat',
          animation: 'slide_from_bottom',
        })}
      />
      <Stack.Screen
        name="StudentGroupChat"
        component={StudentGroupChatScreen}
        options={({ route }) => ({
          title: route.params?.groupName || 'Chat',
          animation: 'slide_from_bottom',
        })}
      />
      <Stack.Screen
        name="GroupSettings"
        component={AdminGroupSettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="GroupInfo"
        component={StudentGroupInfoScreen}
        options={({ route }) => ({ title: 'About Group' })}
      />
      <Stack.Screen
        name="GroupMembers"
        component={AdminGroupMembersScreen}
        options={{ title: 'Participants' }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isReady } = useApp();

  if (!isReady) return <LoadingSpinner />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="App" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
