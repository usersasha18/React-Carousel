import axios from 'axios';

export async function useGetData(url = "http://localhost", type = "GET") {
    switch(type) {
        case "GET":
                const request = await axios.get(url);
                const data = await request.data;
                return data;
        default:
             return "неверный параметр запроса";
    }
}
