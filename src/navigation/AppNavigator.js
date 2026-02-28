/**
 * App navigation - Stack + Tabs based on role.
 * Ready for backend: add auth flow before Main.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View, Image, Pressable, Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { LoadingSpinner } from '../components';

import { EntryScreen } from '../screens/EntryScreen';
import { PhoneLoginScreen } from '../screens/Auth/PhoneLoginScreen';
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
import { AdminFeesScreen } from '../screens/Admin/AdminFeesScreen';

import { StudentFeesScreen } from '../screens/Student/StudentFeesScreen';
import { ProfileDetailScreen } from '../screens/Student/ProfileDetailScreen';
import { AboutScreen } from '../screens/Student/AboutScreen';
import { ThemeScreen } from '../screens/Student/ThemeScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { Ionicons } from '@expo/vector-icons';

const TabIcon = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

const HeaderBackBtn = ({ navigation }) => {
  const { theme } = useApp();
  return (
    <Ionicons
      name="chevron-back"
      size={28}
      color="#ffffff"
      style={{ marginLeft: 15 }}
      onPress={() => navigation.goBack()}
    />
  );
};

const HeaderLogo = ({ navigation }) => {
  const { theme } = useApp();
  return (
    <Pressable
      onPress={() => navigation.navigate('Profile')}
      style={{ marginLeft: 15, paddingVertical: 5 }}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 50, height: 50, borderRadius: 25 }}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const CustomTabBar = ({ state, descriptors, navigation, position }) => {
  const { theme } = useApp();
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: theme.primary,
      height: 65,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
      paddingBottom: 10,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconColor = isFocused ? '#ffffff' : 'rgba(255,255,255,0.6)';
        const iconName = options.tabBarIcon ? options.tabBarIcon({ color: iconColor }).props.name : 'help-outline';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={iconName} size={24} color={iconColor} />
            <Text style={{
              color: iconColor,
              fontSize: 10,
              fontWeight: '700',
              marginTop: 4,
              opacity: isFocused ? 1 : 0.8,
            }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" color={color} />,
        }}
      />
      <Tab.Screen
        name="StudentApproval"
        component={AdminStudentApprovalScreen}
        options={{
          title: 'Students',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" color={color} />,
        }}
      />
      <Tab.Screen
        name="GroupManagement"
        component={AdminGroupManagementScreen}
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StudentProfileScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const StudentTabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StudentProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = ({ role, theme }) => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { color: '#ffffff', fontWeight: '900' },
        animation: 'slide_from_right',
        headerShadowVisible: false,
        headerLeft: () => route.name === 'Main' ? <HeaderLogo navigation={navigation} /> : <HeaderBackBtn navigation={navigation} />,
        headerTitleAlign: 'center',
        headerTitle: 'Road To A+',
      })}
    >
      <Stack.Screen
        name="Main"
        component={role === 'admin' ? AdminTabs : StudentTabs}
        options={{ headerShown: true }}
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
      <Stack.Screen
        name="AdminFees"
        component={AdminFeesScreen}
        options={{ title: 'Fees Management' }}
      />
      <Stack.Screen
        name="StudentFees"
        component={StudentFeesScreen}
        options={{ title: 'Pay Fees' }}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About Road To A+' }}
      />
      <Stack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{ title: 'App Theme' }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { session, role, isReady, theme } = useApp();

  if (!isReady) return <LoadingSpinner />;

  return (
    <NavigationContainer>
      {session ? <MainStack role={role} theme={theme} /> : <AuthStack />}
    </NavigationContainer>
  );
};
