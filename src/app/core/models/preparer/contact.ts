export interface Contact {
    id: number;
    clientId: number;
    firstName: string;
    lastName: string;
    title: string;
    phone: string;
    mobile: string;
    email: string;
    middleInitial?: string | null;
    fax?: string | null;
    isActive?: boolean;
}
