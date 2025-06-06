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
        case "profile/select":
            loadProfile(message[1], user).then((profile) => {
                if (profile) apply((model) => ({ ...model, profile }));
            });
            break;

        case "trail/select":
            loadTrail(message[1], user).then((trail) => {
                if (trail) apply((model) => ({ ...model, trail }));
            });
            break;

        case "park/select":
            loadPark(message[1], user).then((park) => {
                if (park) apply((model) => ({ ...model, park }));
            });
            break;

        case "home/load":
            fetch("/data/featured.json")
                .then((res) => res.json())
                .then((featured: FeaturedSection[]) =>
                    apply((model) => ({ ...model, featured }))
                );
            break;

        default:
            throw new Error(`Unhandled message: ${message[0]}`);
    }
};

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
