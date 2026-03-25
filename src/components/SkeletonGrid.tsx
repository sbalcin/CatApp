import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, useWindowDimensions, View} from 'react-native';
import {theme} from '../constants/theme';

const SkeletonBox: React.FC<{ width: number; height: number; borderRadius?: number }> = ({
                                                                                             width,
                                                                                             height,
                                                                                             borderRadius = 8,
                                                                                         }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {toValue: 1, duration: 800, useNativeDriver: true}),
                Animated.timing(opacity, {toValue: 0.3, duration: 800, useNativeDriver: true}),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{width, height, borderRadius, backgroundColor: theme.colors.surfaceAlt, opacity}}
        />
    );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({count = 6}) => {
    const {width} = useWindowDimensions();
    const numColumns = width >= 600 ? 4 : width >= 400 ? 2 : 1;
    const cardSize =
        (width - theme.spacing.md * 2 - (numColumns - 1) * theme.spacing.sm) / numColumns;

    return (
        <View style={styles.grid}>
            {Array.from({length: count}).map((_, i) => (
                <View key={i} style={{width: cardSize, gap: theme.spacing.xs}}>
                    <SkeletonBox width={cardSize} height={cardSize} borderRadius={theme.radius.lg}/>
                    <View style={styles.footer}>
                        <SkeletonBox width={28} height={28} borderRadius={14}/>
                        <SkeletonBox width={40} height={20} borderRadius={4}/>
                        <SkeletonBox width={28} height={28} borderRadius={14}/>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        padding: theme.spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
    },
});