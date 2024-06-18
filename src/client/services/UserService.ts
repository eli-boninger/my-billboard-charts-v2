import axios from "axios";

export default class UserService {
    static _instance: UserService;
    API_URL = `${import.meta.env.VITE_API_URL}/user`;

    private constructor() { }

    public static get instance(): UserService {
        if (!UserService._instance) {
            UserService._instance = new UserService();
        }
        return UserService._instance;
    }

    async getUserSession(): Promise<boolean> {
        try {
            const res = await axios.get(`${this.API_URL}/session`);
            return Boolean(res.data)
        } catch (err) {
            return false;
        }
    };
}