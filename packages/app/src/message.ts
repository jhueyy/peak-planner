import { Traveler } from "server/models";

export type Msg =
    | ["profile/save", { userid: string; profile: Traveler }]
    | ["profile/select", { userid: string }]
    | ["trail/select", { trailid: string }]
    | ["park/select", { parkid: string }]
    | ["home/load", Record<string, never>];
