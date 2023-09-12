import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack1 = createNativeStackNavigator();

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab1 = createBottomTabNavigator();

import MenuScreen from './Screens/MenuScreen';
import LocationScreen from './Screens/LocationScreen';
import AboutSreen from './Screens/AboutSreen';
import ListingScreen from './Screens/ListScreen';
import StateChangeonFocus from './Screens/TestingScreen';
import NotificationScreen from './Notifications/Example';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const StackNavigator1 = () => {
    return (
        <Stack1.Navigator initialRouteName='MenuStack' screenOptions={{ headerShown: true }}>            
            <Stack1.Screen name="AboutStack" component={AboutSreen} />
            <Stack1.Screen name="Notifications" component={NotificationScreen} />
            <Stack1.Screen name="MenuStack" component={MenuScreen} />
            <Stack1.Screen name="ListStack" component={ListingScreen} />
            <Stack1.Screen name="Location" component={LocationScreen} />
        </Stack1.Navigator>
    )
}

function get_tab_options(label, icon='home', color1 = 'green', tbb = 0) {
    let res_options = {
        title: label,
        fontSize: 12,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { color: color1 },
        tabBarLabel: label,
        tabBarIcon: () => <Ionicons name={icon} size={20} color={color1} />,
        tabBarIconStyle: { border: 1 }
    }
    if (tbb) {
        res_options.tabBarBadge = tbb;
    }
    return res_options;
}

const TabNavigator1 = () => {    
    return(
        <Tab1.Navigator>
            <Tab1.Screen name="TestTab" component={StateChangeonFocus} options={get_tab_options('ChanginStateApi', 'timer')}  />
            <Tab1.Screen name="MenuTab" component={StackNavigator1} options={get_tab_options('Main Menu', 'menu')}  />
            <Tab1.Screen name="Notifications" component={NotificationScreen} options={get_tab_options('Notifications', 'heart')}  />                        
        </Tab1.Navigator>
    );
}

export default function AppWithBottomTabs() {
    return (
        <NavigationContainer>
            <TabNavigator1/>
        </NavigationContainer>
    )
}
