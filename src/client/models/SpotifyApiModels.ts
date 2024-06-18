interface TopItem {
    album?: string;
    artists?: string[];
    createdAt: Date;
    id: string;
    isCurrentlyRanked: boolean;
    name: string;
    previousRank?: number;
    rank: number;
    spotifyId: string;
    topItemId: string;
    topItemRanks?: TopItemRank[];
    topItemType: TopItemType;
    updatedAt: Date;
    userId: string;
}

