export interface BasicDetail {
    clientid: number;
    spid: number
    name: string;
    lookupCode: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    country: string;
    zip: string;
    carnetIssuingRegion: string;
    revenueLocation: string;
}
