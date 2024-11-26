import axios from 'axios';

export const fetchWithProxy = async (url: string) => {
  const response = await axios.get(url, {
    proxy: {
      host: '45.196.48.9',
      port: 5435,
      auth: {
        username: 'jtzhwqur',
        password: 'jnf0t0n2tecg',
      },
    },
  });
  return response.data;
};
