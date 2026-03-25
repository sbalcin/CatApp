import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {HomeScreen} from '../screens/HomeScreen';
import {FavouritesScreen} from '../screens/FavouritesScreen';
import {UploadScreen} from '../screens/UploadScreen';
import {theme} from '../constants/theme';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => (
    <NavigationContainer>
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    paddingTop: 6,
                    height: 72,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
                tabBarIcon: ({focused, color, size}) => {
                    const icons: Record<string, [string, string]> = {
                        Home: ['paw', 'paw-outline'],
                        Favourites: ['heart', 'heart-outline'],
                        Upload: ['add-circle', 'add-circle-outline'],
                    };
                    const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
                    return (
                        <Ionicons
                            name={(focused ? active : inactive) as any}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: 'All Cats'}}/>
            <Tab.Screen name="Favourites" component={FavouritesScreen}/>
            <Tab.Screen name="Upload" component={UploadScreen}/>
        </Tab.Navigator>
    </NavigationContainer>
);