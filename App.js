import React from "react";
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NavigatorWithBottomTabs from "./app/AppNavigator";


LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App() {
    return (
        <NavigationContainer>
            <NavigatorWithBottomTabs/>
        </NavigationContainer>
    );
};
