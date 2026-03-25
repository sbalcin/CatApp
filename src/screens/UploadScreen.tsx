import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import {useMyCats, useUploadCat} from '../hooks/useCats';
import {useVotes} from '../hooks/useVotes';
import {CatCard} from '../components/CatCard';
import {EmptyState} from '../components/EmptyState';
import {theme} from '../constants/theme';
import Toast from "react-native-toast-message";

const MAX_SIZE_MB = 10;

export const UploadScreen: React.FC = () => {
    const {width} = useWindowDimensions();
    const [selectedUri, setSelectedUri] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const {mutate: upload, isPending, error} = useUploadCat();
    const {data: myCats, isLoading: catsLoading, refetch, isRefetching} = useMyCats();
    const {data: votes} = useVotes();

    const numColumns = width >= 600 ? 4 : width >= 400 ? 2 : 1;
    const cardSize =
        (width - theme.spacing.md * 2 - (numColumns - 1) * theme.spacing.sm) / numColumns;

    const pickImage = async () => {
        setValidationError(null);
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.9,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            if (asset.fileSize && asset.fileSize > MAX_SIZE_MB * 1024 * 1024) {
                setValidationError(`Image must be under ${MAX_SIZE_MB}MB`);
                return;
            }
            setSelectedUri(asset.uri);
        }
    };

    const handleUpload = () => {
        if (!selectedUri) {
            setValidationError('Please select an image first');
            return;
        }
        upload(selectedUri, {
            onSuccess: () => {
                setSelectedUri(null);
                setValidationError(null);
                Toast.show({
                    type: 'success',
                    text1: '🐱 Cat uploaded!',
                    text2: 'Your cat has been added to your collection',
                    visibilityTime: 3000,
                    position: 'bottom',
                });
            },
            onError: (err: any) => {
                const msg = err?.response?.data?.message ?? err.message ?? 'Upload failed';
                setValidationError(msg);
                Toast.show({
                    type: 'error',
                    text1: 'Upload failed',
                    text2: msg,
                    position: 'bottom',
                });
            },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <Text style={styles.title}>Upload a Cat</Text>
                <Text style={styles.subtitle}>Share your feline friend with the world 🐾</Text>

                <TouchableOpacity style={styles.dropZone} onPress={pickImage} activeOpacity={0.8}>
                    {selectedUri ? (
                        <Image source={{uri: selectedUri}} style={styles.preview} resizeMode="cover"/>
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.textMuted}/>
                            <Text style={styles.placeholderText}>Tap to select an image</Text>
                            <Text style={styles.placeholderSub}>JPG, PNG, GIF, WEBP up to {MAX_SIZE_MB}MB</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {(validationError || error) && (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={16} color={theme.colors.error}/>
                        <Text style={styles.errorText}>
                            {validationError ?? (error as any)?.response?.data?.message ?? 'Something went wrong'}
                        </Text>
                    </View>
                )}

                {selectedUri && (
                    <TouchableOpacity style={styles.clearBtn} onPress={() => setSelectedUri(null)}>
                        <Text style={styles.clearText}>Remove image</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.uploadBtn, (!selectedUri || isPending) && styles.uploadBtnDisabled]}
                    onPress={handleUpload}
                    disabled={!selectedUri || isPending}
                    activeOpacity={0.85}
                >
                    {isPending ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <>
                            <Ionicons name="paw" size={20} color="#fff"/>
                            <Text style={styles.uploadBtnText}>Upload Cat</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Uploads</Text>
                    <Text style={styles.sectionCount}>{myCats?.length ?? 0} cats</Text>
                </View>

                {catsLoading ? (
                    <ActivityIndicator color={theme.colors.primary} style={{marginTop: theme.spacing.lg}}/>
                ) : myCats?.length === 0 ? (
                    <EmptyState
                        icon="camera-outline"
                        title="No uploads yet"
                        subtitle="Your uploaded cats will appear here"
                    />
                ) : (
                    <View style={styles.grid}>
                        {myCats?.map((cat) => (
                            <View key={cat.id} style={{width: cardSize}}>
                                <CatCard cat={cat} votes={votes}/>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    scroll: {padding: theme.spacing.lg, gap: theme.spacing.md},
    title: {color: theme.colors.text, fontSize: theme.font.xxl, fontWeight: '800'},
    subtitle: {color: theme.colors.textMuted, fontSize: theme.font.md},
    dropZone: {
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        minHeight: 220,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
    },
    preview: {width: '100%', height: 300},
    placeholder: {alignItems: 'center', gap: theme.spacing.sm, padding: theme.spacing.xl},
    placeholderText: {color: theme.colors.textMuted, fontSize: theme.font.md, fontWeight: '500'},
    placeholderSub: {color: theme.colors.textMuted, fontSize: theme.font.xs},
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        backgroundColor: `${theme.colors.error}22`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: `${theme.colors.error}44`,
    },
    errorText: {color: theme.colors.error, fontSize: theme.font.sm, flex: 1},
    clearBtn: {alignSelf: 'center'},
    clearText: {color: theme.colors.textMuted, fontSize: theme.font.sm, textDecorationLine: 'underline'},
    uploadBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.full,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },
    uploadBtnDisabled: {opacity: 0.4},
    uploadBtnText: {color: '#fff', fontSize: theme.font.md, fontWeight: '700'},
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    sectionTitle: {color: theme.colors.text, fontSize: theme.font.lg, fontWeight: '700'},
    sectionCount: {color: theme.colors.textMuted, fontSize: theme.font.sm},
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
});