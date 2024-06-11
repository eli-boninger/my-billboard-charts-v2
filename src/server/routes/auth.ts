import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import formidable from 'express-formidable';

import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const client = new OAuth2Client();

const authRouter = express.Router();

async function verify(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload!['sub'];
    return { userId, payload };
}


authRouter.use(formidable())


authRouter.post('/login', async (req: any, res: Response) => {
    const { g_csrf_token: csrfTokenCookie } = req.cookies;
    const { g_csrf_token: tokenBody, credential } = req.fields;

    if (!csrfTokenCookie) {
        return res.status(400).send("No CSRF token in cookie.")
    }
    if (!credential) {
        return res.status(400).send("No credential included in post body");
    }
    if (!tokenBody) {
        return res.status(400).send("No CSRF token in post body.")
    }
    if (csrfTokenCookie !== tokenBody) {
        return res.status(400).send("Failed to verify double submit cookie.")
    }

    try {
        const { userId, payload } = await verify(credential);
        if (!payload?.iss || !payload.email) {
            return res.status(500).send("Payload incorrect")
        }

        let existingUser;
        try {
            existingUser = await prisma.user.findFirst({
                include: {
                    FederatedCredentials: {
                        where: {
                            subject: userId,
                            provider: payload?.iss
                        }
                    }
                }
            })
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }

        if (existingUser) {
            req.session.userId = existingUser.id;
        } else {
            try {
                const newUser = await prisma.user.create({
                    data: {
                        email: payload.email,
                        FederatedCredentials: {
                            create: [
                                { provider: payload.iss, subject: userId }
                            ]
                        }
                    }

                })
                req.session.userId = newUser.id;
            } catch (err) {
                console.error(err)
                res.status(500).send(err)
            }
        }

        req.session.googleId = userId;
        res.cookie('google_auth_token', credential)
        return res.redirect('/tracks');
    } catch (err) {
        console.error(err)
        return res.status(500).send("Error during token validation");
    }
})

export default authRouter;