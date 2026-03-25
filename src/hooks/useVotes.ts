import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import {fetchVotes, Vote, voteOnCat} from '../api/catApi';

export const VOTES_KEY = ['votes'];

export function useVotes() {
    return useQuery({
        queryKey: VOTES_KEY,
        queryFn: fetchVotes,
        staleTime: 1000 * 60 * 2,
    });
}

export function useScoreForImage(imageId: string, votes: Vote[] | undefined): number {
    if (!votes) return 0;
    return votes
        .filter((v) => v.image_id === imageId)
        .reduce((acc, v) => acc + (v.value === 1 ? 1 : -1), 0);
}

export function useVoteOnCat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({imageId, value}: { imageId: string; value: 1 | 0 }) =>
            voteOnCat(imageId, value),

        onMutate: async ({imageId, value}) => {
            await queryClient.cancelQueries({queryKey: VOTES_KEY});
            const previous = queryClient.getQueryData<Vote[]>(VOTES_KEY);

            queryClient.setQueryData<Vote[]>(VOTES_KEY, (old = []) => [
                ...old,
                {id: Date.now(), image_id: imageId, value, sub_id: 'optimistic'},
            ]);

            void Haptics.impactAsync(
                value === 1
                    ? Haptics.ImpactFeedbackStyle.Medium
                    : Haptics.ImpactFeedbackStyle.Light
            );

            return {previous};
        },

        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(VOTES_KEY, context.previous);
            }
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },

        onSettled: () => {
            void queryClient.invalidateQueries({queryKey: VOTES_KEY});
        },
    });
}