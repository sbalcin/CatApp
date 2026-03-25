import {create} from 'zustand';

interface FavouritesState {
    favouriteMap: Record<string, number>;
    setFavourite: (imageId: string, favouriteId: number) => void;
    removeFavourite: (imageId: string) => void;
    hydrate: (favourites: { image_id: string; id: number }[]) => void;
    isFavourited: (imageId: string) => boolean;
    getFavouriteId: (imageId: string) => number | undefined;
}

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
    favouriteMap: {},

    setFavourite: (imageId, favouriteId) =>
        set((state) => ({
            favouriteMap: {...state.favouriteMap, [imageId]: favouriteId},
        })),

    removeFavourite: (imageId) =>
        set((state) => {
            const next = {...state.favouriteMap};
            delete next[imageId];
            return {favouriteMap: next};
        }),

    hydrate: (favourites) => {
        const map: Record<string, number> = {};
        favourites.forEach((f) => {
            map[f.image_id] = f.id;
        });
        set({favouriteMap: map});
    },

    isFavourited: (imageId) => imageId in get().favouriteMap,
    getFavouriteId: (imageId) => get().favouriteMap[imageId],
}));