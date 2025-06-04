import { Park } from "../models/park";

// TEMP: In-memory dummy data
const dummyParks: Record<string, Park> = {
    "slo-open-space": {
        id: "slo-open-space",
        name: "SLO Open Space",
        description: "A scenic open space with multiple trails and beautiful views.",
        trails: ["bishop-peak", "cerro-san-luis"]
    },
    "morro-bay": {
        id: "morro-bay",
        name: "Morro Bay State Park",
        description: "A coastal park with estuary views and forest trails.",
        trails: []
    }
};

const ParkService = {
    get(id: string): Promise<Park | null> {
        return Promise.resolve(dummyParks[id] || null);
    }
};

export default ParkService;
