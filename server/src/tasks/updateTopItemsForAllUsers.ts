import { PrismaClient, TopItemType, User } from "@prisma/client";
import type { SpotifyTopItemsRequestResult, SpotifyTopResultItem } from "../models/spotifyApiModels";
import { getTopItemsByUserId, setAllItemsUnranked, upsertTopItem } from "../services/userService";
import { logger } from "../main";

// const childLogger = logger.child({ service: 'updateTopItemsForAllUsers.ts' })

const prisma = new PrismaClient();

function getAllSpotifyAuthorizedUsers() {
    return prisma.user.findMany({ where: { spotifyAuthorized: true } });
}

export const updateTopItemsForAllUsers = async () => {
    logger.info("running updateTopItemsForAllUsers")

    const users = await getAllSpotifyAuthorizedUsers();
    const today = new Date();
    let updated = 0;
    users.forEach(u => {
        if (u.lastUpdateJob?.setHours(0, 0, 0, 0) !== today.setHours(0, 0, 0, 0)) {
            updateAllUserTopItems(u.id, u.spotifyRefreshToken)
            updated++;
        }
    })
    logger.info(`${updated} users' top items updated`);
}

const refreshAccessToken = async (refreshToken: User["spotifyRefreshToken"]) => {
    const params = new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
    });
    try {
        const res = await fetch(`https://accounts.spotify.com/api/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (res.status === 200) {
            const resultJson = await res.json();
            return resultJson?.access_token;
        }
    } catch (e) {
        console.error(e)
    }
}


const updateAllUserTopItems = async (id: User["id"], refreshToken: User["spotifyRefreshToken"]) => {
    const topTracks = await getTopItemsByUserId(id, TopItemType.TRACK);
    const topArtists = await getTopItemsByUserId(id, TopItemType.ARTIST)
    await setAllItemsUnranked(id, TopItemType.TRACK);
    await setAllItemsUnranked(id, TopItemType.ARTIST)

    let newTracksList: SpotifyTopResultItem[] = []
    let newArtistsList: SpotifyTopResultItem[] = []
    try {
        const refreshedToken = await refreshAccessToken(refreshToken);
        const tracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", { headers: { Authorization: `Bearer ${refreshedToken}`, } })
        const artistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term", { headers: { Authorization: `Bearer ${refreshedToken}`, } })
        newTracksList = (await tracksRes.json() as SpotifyTopItemsRequestResult)?.items
        newArtistsList = (await artistsRes.json() as SpotifyTopItemsRequestResult)?.items
    } catch (e) {
        console.error(e)
    }

    try {
        newTracksList.forEach((t, index) => {
            const previousRank = topTracks.find(tt => tt.spotifyId === t.id)?.rank
            upsertTopItem(t, index, id, TopItemType.TRACK, previousRank)
        })
        newArtistsList.forEach((a, index) => {
            upsertTopItem(a, index, id, TopItemType.ARTIST, topArtists.find(ta => ta.spotifyId === a.id)?.rank)
        })
        await prisma.user.update({ where: { id }, data: { lastUpdateJob: new Date() } })
    } catch (e) {
        console.error(e)
    }

}
