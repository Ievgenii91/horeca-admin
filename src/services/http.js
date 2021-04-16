import axios from 'axios';

const HOST = 'https://nestbn.herokuapp.com'
class HttpService {
  async get(url, params, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.get(HOST + '/api' + url, {
      params,
      headers,
    });
    return data;
  }

  async post(url, body, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.post(HOST + '/api' + url, body, {
      headers
    });
    return data;
  }
}

export default new HttpService();
