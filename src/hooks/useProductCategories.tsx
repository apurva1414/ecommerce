import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

export interface ICategory {
    name: string;
}

const fetchCategories = async (): Promise<ICategory[]> => {
    const response = await axios.get('https://dummyjson.com/products/category-list');
    return response.data;
};

const useProductCategories = (): UseQueryResult<ICategory[]> => {
    return useQuery<ICategory[], Error>(
        'categories',
        fetchCategories,
        {
            keepPreviousData: true,
        }
    );
};

export default useProductCategories;
