export type Msg =
    | ["profile/select", { userid: string }]
    | ["trail/select", { trailid: string }]
    | ["park/select", { parkid: string }]
    | ["home/load", Record<string, never>];
