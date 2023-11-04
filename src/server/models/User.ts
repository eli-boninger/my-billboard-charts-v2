import { Schema, InferSchemaType } from "mongoose";
import mongoose from "mongoose";

const TopItemTypesArray = ['artist', 'track']

const TopItemRankSchema = new Schema({
    rank: { type: Number, required: true },
    previousRank: Number
}, {timestamps: true})

const TopItemSchema = new Schema({
    spotifyId: { type: String, required: true },
    name: { type: String, required: true },
    isCurrentlyRanked: { type: Boolean, default: true },
    topItemRanks: [TopItemRankSchema],
    topItemType: { type: String, enum: TopItemTypesArray },
    album: String,
    artists: [String]
}, { timestamps: true })

TopItemSchema.index({ spotifyId: 1, topItemType: 1}, {unique: true})

const UserSchema = new Schema({
    email: { type: String, required: true },
    spotifyAuthorized: { type: Boolean, default: false, required: true },
    spotifyRefreshToken: String,
    lastUpdateJob: Date,
    topItems: [TopItemSchema]
}, {timestamps: true})

// export type User = InferSchemaType<typeof UserSchema>;
// export type TopItemRank = InferSchemaType<typeof TopItemRankSchema>;
// export type TopItem = InferSchemaType<typeof TopItemSchema>;
// export type TopItemType = 'artist' | 'track';

export const User = mongoose.model('User', UserSchema);