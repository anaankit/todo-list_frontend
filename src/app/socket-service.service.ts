import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import {Observable, observable} from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  // public url = "http://localhost:3000"
  private url = "http://todo-list-backend.ankit-here.xyz"

  public socket;

  constructor(public http:HttpClient) {
    this.socket = io(this.url)
   } // end of constructor


   public sendUserId = () =>{
     return Observable.create((observer)=>{

      this.socket.on('send-userId',(data)=>{
        observer.next(data);
      })

     })

   } //  end of send urser Id


   public check = () =>{
     return Observable.create((observer)=>{

      this.socket.on('change-made',(data)=>{

        observer.next(data);

      })

     })
   } //  end of check

   public refresh = () =>{

    return Observable.create((observer)=>{

      this.socket.on('refresh',(data)=>{

        observer.next(data);

      })

     })
   } // end of refresh

   public newFriend = () =>{

    return Observable.create((observer)=>{

      this.socket.on('newFriend',(data)=>{

        observer.next(data);

      })

     })

   } // end of new friend

   public undoEvent = () =>{
     
    return Observable.create((observer)=>{

      this.socket.on('undoEvent',(data)=>{

        observer.next(data);

      })

     })
   } // end of undoEvent

   // events to emit

   public userId = (id) =>{
     this.socket.emit('userId',id);
   } // end of userId

   public newChange = (data) =>{
     this.socket.emit('newChange',data);
   } //  end of new change

   public frndRequestSent = (data) =>{
     this.socket.emit('frndRequestSent',data);
   } //  end of friend request sent.


   public requestAccepted = (data) =>{
     this.socket.emit('requestAccepted',data);
   } //  end of request accepted

   public sendMail = (data) =>{
     this.socket.emit('mail',data);
   }

   public undo = (id) =>{
     this.socket.emit('undo',id);
   }// end of undo
}
