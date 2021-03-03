const StorageKeys = {
    USER: 'user',
};

const SetStorageItem = (key, value, persistent) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const GetStorageItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const RemoveStorageItem = (key) => {
    localStorage.removeItem(key);
}

export {
    StorageKeys,
    RemoveStorageItem,
    SetStorageItem,
    GetStorageItem
}