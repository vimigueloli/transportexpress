import axios from 'axios';

const setupApiClient = (ctx = undefined) => {

  const api = axios.create({
    baseURL:'https://ayasaude.herokuapp.com'
    // baseURL: 'https://1176-177-53-175-181.sa.ngrok.io/'
  });

  return api;
};

export { setupApiClient };
