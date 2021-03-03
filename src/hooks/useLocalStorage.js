import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
    const [ currentValue, setCurrentValue ] = useState(localStorage.getItem(key));

    useEffect(() => {
        const handler = e => {
            if (e.storageArea === localStorage && e.key === key) {
                setCurrentValue(e.newValue);
            }
        }

        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    });

    useEffect(() => {
        if(currentValue) {
            localStorage.setItem(key, currentValue);
        } else {
            localStorage.removeItem(key);
        }
    }, [key, currentValue]);

    return [JSON.parse(currentValue), setCurrentValue];
}

export default useLocalStorage;