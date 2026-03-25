import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {CatCard} from '../components/CatCard';
import {EmptyState} from '../components/EmptyState';
import {SkeletonGrid} from '../components/SkeletonGrid';
import {useSearchCats} from '../hooks/useCats';
import {useVotes} from '../hooks/useVotes';
import {useFavourites} from '../hooks/useFavourites';
import {theme} from '../constants/theme';

export const HomeScreen: React.FC = () => {
    const {width} = useWindowDimensions();
    const {data: cats, isLoading, isError, refetch, isRefetching} = useSearchCats(20);
    const {data: votes} = useVotes();
    useFavourites();

    const numColumns = width >= 600 ? 4 : width >= 400 ? 2 : 1;
    const cardSize = (width - theme.spacing.md * 2 - (numColumns - 1) * theme.spacing.sm) / numColumns;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>🐱 Discover Cats</Text>
                </View>
                <SkeletonGrid count={6}/>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon="alert-circle-outline"
                title="Couldn't load cats"
                subtitle="Check your connection please"
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🐱 Discover Cats</Text>
                <TouchableOpacity
                    style={styles.refreshBtn}
                    onPress={() => refetch()}
                    disabled={isRefetching}
                >
                    <Ionicons
                        name="shuffle-outline"
                        size={20}
                        color={isRefetching ? theme.colors.textMuted : theme.colors.primary}
                    />
                    <Text style={[styles.refreshText, isRefetching && {color: theme.colors.textMuted}]}>
                        Shuffle
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cats}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={theme.colors.primary}
                    />
                }
                renderItem={({item}) => (
                    <View style={{width: cardSize}}>
                        <CatCard cat={item} votes={votes}/>
                    </View>
                )}
                ListEmptyComponent={
                    <EmptyState icon="paw-outline" title="No cats found" subtitle="Pull to refresh"/>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {color: theme.colors.text, fontSize: theme.font.xl, fontWeight: '700'},
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.primaryMuted,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.radius.full,
    },
    refreshText: {color: theme.colors.primary, fontSize: theme.font.sm, fontWeight: '600'},
    list: {padding: theme.spacing.md, gap: theme.spacing.sm},
    row: {gap: theme.spacing.sm},
});