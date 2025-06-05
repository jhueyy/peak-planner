import { Trail, Park, Traveler } from "server/models";

export interface FeaturedSection {
    icon: string;
    heading: string;
    items: {
        label: string;
        href: string;
    }[];
}

export interface Model {
    trail?: Trail;
    park?: Park;
    profile?: Traveler;
    featured: FeaturedSection[];
}

export const init: Model = {
    featured: []
};
