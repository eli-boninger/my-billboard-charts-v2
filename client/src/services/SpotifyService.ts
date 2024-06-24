import axios from "axios";
import { User } from "firebase/auth";

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

  private async makeRequest(path: string, user: User, method = 'get', body = {}) {
    const token = await user.getIdToken()
    if (!token) {
      return false;
    }
    return await axios.request(
      {
        url: `${this.API_URL}${path}`,
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: body
      }
    )
  }

  async authorizeSpotify(user: User) {
    return this.makeRequest('/authorize', user)
  };

  async getSpotifySession(user: User) {
    const res = await this.makeRequest('/session', user)
    return Boolean(res === false ? false : res.data)
  };

  async getTopItems(itemPath: string, user: User): Promise<TopItem[] | null> {
    const res = await this.makeRequest(`/top_${itemPath}`, user)
    return res ? res.data : null;
  }

  async getTopItemDetails(itemId: string, user: User): Promise<TopItemDetails> {
    const res = await this.makeRequest(`/top_items/${itemId}/details`, user);
    return res ? res.data : null;
  }

}