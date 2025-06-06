// packages/app/src/update.ts

import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./message";
import { Model, FeaturedSection } from "./model";
import { Trail, Park, Traveler } from "server/models";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
): void {
    switch (message[0]) {
        case "profile/select": {
            // existing profile‐loading logic
            const { userid } = message[1] as { userid: string };
            loadProfile({ userid }, user).then((profile) => {
                if (profile) apply((m) => ({ ...m, profile }));
            });
            break;
        }

        case "trail/select": {
            // existing trail‐loading logic
            const { trailid } = message[1] as { trailid: string };
            loadTrail({ trailid }, user).then((trail) => {
                if (trail) apply((m) => ({ ...m, trail }));
            });
            break;
        }

        // ─── New “trail/save” case for Lab 15 ───
        case "trail/save": {
            // 1) Unpack the payload
            const {
                trailid,
                updated,
                onSuccess,
                onFailure,
            } = message[1] as {
                trailid: string;
                updated: Partial<Trail>;
                onSuccess?: () => void;
                onFailure?: (err: Error) => void;
            };

            // 2) Send a PUT to /api/trails/:trailid, including auth header + JSON body
            fetch(`/api/trails/${trailid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
                body: JSON.stringify(updated),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to save trail ${trailid}`);
                    }
                    return res.json();
                })
                .then((json: unknown) => {
                    // 3) If the server returned the updated Trail, update model.trail
                    if (json) {
                        const updatedTrail = json as Trail;
                        apply((m) => ({ ...m, trail: updatedTrail }));
                    }
                })
                .then(() => {
                    // 4) On success, invoke the onSuccess callback if provided
                    if (onSuccess) onSuccess();
                })
                .catch((err: Error) => {
                    // 5) On failure, invoke the onFailure callback if provided
                    if (onFailure) onFailure(err);
                });

            break;
        }
        // ──────────────────────────────────────────

        case "park/select": {
            // existing park‐loading logic
            const { parkid } = message[1] as { parkid: string };
            loadPark({ parkid }, user).then((park) => {
                if (park) apply((m) => ({ ...m, park }));
            });
            break;
        }

        case "home/load": {
            // existing “home/load” → fetch featured.json
            fetch("/data/featured.json")
                .then((res) => res.json())
                .then((featured: FeaturedSection[]) =>
                    apply((m) => ({ ...m, featured }))
                );
            break;
        }

        default: {
            // If you ever dispatch a message not handled above, this will throw.
            const unhandled: never = message[0];
            throw new Error(`Unhandled message: ${unhandled}`);
        }
    }
}

// ========== Helpers ==========

function loadProfile(
    { userid }: { userid: string },
    user: Auth.User
): Promise<Traveler | undefined> {
    return fetch(`/api/travelers/${userid}`, {
        headers: Auth.headers(user),
    }).then((res) => (res.ok ? res.json() : undefined));
}

function loadTrail(
    { trailid }: { trailid: string },
    user: Auth.User
): Promise<Trail | undefined> {
    return fetch(`/api/trails/${trailid}`, {
        headers: Auth.headers(user),
    }).then((res) => (res.ok ? res.json() : undefined));
}

function loadPark(
    { parkid }: { parkid: string },
    user: Auth.User
): Promise<Park | undefined> {
    return fetch(`/api/parks/${parkid}`, {
        headers: Auth.headers(user),
    }).then((res) => (res.ok ? res.json() : undefined));
}
