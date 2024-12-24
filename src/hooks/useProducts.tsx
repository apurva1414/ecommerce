import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

interface IDimensions {
    width: number;
    height: number;
    depth: number;
}

interface IReview {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

interface IProductMeta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}

export interface IProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: IDimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: IReview[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: IProductMeta;
    images: string[];
    thumbnail: string;
}

interface IProductsResponse {
    products: IProduct[];
    total: number;
    skip: number;
    limit: number;
}


const fetchProducts = async (limit: number, category: string, skip: number): Promise<IProductsResponse> => {
    const url = category === 'all'
        ? 'https://dummyjson.com/products'
        : `https://dummyjson.com/products/category/${category}`;

    const response = await axios.get(url, {
        params: { limit, skip },
    });
    return response.data;
};

const useProducts = (limit: number, category: string, skip: number): UseQueryResult<IProductsResponse> => {
    return useQuery<IProductsResponse, Error>(
        ['products', limit, category, skip],
        () => fetchProducts(limit, category, skip),
        {
            keepPreviousData: true,
        }
    );
};

export default useProducts;
