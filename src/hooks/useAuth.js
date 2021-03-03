import useLocalStorage from './useLocalStorage';

const useAuth = () => {
    const [ user ] = useLocalStorage('user');
    return { ...user };
}

export default useAuth;