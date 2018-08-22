import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../user-service.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketServiceService } from '../../socket-service.service';
const shortid = require('shortid');
import {SnotifyService} from 'ng-snotify';
import {SnotifyPosition} from 'ng-snotify';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public userService:UserServiceService,public socketService:SocketServiceService,public snortify:SnotifyService) {

   } // end of constructor

  ngOnInit() {
  } // end of ng oninit


  public email;
  public password;

  public login =()=>{

    if(!this.email){
      this.snortify.error('Enter Email')
    }else if(!this.password){
      this.snortify.error('enter password')
    }else{

    let loginDetails = {
      email:this.email,
      password:this.password
    }

    this.userService.loginFunction(loginDetails).subscribe((response)=>{
      if(response.status === 200){
        this.snortify.success('Login successfull')
        Cookie.set('authToken',response.data.authToken);
        this.userService.setUserInfoInLocalStorage(response.data.userDetails);
        window.location.assign(`/todo/${response.data.userDetails.userId}`);
      }else{
          this.snortify.error('error occured')
      }

    },((err)=>{
      this.snortify.error('incorrect password or user does not exist');
    }))
  }
  } // end of login function


  public forgotPassword = () =>{

   if(!this.email){
     this.snortify.create({
      title: `Email`,
      body:`Please enter Email and then click on forgot password to proceed with password recovery options`,
      config: {
        position: SnotifyPosition.centerTop,
        type:'confirm'
      }
    })
    //  ('please enter email to proceed with the password recovery options')
   }else{

    let details = {
      email:this.email,
      PasswordResetToken:shortid.generate(),
      PasswordResetExpiration: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }
    
     this.userService.updateUserUsingEmail(details).subscribe((response)=>{
      //  console.log(response);
       if(response.data.nModified>0){
        let mailDetails = {
          receiver:this.email,
          subject:'Your password reset Link Is Herre',
          html:`<p>Hi,</p><h4>Below is your password rest link, it is valid for a period of 24hrs</h4><br><p>http://todo-list.ankit-here.xyz/passwordReset/${details.PasswordResetToken}</p><br><p>Regards:</p><p>TODO-list Team</p>`
        }
        this.socketService.sendMail(mailDetails);
        // console.log(mailDetails);
        //  this.router.navigate([`reset-passoword/${details.PasswordResetToken}`])
          // alert('An email has been sent to you, please click on the link in the email to reset your password');
          this.snortify.create({
            title: `Link sent`,
            body:`An email has been sent to you, please click on the link in the email to reset your password`,
            config: {
              position: SnotifyPosition.centerTop,
              type:'confirm'
            }
          })
       }else{
         this.snortify.error('no account found with Email')
       }
     },((err)=>{
      
      this.snortify.error('Error occured');

     }))
   }



  }

} // end of class  login component
