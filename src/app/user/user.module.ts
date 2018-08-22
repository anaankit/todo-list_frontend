import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UserServiceService } from '../user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordRestComponent } from './password-rest/password-rest.component';
import { SocketServiceService } from '../socket-service.service';
import {RouterModule,Routes} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'passwordReset/:resetToken', component: PasswordRestComponent}
    ])
  ],
  providers:[UserServiceService,SocketServiceService],
  declarations: [SignupComponent, LoginComponent, PasswordRestComponent]
})
export class UserModule { }
