import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => (
    <View style={styles.container}>
        <Ionicons name={icon} size={64} color={theme.colors.border} />
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.font.lg,
        fontWeight: '600',
        textAlign: 'center',
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: theme.font.sm,
        textAlign: 'center',
    },
});