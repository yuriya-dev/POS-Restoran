/**
 * Custom React Hooks untuk Performance
 */

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * useDebounce - Delay state update untuk mengurangi re-renders
 * Berguna untuk search/filter input
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

/**
 * useThrottle - Batasi execution frequency
 * Berguna untuk scroll/resize events
 */
export const useThrottle = (callback, delay = 500) => {
    const lastRun = useRef(Date.now());

    return useCallback((...args) => {
        const now = Date.now();
        if (now - lastRun.current >= delay) {
            callback(...args);
            lastRun.current = now;
        }
    }, [callback, delay]);
};

/**
 * usePrevious - Track previous value
 * Useful untuk comparing old vs new props
 */
export const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

/**
 * useAsync - Handle async operations dengan loading/error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error);
            setStatus('error');
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error };
};

/**
 * useLocalStorage - Persist state ke localStorage
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
};

/**
 * useMounted - Check if component sudah mounted
 * Prevent state updates setelah unmount
 */
export const useMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    return isMounted;
};
