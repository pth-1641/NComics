import axios from 'axios';

export const useAxios = async (path: string): Promise<any> => {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseURl;
    const { data } = await axios.get(baseUrl + path);
    return data;
  } catch (err) {
    console.log(err);
  }
};
