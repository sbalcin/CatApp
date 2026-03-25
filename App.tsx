import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {AppNavigator} from './src/navigation/AppNavigator';
import {getDeviceId} from "./src/util/deviceId";
import {setSubId} from "./src/api/catApi";

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: 2, refetchOnWindowFocus: false}},
});

export default function App() {

    useEffect(() => {
        getDeviceId().then(setSubId);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <StatusBar style="light"/>
            <AppNavigator/>
            <Toast/>
        </QueryClientProvider>
    );
}