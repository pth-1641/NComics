export const useData = async (path: string): Promise<any> => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL as string;
    const { data } = await useFetch(path, {
      baseURL,
      method: 'GET',
    });
    return data.value;
  } catch (err) {
    console.log(err);
  }
};
