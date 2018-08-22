import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListviewComponent } from './listview/listview.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { ListServiceService } from '../list-service.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { OrderModule } from 'ngx-order-pipe';
import { SocketServiceService } from '../socket-service.service';
import {RouterModule,Routes} from '@angular/router';




@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    OrderModule,
    NgbModalModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'todo/:userId', component: ListviewComponent },
    { path: 'frnd/:guestUserId/:userId', component: ListviewComponent},
    ])
  ],
  providers:[UserServiceService,ListServiceService,SocketServiceService],
  declarations: [ListviewComponent]
})
export class TodoModule { }
