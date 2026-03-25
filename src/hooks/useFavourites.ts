import {useEffect} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import {addFavourite, fetchFavourites, removeFavourite} from '../api/catApi';
import {useFavouritesStore} from '../store/favouritesStore';

export const FAVS_KEY = ['favourites'];

export function useFavourites() {
    const {hydrate} = useFavouritesStore();
    const query = useQuery({
        queryKey: FAVS_KEY,
        queryFn: fetchFavourites,
        staleTime: 1000 * 60 * 2,
    });
    useEffect(() => {
        if (query.data) hydrate(query.data);
    }, [query.data]);
    return query;
}

export function useToggleFavourite() {
    const queryClient = useQueryClient();
    const {
        setFavourite,
        removeFavourite: removeFromStore,
        isFavourited,
        getFavouriteId,
    } = useFavouritesStore();

    const add = useMutation({
        mutationFn: addFavourite,
        onMutate: async (imageId: string) => {
            setFavourite(imageId, -1);
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
        onSuccess: (data, imageId) => {
            setFavourite(imageId, data.id);
            void queryClient.invalidateQueries({queryKey: FAVS_KEY});
        },
        onError: (_, imageId) => {
            removeFromStore(imageId);
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });

    const remove = useMutation({
        mutationFn: (args: { imageId: string; favId: number }) => removeFavourite(args.favId),
        onMutate: async ({imageId}) => {
            removeFromStore(imageId);
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: FAVS_KEY});
        },
        onError: (_,) => {
            void queryClient.invalidateQueries({queryKey: FAVS_KEY});
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });

    const toggle = (imageId: string) => {
        if (isFavourited(imageId)) {
            const favId = getFavouriteId(imageId)!;
            remove.mutate({imageId, favId});
        } else {
            add.mutate(imageId);
        }
    };

    return {toggle, isLoading: add.isPending || remove.isPending};
}