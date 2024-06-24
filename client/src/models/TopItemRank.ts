interface TopItemRank {
    id: string;
    createdAt: Date;
    previousRank: number | null;
    rank: number;
    topItemId: string;
}