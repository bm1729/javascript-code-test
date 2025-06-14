import axios from 'axios';

export class MyApiClient {
  constructor(private baseURL: string) {}

  async getBooks(author: string) {
    const response = await axios.get(`${this.baseURL}/books`, {
      params: { author },
    });
    return response.data;
  }
}
