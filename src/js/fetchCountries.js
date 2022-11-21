import axios from "axios";

export const fetchImages = async (inputValue, page) => {
    const BASE_URL = 'https://pixabay.com/api/';
    const BASE_PARAMS = `?key=31432345-842eedf1cadf98cbef968cc4e&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`;
    try {
    const response = await axios.get(`${BASE_URL}${BASE_PARAMS}`);
    const imagesList = response.data;
    if(!response.ok) {
        if (response.status === 404) {
            return [];
        }
    }
    return await imagesList;
    } catch (errors) {
    console.error(errors);
    }
    };
