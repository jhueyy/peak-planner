import { Trail } from "../models/trail";

// TEMP: In-memory dummy data
const dummyTrails: Record<string, Trail> = {
    "bishop-peak": {
        id: "bishop-peak",
        name: "Bishop Peak",
        difficulty: "Hard",
        tags: ["Scenic", "Challenging"],
        reviews: [
            "Tough climb but beautiful views!",
            "One of the best hikes in SLO."
        ],
        park: "slo-open-space"
    },
    "cerro-san-luis": {
        id: "cerro-san-luis",
        name: "Cerro San Luis",
        difficulty: "Moderate",
        tags: ["Viewpoint", "Popular"],
        reviews: ["Shorter hike but still great!", "Nice place to run."],
        park: "slo-open-space"
    }
};

const TrailService = {
    get(id: string): Promise<Trail | null> {
        return Promise.resolve(dummyTrails[id] || null);
    }
};

export default TrailService;
