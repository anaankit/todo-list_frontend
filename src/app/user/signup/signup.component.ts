import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../user-service.service';
import {SnotifyService} from 'ng-snotify';
import { SocketServiceService } from '../../socket-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public userService:UserServiceService,public snortify:SnotifyService, public socketService:SocketServiceService ) {


   } // end of constructor

  ngOnInit() {
  } // end og ng onInit


  public firstName;
  public  lastName;
  public email;
  public password;
  public mobileNumber;
  public countryCode;


  public signUp = () =>{

    if(!this.firstName){
      this.snortify.error('First Name missing');
    }else if(!this.lastName){
      this.snortify.error('Last Name missing')
    }else if(!this.ValidateEmail(this.email)){
      this.snortify.error('invalid email')
    }else if(!this.CheckPassword(this.password)){
      this.snortify.error('Your password mmust be between 7 to 15 characters which contain at least one numeric digit and a special character.')
    }else if(!this.countryCode){
      this.snortify.error('Country Code missing')
    }else if(!this.phonenumberCheck(this.mobileNumber)){
      this.snortify.error('invalid mobile number')
    }else{

    let signupDetails = {

      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      password:this.password,
      mobileNumber:this.mobileNumber,
      countryCode:this.countryCode
    }

    this.userService.signUpFunction(signupDetails).subscribe((response)=>{
      // console.log(response);
      if(response.status === 200){
        let mailDetails = {
          receiver:response.data.email,
          subject:'Welcome to TODO-List',
          html:`<p>Hi,</p><br><p>Thank you for joining TODO list, we are happy to have you on board</p><br><p>Regards:</p><p>TODO-list team</p>`
        }
    
        this.socketService.sendMail(mailDetails);
        this.snortify.success('Signup successfull')
        window.location.assign('/login')
      }else{
        this.snortify.error(response.message);
      }

    },((err)=>{
     this.snortify.error('user already exists, try login') 
    }))

  } //  end of signup function
}


public ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    // alert("You have entered an invalid email address!")
    return (false)
} // end of email validation


public CheckPassword(inputtxt) 
{ 
// var passw=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
if(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(inputtxt)) 
{ 
return true;
}
else
{ 
return false;
}
} // end of password validation

public phonenumberCheck(inputtxt)
{
  var phoneno = /^\d{10}$/;
  if((/^\d{10}$/.test(inputtxt)))
        {
      return true;
        }
      else
        {
        return false;
        }
} // end of phone number check


} // end of class signup component
