import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {RouterModule,Routes} from '@angular/router';
import { SignupComponent } from './user/signup/signup.component';
import { UserModule } from './user/user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './user/login/login.component';
import { ListviewComponent } from './todo/listview/listview.component';
import { TodoModule } from './todo/todo.module';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { PasswordRestComponent } from './user/password-rest/password-rest.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    SnotifyModule,
    UserModule,
    TodoModule,
    RouterModule.forRoot([
      {path:'signup',loadChildren:'./user/user.module'},
      {path:'login',loadChildren:'./user/user.module'},
      {path:'passwordReset/:resetToken',loadChildren:'./user/user.module'},
      {path: 'todo/:userId',loadChildren:'./todo/todo.module'},
      {path:'frnd/:guestUserId/:userId',loadChildren:'./todo/todo.module'},
      {path:'home',component:HomeComponent},
      {path:'',component:HomeComponent},
      { path: '*', component: NotFoundComponent},
      { path: '**', component: NotFoundComponent}
    ])
  ],
  providers: [ { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
  SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
