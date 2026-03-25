import React from 'react';
import {
    FlatList,
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    RefreshControl,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CatCard } from '../components/CatCard';
import { EmptyState } from '../components/EmptyState';
import { useFavourites } from '../hooks/useFavourites';
import { useVotes } from '../hooks/useVotes';
import { theme } from '../constants/theme';

export const FavouritesScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const { data: favourites, isLoading, refetch, isRefetching } = useFavourites();
    const { data: votes } = useVotes();

    const numColumns = width >= 600 ? 4 : width >= 400 ? 2 : 1;
    const cardSize = (width - theme.spacing.md * 2 - (numColumns - 1) * theme.spacing.sm) / numColumns;

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>❤️ Favourites</Text>
                <Text style={styles.headerCount}>{favourites?.length ?? 0} saved</Text>
            </View>
            <FlatList
                data={favourites}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
                }
                renderItem={({ item }) => (
                    <View style={{ width: cardSize }}>
                        <CatCard cat={item.image} votes={votes} />
                    </View>
                )}
                ListEmptyComponent={
                    <EmptyState
                        icon="heart-outline"
                        title="No favourites yet"
                        subtitle="Tap the heart on any cat to save it here"
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '700' },
    headerCount: { color: theme.colors.textMuted, fontSize: theme.font.sm },
    list: { padding: theme.spacing.md, gap: theme.spacing.sm },
    row: { gap: theme.spacing.sm },
});