import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../common/user.service';
import { environment } from '../../../../environments/environment';
import { BasicDetail } from '../../models/preparer/basic-detail';
import { filter, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasicDetailService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

  getBasicDetailsById(id: number): BasicDetail | any {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetPreparerByClientid?p_spid=${this.userService.getUserSpid()}&p_clientid=${id}`).pipe(
      filter(response => response.length > 0),
      map(response => this.mapToBasicDetail(response?.[0])));
  }

  private mapToBasicDetail(basicDetails: any): BasicDetail {
    return {
      clientid: basicDetails.CLIENTID,
      spid: basicDetails.SPID,
      name: basicDetails.NAMEOF,
      lookupCode: basicDetails.LOOKUPCODE,
      address1: basicDetails.ADDRESS1,
      address2: basicDetails.ADDRESS2,
      city: basicDetails.CITY,
      state: basicDetails.STATE,
      country: basicDetails.COUNTRY,
      carnetIssuingRegion: basicDetails.ISSUINGREGION,
      revenueLocation: basicDetails.REVENUELOCATION,
      zip: basicDetails.ZIP,
    };
  }

  createBasicDetails(data: BasicDetail): Observable<any> {
    const basicDetails = {
      p_spid: this.userService.getUserSpid(),
      p_clientname: data.name,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_country: data.country,
      p_zip: data.zip,
      p_issuingregion: data.carnetIssuingRegion,
      p_revenuelocation: data.revenueLocation,
      p_userid: this.userService.getUser(),
    }

    return this.http.post(`${this.apiUrl}/${this.apiDb}/CreateNewClients`, basicDetails);
  }

  updateBasicDetails(id: number, data: BasicDetail): Observable<any> {
    const basicDetails = {
      p_spid: this.userService.getUserSpid(),
      p_clientid: id,
      p_clientname: data.name,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_country: data.country,
      p_zip: data.zip,
      p_revenuelocation: data.revenueLocation,
      p_userid: this.userService.getUser(),
    }

    return this.http.put(`${this.apiUrl}/${this.apiDb}/UpdateClient`, basicDetails);
  }
}
