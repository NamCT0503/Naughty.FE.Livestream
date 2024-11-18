import Cookies from "js-cookie";

export const sendReq = async (url, options = {}) => {
    const accessToken = Cookies.get('accessToken');

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        ...options,
        headers,
    });
};