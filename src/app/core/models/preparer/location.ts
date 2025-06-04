export interface Location {
    id: number;
    clientId: number;
    locationName: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    country: string;
}
