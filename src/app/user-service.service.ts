import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ReturnStatement } from '@angular/compiler';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(public _http:HttpClient) {

   } //  end of constructor

   private authToken = Cookie.get('authToken');


  //  private url = "http://localhost:3000/api/v1/users";
      private url = "http://todo-list-backend.ankit-here.xyz/api/v1/users"

   public signUpFunction = (signupDetails):any =>{

   return this._http.post(`${this.url}/signup`,signupDetails);

   } //  end of signup function


   public loginFunction = (loginDetails):any =>{
     return this._http.post(`${this.url}/login`,loginDetails);
   } //  end of login function

   
   public setUserInfoInLocalStorage = (data) =>{
     localStorage.setItem('userInfo',JSON.stringify(data));
   } //  end of set user info

   public getUserInfoInLocalStorage = ():any =>{
    return JSON.parse(localStorage.getItem('userInfo'));
  } // end of get user info from local storage

  public getUserDetails = (details):any =>{
    return this._http.post(`${this.url}/getUser`,details);
  } // end of get user details

  public UpdateUser = (details):any =>{
    return this._http.post(`${this.url}/update`,details);
  } // end of update user

  public updateList = (details):any =>{
    return this._http.post(`${this.url}/updateList`,details);
  } // end of update list


  public updateIndex  = (details):any =>{
    return this._http.post(`${this.url}/indexUpdate`,details);
  } // end of update Index


  public getUserDetailsUsingEmail = (details):any =>{
    return this._http.post(`${this.url}/email/getUserDetails`,details);
  }


  public sendFrndRequest  = (details):any =>{
    return this._http.post(`${this.url}/add/frndRequest?authToken=${this.authToken}`,details);
  } // end of send frund request


  public moveUser = (details):any =>{
    return this._http.post(`${this.url}/move?authToken=${this.authToken}`,details)
  } // end of move user

  public getAllUsers =():any =>{
    return this._http.get(`${this.url}/getAll?authToken=${this.authToken}`);
  } //  end of get All users

  public updateUserUsingEmail = (details):any =>{
    return this._http.post(`${this.url}/using/email/updateUser`,details);
  } // end of update user using email

  public getInfoUsingToken = (token):any =>{
    return this._http.get(`${this.url}/getinfo/using/token/${token}`)
  } //end of get user info using token


  public updatePassword = (details):any =>{
    return this._http.post(`${this.url}/password/update`,details);
  } //end of update password


} // end of class user service
