export interface Traveler {
    userid: string;      // Unique identifier (usually matches auth user ID)
    fullname: string;    // User's full name
    email: string;       // User's email
    bio?: string;        // Optional user bio
    favoriteParks?: string[];  // Array of Park IDs or names the user likes
    favoriteTrails?: string[]; // Array of Trail IDs or names the user likes
}
