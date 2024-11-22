import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { FormatRefreshTime } from "../components/crud/refresh";
import FetchData from "../api/fetch-data";
import { Session } from "next-auth";

export interface ItemContextProps<T> {
    items: T[];
    filterItems?: (key: keyof T, value: string) => T[];
    fetchData: (id?: string) => void;
    setItemsState: (items: T[]) => void;
    addItem: (product: T) => void;
    removeItem: (id: string) => void;
    updateLastUpdate: () => void;
    getError: () => string | null;
    getLoading: () => boolean;
    getLastUpdate: () => string;
}

interface GenericProviderProps<T> {
    getItems: (session: Session) => Promise<T[]>
}

const GenericProvider = <T extends { id: string },>({ getItems }: GenericProviderProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const { data } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const formattedTime = FormatRefreshTime(new Date())
    const [lastUpdate, setLastUpdate] = useState<string>(formattedTime);
    const idToken = data?.user.idToken;

    const fetchData = useCallback(async () => {
        if (!idToken) return; // Use a variável simplificada
        FetchData({ getItems, setItems, data, setError, setLoading });
    }, [idToken, getItems, setItems, data, setError, setLoading]); // Inclua todas as dependências necessárias


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filterItems = (key: keyof T, value: string) => {
        if (!value) return items;
        return items.filter((item) => String(item[key]).toLowerCase().includes(value.toLowerCase()));
    }

    const setItemsState = (items: T[]) => {
        setItems(items);
    }

    const addItem = (item: T) => {
        setItems((prev) => [...prev, item]);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateLastUpdate = () => setLastUpdate(FormatRefreshTime(new Date()));

    const getError = () => error;
    const getLoading = () => loading;
    const getLastUpdate = () => lastUpdate;

    return { items, fetchData, filterItems, setItemsState, addItem, removeItem, updateLastUpdate, getError, getLoading, getLastUpdate }
}

export default GenericProvider