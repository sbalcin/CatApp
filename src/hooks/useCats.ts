import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchMyImages, fetchSearchImages, uploadImage} from '../api/catApi';

export const MY_CATS_KEY = ['my-cats'];
export const SEARCH_CATS_KEY = ['search-cats'];

export function useSearchCats(limit = 20) {
    return useQuery({
        queryKey: SEARCH_CATS_KEY,
        queryFn: () => fetchSearchImages(limit),
        staleTime: 1000 * 60 * 5,
    });
}

export function useMyCats() {
    return useQuery({
        queryKey: MY_CATS_KEY,
        queryFn: fetchMyImages,
        staleTime: 1000 * 60 * 2,
    });
}

export function useUploadCat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (uri: string) => uploadImage(uri),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: MY_CATS_KEY });
        },
    });
}