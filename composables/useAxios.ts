import axios from 'axios';

export const useAxios = async (path: string): Promise<any> => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL as string;
    const { data } = await axios.get(baseURL + path);
    return data;
  } catch (err) {
    console.log(err);
  }
};
