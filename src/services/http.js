import axios from 'axios';
class HttpService {
  async get(url, params, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.get(window.config.apiServer + '/api' + url, {
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
    const { data } = await axios.post(window.config.apiServer + '/api' + url, body, {
      headers,
    });
    return data;
  }

  async patch(url, body, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.patch(window.config.apiServer + '/api' + url, body, {
      headers,
    });
    return data;
  }

  async delete(url, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.delete(window.config.apiServer + '/api' + url, {
      headers,
    });
    return data;
  }
}

export default new HttpService();
