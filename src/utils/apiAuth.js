import axios from 'axios';
import * as constants from './constants';

export const apiInstance = axios.create({
    baseURL: constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+"/api/v1/",
    timeout: 10000
});