import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY ?? '';
const BASE_URL = process.env.EXPO_PUBLIC_CAT_API_BASE_URL ?? 'https://api.thecatapi.com/v1';
let SUB_ID = 'fallback-id';
export const setSubId = (id: string) => {
    SUB_ID = id;
};

export const catClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
    },
});

export interface CatImage {
    id: string;
    url: string;
    width: number;
    height: number;
    breeds?: Breed[];
    favourite?: { id: number };
}

export interface Breed {
    id: string;
    name: string;
    temperament: string;
    origin: string;
    life_span: string;
    wikipedia_url?: string;
}

export interface Vote {
    id: number;
    image_id: string;
    value: number;
    sub_id: string;
}

export interface Favourite {
    id: number;
    image_id: string;
    sub_id: string;
    image: CatImage;
}

export const fetchSearchImages = async (limit = 20): Promise<CatImage[]> => {
    const {data} = await catClient.get('/images/search', {
        params: {limit, order: 'RAND', has_breeds: 0},
    });
    return data;
};

export const fetchMyImages = async (): Promise<CatImage[]> => {
    const {data} = await catClient.get('/images', {
        params: {limit: 100, sub_id: SUB_ID, order: 'DESC'},
    });
    return data;
};

export const uploadImage = async (uri: string): Promise<CatImage> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'cat.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {uri, name: filename, type} as any);
    formData.append('sub_id', SUB_ID);

    const {data} = await catClient.post('/images/upload', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
    });
    return data;
};

export const fetchVotes = async (): Promise<Vote[]> => {
    const {data} = await catClient.get('/votes', {
        params: {sub_id: SUB_ID, limit: 100},
    });
    return data;
};

export const voteOnCat = async (imageId: string, value: 1 | 0): Promise<void> => {
    await catClient.post('/votes', {image_id: imageId, sub_id: SUB_ID, value});
};

export const fetchFavourites = async (): Promise<Favourite[]> => {
    const {data} = await catClient.get('/favourites', {
        params: {sub_id: SUB_ID, limit: 100},
    });
    return data;
};

export const addFavourite = async (imageId: string): Promise<{ id: number }> => {
    const {data} = await catClient.post('/favourites', {image_id: imageId, sub_id: SUB_ID});
    return data;
};

export const removeFavourite = async (favouriteId: number): Promise<void> => {
    await catClient.delete(`/favourites/${favouriteId}`);
};