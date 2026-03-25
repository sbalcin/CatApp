import * as Application from 'expo-application';
import {Platform} from 'react-native';

export async function getDeviceId(): Promise<string> {
    if (Platform.OS === 'ios') {
        const id = await Application.getIosIdForVendorAsync();
        return id ?? 'ios-unknown';
    }

    if (Platform.OS === 'android') {
        return Application.getAndroidId() ?? 'android-unknown';
    }

    return 'web-unknown';
}