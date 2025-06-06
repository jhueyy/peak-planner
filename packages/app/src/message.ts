// packages/app/src/message.ts

import { Trail } from "server/models";

export type Msg =
    // Existing “profile” and “select” messages
    | ["profile/select", { userid: string }]
    | ["trail/select", { trailid: string }]
    | ["park/select", { parkid: string }]
    | ["home/load", Record<string, never>]

    // ─── New “trail/save” message for Lab 15 ───
    | [
        "trail/save",
        {
            trailid: string;                      // which trail to update
            updated: Partial<Trail>;              // fields to send in the PUT body
            onSuccess?: () => void;               // callback if the PUT succeeds
            onFailure?: (err: Error) => void;     // callback if the PUT fails
        }
    ];
