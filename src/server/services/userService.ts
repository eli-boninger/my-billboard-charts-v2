
import type { SpotifyTopResultItem } from "../models/spotifyApiModels";
import { TopItemType, Prisma, PrismaClient } from "@prisma/client";
import type { TopItemRank, User, TopItem } from "@prisma/client";

const prisma = new PrismaClient();

export type TopItemAndRank =
    TopItemRank & TopItem

export const getTopItemsByUserId = async (id: User["id"], topItemType: TopItemType = TopItemType.TRACK): Promise<TopItemAndRank[]> => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    const items = await prisma.$queryRaw<Array<TopItemAndRank>>(Prisma.sql`
        SELECT  ti.*, tir.*
        FROM    top_item ti INNER JOIN
                (
                    SELECT  top_item_id,
                            MAX(created_at) MaxDate
                    FROM    top_item_rank
                    GROUP BY top_item_id
                ) MaxDates ON ti.id = MaxDates.top_item_id INNER JOIN
                top_item_rank tir ON   MaxDates.top_item_id = tir.top_item_id
                            AND MaxDates.MaxDate = tir.created_at
        WHERE ti.user_id = ${id} AND ti.is_currently_ranked = TRUE AND ti.top_item_type::text = ${topItemType};
    `);
    return items.sort((a, b) => a.rank - b.rank)
}

export const setAllItemsUnranked = async (userId: User["id"], topItemType: TopItemType = TopItemType.TRACK) => {
    return await prisma.topItem.updateMany({
        where: {
            isCurrentlyRanked: true,
            userId,
            topItemType,
        },
        data: {
            isCurrentlyRanked: false
        }
    })
}

export const upsertTopItem = async (item: SpotifyTopResultItem, newRank: number, userId: User["id"], topItemType: TopItemType = TopItemType.TRACK, existingRecordRank?: number) => {
    return await prisma.topItem.upsert({
        where: { spotifyId_userId_topItemType: { spotifyId: item.id, userId, topItemType } },
        update: {
            isCurrentlyRanked: true,
            topItemRanks: {
                create: [
                    { rank: newRank, previousRank: existingRecordRank ?? null }
                ]
            },
        },
        create: {
            name: item.name,
            userId: userId,
            isCurrentlyRanked: true,
            topItemRanks: {
                create: [
                    { rank: newRank }
                ]
            },
            spotifyId: item.id,
            album: item.album?.name,
            artists: item.artists?.map(a => a.name) ?? [],
            topItemType,
        },
        include: {
            topItemRanks: true
        }
    })
}

export const getTopArtists = async (userId: string): Promise<TopItemAndRank[]> => {
    const artists = await getTopItemsByUserId(userId, TopItemType.ARTIST);
    if (!!artists && artists.length > 0) {
        return artists;
    }
    return [];
}

export const getTopTracks = async (userId: string): Promise<TopItemAndRank[]> => {
    const tracks = await getTopItemsByUserId(userId, TopItemType.TRACK);
    if (!!tracks && tracks.length > 0) {
        return tracks;
    }
    return [];
}