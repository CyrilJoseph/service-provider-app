import { Injectable } from '@angular/core';
import { UserService } from '../common/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable, of } from 'rxjs';
import { Contact } from '../../models/preparer/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

  getContactsById(id: number): Observable<Contact[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetPreparerContactsByClientid?p_spid=${this.userService.getUserSpid()}&p_clientid=${id}`).pipe(
      map(response => this.mapToContacts(response)));
  }

  private mapToContacts(data: any[]): Contact[] {
    return data.map(contact => ({
      clientContactId: contact.CLIENTCONTACTID,
      spid: contact.SPID,
      clientid: contact.CLIENTID,
      defaultContact: contact.DEFCONTACTFLAG === 'Y',
      firstName: contact.FIRSTNAME,
      lastName: contact.LASTNAME,
      title: contact.TITLE,
      phone: contact.PHONENO,
      mobile: contact.MOBILENO,
      fax: contact.FAXNO || null,
      email: contact.EMAILADDRESS,
      middleInitial: contact.MIDDLEINITIAL || null,
      createdBy: contact.CREATEDBY || null,
      dateCreated: contact.DATECREATED || null,
      lastUpdatedBy: contact.LASTUPDATEDBY || null,
      lastUpdatedDate: contact.LASTUPDATEDDATE || null,
      isInactive: contact.INACTIVEFLAG === 'Y' || false,
      inactivatedDate: contact.INACTIVEDATE || null
    }));
  }

  createContact(clientid: number, data: Contact): Observable<any> {
    const contact = {
      p_spid: this.userService.getUserSpid(),
      p_clientid: clientid,
      p_defcontactflag: data.defaultContact ? 'Y' : 'N',
      p_contactstable: [{
        FirstName: data.firstName,
        LastName: data.lastName,
        MiddleInitial: data.middleInitial,
        Title: data.title,
        EmailAddress: data.email,
        MobileNo: data.mobile,
        PhoneNo: data.phone,
        FaxNo: data.fax
      }],
      p_user_id: this.userService.getUser()
    }

    return this.http.post(`${this.apiUrl}/${this.apiDb}/CreateClientContacts`, contact);
  }

  updateContact(spContactId: number, data: Contact): Observable<any> {
    const contact = {
      p_spid: this.userService.getUserSpid(),
      p_clientcontactid: spContactId,
      p_firstname: data.firstName,
      p_lastname: data.lastName,
      P_middleinitial: data.middleInitial,
      p_title: data.title,
      p_phone: data.phone,
      p_mobileno: data.mobile,
      p_fax: data.fax,
      p_emailaddress: data.email,
      p_user_id: this.userService.getUser()
    }

    return this.http.put(`${this.apiUrl}/${this.apiDb}/UpdateClientContacts`, contact);
  }

  deleteContact(clientContactId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiDb}/InactivateSPContact?p_clientcontactid=${clientContactId}`, null);
  }
}
