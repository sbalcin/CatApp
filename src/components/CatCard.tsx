import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CatImage, Vote} from '../api/catApi';
import {useFavouritesStore} from '../store/favouritesStore';
import {useToggleFavourite} from '../hooks/useFavourites';
import {useScoreForImage, useVoteOnCat} from '../hooks/useVotes';
import {theme} from '../constants/theme';

interface CatCardProps {
    cat: CatImage;
    votes?: Vote[];
}

export const CatCard: React.FC<CatCardProps> = ({cat, votes}) => {
    const isFav = useFavouritesStore((s) => s.isFavourited(cat.id));
    const {toggle} = useToggleFavourite();
    const voteMutation = useVoteOnCat();
    const score = useScoreForImage(cat.id, votes);

    const heartScale = useRef(new Animated.Value(1)).current;
    const prevFav = useRef(isFav);

    useEffect(() => {
        if (isFav !== prevFav.current) {
            prevFav.current = isFav;
            Animated.sequence([
                Animated.spring(heartScale, {
                    toValue: isFav ? 1.4 : 0.8,
                    useNativeDriver: true,
                    speed: 40,
                    bounciness: 18,
                }),
                Animated.spring(heartScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 20,
                    bounciness: 8,
                }),
            ]).start();
        }
    }, [isFav]);

    const scoreScale = useRef(new Animated.Value(1)).current;
    const prevScore = useRef(score);

    useEffect(() => {
        if (score !== prevScore.current) {
            prevScore.current = score;
            Animated.sequence([
                Animated.spring(scoreScale, {
                    toValue: 1.35,
                    useNativeDriver: true,
                    speed: 40,
                    bounciness: 14,
                }),
                Animated.spring(scoreScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 20,
                }),
            ]).start();
        }
    }, [score]);

    return (
        <View style={styles.card}>
            <Image source={{uri: cat.url}} style={styles.image} resizeMode="cover"/>

            <TouchableOpacity
                style={styles.favButton}
                onPress={() => toggle(cat.id)}
                activeOpacity={0.8}
            >
                <Animated.View style={{transform: [{scale: heartScale}]}}>
                    <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFav ? theme.colors.primary : theme.colors.text}
                    />
                </Animated.View>
            </TouchableOpacity>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.voteBtn}
                    onPress={() => voteMutation.mutate({imageId: cat.id, value: 0})}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-down-circle" size={26} color={theme.colors.downvote}/>
                </TouchableOpacity>

                <Animated.View
                    style={[styles.scoreContainer, {transform: [{scale: scoreScale}]}]}
                >
                    <Text
                        style={[
                            styles.score,
                            score > 0 && styles.scorePos,
                            score < 0 && styles.scoreNeg,
                        ]}
                    >
                        {score > 0 ? `+${score}` : score}
                    </Text>
                    <Text style={styles.scoreLabel}>score</Text>
                </Animated.View>

                <TouchableOpacity
                    style={styles.voteBtn}
                    onPress={() => voteMutation.mutate({imageId: cat.id, value: 1})}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-up-circle" size={26} color={theme.colors.upvote}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: theme.colors.surfaceAlt,
    },
    favButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: theme.radius.full,
        padding: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    voteBtn: {padding: 4},
    scoreContainer: {alignItems: 'center'},
    score: {
        color: theme.colors.text,
        fontSize: theme.font.lg,
        fontWeight: '700',
    },
    scorePos: {color: theme.colors.upvote},
    scoreNeg: {color: theme.colors.downvote},
    scoreLabel: {
        color: theme.colors.textMuted,
        fontSize: theme.font.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});