import Cookies from "js-cookie";
import { NanostreamConfig } from "../config/nanostream.config";

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

export const sendStreamReq = async (url, options = {}) => {
    try {
        const apiKey = NanostreamConfig.API_KEY;
        const headers = {
            ...options.headers,
            'X-BINTU-APIKEY': apiKey
        }

        return fetch(url, {
            ...options,
            headers
        });
    } catch (error) {
        console.error('[Send Req Stream Error]: ', error);
    }   
}

export const convertToTimeFormatHHMMSS = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(remainingSeconds).padStart(2, '0'),
    ].join(':');

    return formattedTime;
}

export const timeClockStream = (inputTime) => {
    const newTime = new Date(inputTime);
    const now = new Date();
    const differentTime = Math.abs(now.getTime() - newTime.getTime());

    const hours = Math.floor(differentTime/(1000*60*60));
    const minutes = Math.floor((differentTime%(1000*60*60))/(1000*60));
    const seconds = Math.floor((differentTime%(1000*60))/1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}