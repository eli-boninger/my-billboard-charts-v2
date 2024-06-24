import { Request, Response } from "express";
import { auth } from "../main";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function verifyGoogleToken(req: Request & { cookies: any }, res: Response, next: () => void) {
    if (!!req.headers.authorization) {
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(req.headers.authorization?.split(' ')[1]);
        } catch (e) {
            return res.sendStatus(401);
        }

        let existingUser;
        try {
            existingUser = await prisma.user.findFirst({
                include: {
                    FederatedCredentials: {
                        where: {
                            subject: decodedToken?.sub,
                            provider: decodedToken?.iss
                        }
                    }
                }
            })
        } catch (err) {
            console.error(err)
            return res.status(500).send(err)
        }

        if (existingUser) {
            req.session.userId = existingUser.id;
        } else {
            try {
                const newUser = await prisma.user.create({
                    data: {
                        email: decodedToken.email || '',
                        FederatedCredentials: {
                            create: [
                                { provider: decodedToken.iss, subject: decodedToken.sub }
                            ]
                        }
                    }

                })
                req.session.userId = newUser.id;
            } catch (err) {
                console.error(err)
                return res.status(500).send(err)
            }
        }

        next();
    } else {
        res.sendStatus(401)
    }


}

export default verifyGoogleToken;