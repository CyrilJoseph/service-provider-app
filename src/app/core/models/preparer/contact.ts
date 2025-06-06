export interface Contact {
    clientContactId: number;
    spid: number
    clientid: number;
    defaultContact: boolean;
    firstName: string;
    lastName: string;
    middleInitial?: string | null;
    title: string;
    phone: string;
    mobile: string;
    fax?: string | null;
    email: string;
    dateCreated?: Date | null;
    createdBy?: string | null;
    lastUpdatedBy?: string | null;
    lastUpdatedDate?: Date | null;
    isInactive?: boolean | null; // TODO
    inactivatedDate?: Date | null; // TODO
}
