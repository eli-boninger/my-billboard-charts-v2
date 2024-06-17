import { AxiosError } from "axios";
import { redirect } from "react-router-dom";

export const makeApiRequest = async (reqFunction: (...args: any[]) => any, ...args: any[]) => {
    try {
        const res = await reqFunction(...args)
        return res;
    } catch (e) {
        console.error(e)
        if (e instanceof AxiosError) {
            if (e.status === 401) {
                redirect('/')
            }
        }
    }
}