export interface BasicDetail {
    id: number;
    name: string;
    lookupCode: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    country: string;
    carnetIssuingRegion: string;
    revenueLocation: string;
}
