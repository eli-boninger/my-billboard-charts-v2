import axios from "axios";
import { makeApiRequest } from "./ApiService";


export default class SpotifyService {
  static _instance: SpotifyService;
  API_URL = `${import.meta.env.VITE_API_URL}`;

  private constructor() { }

  public static get instance(): SpotifyService {
    if (!SpotifyService._instance) {
      SpotifyService._instance = new SpotifyService();
    }
    return SpotifyService._instance;
  }

  async authorizeSpotify() {
    const res = await axios.post(`${this.API_URL}/spotify/authorize`);
    window.location = res.data;
  };

  async getUserSession(): Promise<boolean> {
    try {
      const res = await axios.get(`${this.API_URL}/user/session`);
      return Boolean(res.data)
    } catch (err) {
      return false;
    }
  };

  async getUserSpotifySession() {
    try {
      const res = await axios.get(`${this.API_URL}/spotify/session`);
      return Boolean(res.data)
    } catch (err) {
      return false;
    }
  };

  async getUserTopItems(itemPath: string): Promise<TopItem[]> {
    const res = await makeApiRequest(() => axios.get(`${this.API_URL}/spotify/top_${itemPath}`))
    return res.data;
  }

  async getTopItemDetails(itemId: string): Promise<TopItemDetails> {
    const res = await makeApiRequest(() => axios.get(`${this.API_URL}/spotify/top_items/${itemId}/details`));
    return res.data;
  }
}