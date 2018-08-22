import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http'
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  constructor(public _http:HttpClient) { }
  
  private authToken = Cookie.get('authToken');

  // public url = "http://localhost:3000/api/v1/list";
  private url = "http://todo-list-backend.ankit-here.xyz/api/v1/list"

  public getAllListOfUser = (userId):any =>{

    let details = {
      userId:userId
    }

    return this._http.post(`${this.url}/getAll?authToken=${this.authToken}`,details);

  } // end of  get all lists of user

  public updateListUsingListId = (details):any =>{

    return this._http.post(`${this.url}/updateList/id?authToken=${this.authToken}`,details);
  } // end of update list using Id

  public createNewList = (details):any =>{

    return this._http.post(`${this.url}/create?authToken=${this.authToken}`,details);
  } // end of create new list

  public deleteList  = (details):any =>{
    return this._http.post(`${this.url}/delete?authToken=${this.authToken}`,details);
  } // en of deleteList


  public updateAllListsOfUser = (details):any =>{
    return this._http.post(`${this.url}/update/allLists?authToken=${this.authToken}`,details);
  } // end of update all list of user

  public deleteAllListsOfUser = (details):any =>{
    return this._http.post(`${this.url}/allList/delete?authToken=${this.authToken}`,details);
  } // end of delete all lusts of user

}
