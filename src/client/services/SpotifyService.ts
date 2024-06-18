import axios, { AxiosError } from "axios";
import { redirect } from "react-router-dom";

export default class SpotifyService {
  static _instance: SpotifyService;
  API_URL = `${import.meta.env.VITE_API_URL}/spotify`;

  private constructor() { }

  public static get instance(): SpotifyService {
    if (!SpotifyService._instance) {
      SpotifyService._instance = new SpotifyService();
    }
    return SpotifyService._instance;
  }

  async authorizeSpotify() {
    const res = await axios.post(`${this.API_URL}/authorize`);
    window.location = res.data;
  };



  async getSpotifySession() {
    try {
      const res = await axios.get(`${this.API_URL}/session`);
      return Boolean(res.data)
    } catch (err) {
      return false;
    }
  };

  async getTopItems(itemPath: string): Promise<TopItem[]> {
    try {
      const res = await axios.get(`${this.API_URL}/top_${itemPath}`)
      return res.data;
    } catch (e) {
      console.error(e);
      if (e instanceof AxiosError) {
        redirect('/login')
      }
    }

  }

  async getTopItemDetails(itemId: string): Promise<TopItemDetails> {
    try {
      const res = await axios.get(`${this.API_URL}/top_items/${itemId}/details`);
      return res.data;
    } catch (e) {
      console.error(e);
      if (e instanceof AxiosError) {
        redirect('/login')
      }
    }

  }
}