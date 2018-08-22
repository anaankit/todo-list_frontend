import { Component, OnInit,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListServiceService } from '../../list-service.service';
import { allResolved } from 'q';
import { Inject,ViewChild,ElementRef,AfterViewInit} from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
const shortid = require('shortid');
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { OrderPipe } from 'ngx-order-pipe';
import { UserServiceService } from '../../user-service.service';
import { SocketServiceService } from '../../socket-service.service';
import {SnotifyService} from 'ng-snotify';
import {SnotifyPosition} from 'ng-snotify';
import { Cookie } from 'ng2-cookies/ng2-cookies';






@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.css']
})
export class ListviewComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalContent1') modalContent1: TemplateRef<any>;
  @ViewChild('modalContent2') modalContent2: TemplateRef<any>;
  @ViewChild('modalContent3') modalContent3: TemplateRef<any>;

  public userId
  
  public guestUserId; 
  constructor(private snotifyService: SnotifyService,public userSerrvice:UserServiceService, public el:ElementRef, public listService:ListServiceService, public router:Router,public _router:ActivatedRoute,private modal: NgbModal,public socketService:SocketServiceService) { }
    
  ngOnInit() {
    this.routeCheck();
    this.userId = this._router.snapshot.paramMap.get('userId');
    this.guestUserId = this._router.snapshot.paramMap.get('guestUserId')
    this.getAllLists();
    this.getCurrentUserInfo();
    document.onkeydown = (event) =>{
      // console.log(event.keyCode );
      if(event.keyCode == 90 && event.ctrlKey){
       
        this.undo();
      }

    }
    this.getGuestUserDetails();
    this.register();
    this.checkForChanges();
    this.getAllUsers();    
    this.refresh();
    this.newFriend();
    this.checkForUndo();
  } // end of on init

  public currentUserDetails;
  public getCurrentUserInfo = () =>{

    let details = {
      userId:this.userId
    }

    this.userSerrvice.getUserDetails(details).subscribe((response)=>{
      if(response.status==200){
        this.currentUserDetails = response.data[0];
      }
    })

  } //  end of get currentUserInfo



  public allLists;
  public getAllLists = () =>{
    
    this.listService.getAllListOfUser(this.userId).subscribe((response)=>{

      this.allLists = response.data;
      // console.log(this.allLists)

    })

  } // end of  get alll lists of user


  
  
  public record = () =>{

    //start 

    // let uo = {userId:this.userId}

    // this.userSerrvice.getUserDetails(uo).subscribe((response)=>{

    //   let ci = response.data[0].currentIndex;

    //   ci = ci+1 
    //   let ucido = {
    //     userId:this.userId,
    //     currentIndex:ci
    //   }
    //   this.userSerrvice.updateIndex(ucido).subscribe((response));

    //   let data;
    //   this.listService.getAllListOfUser(this.userId).subscribe((response)=>{

    //   })

    //     let ld = {
    //       userId:this.userId,
    //       indexPos:ci-1,
    //       hList:this.allLists
    //     } 
  
    //     this.userSerrvice.updateList(ld).subscribe((response));

      

      

    // }) // end of http call

  // end


  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{})


  }

 
  public addCard = (event) =>{
    if(event.keyCode==13){



      let abc = {
        userId:this.userId,
        list:this.allLists
      }
    
      this.userSerrvice.updateList(abc).subscribe((response)=>{

        if(response.status==200){

          
          let id = event.target.id.slice(7);
          let value = event.target.value;
    
    
          for(let list of this.allLists){
    
            if(list.listId == id){
    
              let newCard = {
                title:value,
                cardId:shortid.generate(),
                done:'',
                subcard:[]
              }
    
              list.cards.push(newCard)
    
              this.listService.updateListUsingListId(list).subscribe((response)=>{
                if(response.status == 200){
                  // alert('list updated successfully');

                  if(this.guestUserId){
                    
                    let data = {
                      userId:this.currentUserDetails.userId,
                      frndList:this.currentUserDetails.friendList,
                      content:{
                        info:`New card ${newCard.title} add to ${this.currentUserDetails.firstName}'s list ${list.listName} by ${this.guestUserDetails.firstName}`
                      }  
                    }

                    // let obj ={
                    //   fromUserId:this.currentUserDetails.userId,
                    //   fromEmail:this.currentUserDetails.email,
                    //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
                    // }

                    // data.frndList.push(obj);

                    this.socketService.newChange(data);  

                  }else{
                  let data = {
                    frndList:this.currentUserDetails.friendList,
                    content:{
                      info:`New card ${newCard.title} add to ${this.currentUserDetails.firstName}'s list ${list.listName} by him/her self`
                    }
                  }
          
                  this.socketService.newChange(data);
                 
                }

                  //end

                }
                event.target.value=''
                this.showAdd(this.addCardEvent);
              })
            }
    
          }

        }

      })
    



      //   setTimeout(() => {
          
      // }, 500);

       
    }

    

  } // end of add card

  public addCardEvent;
  public showAdd = (event) =>{
    // console.log(event.target.parentElement.id);
    this.addCardEvent = event;
    let id = event.target.parentElement.id.slice(3);

      let x = document.getElementById(`af${id}`);

      if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

  } // end of showadd

  public addSubCard = (event) =>{
    
    if(event.keyCode == 13){
      
      let abc = {
        userId:this.userId,
        list:this.allLists
      }
    
      this.userSerrvice.updateList(abc).subscribe((response)=>{

        if(response.status==200){

          let listId = event.target.id.slice(10,19);
      let cardId = event.target.id.slice(20,29);

      for(let list of this.allLists){

        if(list.listId == listId){

          for(let card of list.cards){
            if(card.cardId == cardId){

              let newSubCard = {
                cardId:cardId,
                subCardTitle:event.target.value
              }

              card.subcard.push(newSubCard);

                        this.listService.updateListUsingListId(list).subscribe((response)=>{
                    if(response.status==200){
                      // alert('Subcard added successfully');

                      if(this.guestUserId){

                        let data = {
                          userId:this.currentUserDetails.userId,
                          frndList:this.currentUserDetails.friendList,
                          content:{
                            info:`New Subcard: ${newSubCard.subCardTitle} added to ${this.currentUserDetails.firstName}'s List: ${list.listName}, Card:${card.title} by ${this.guestUserDetails.firstName}`
                          }  
                        }

                        // let obj ={
                        //   userId:this.currentUserDetails.userId,
                        //   fromUserId:this.currentUserDetails.userId,
                        //   fromEmail:this.currentUserDetails.email,
                        //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
                        // }
    
                        // data.frndList.push(obj);
    

                        this.socketService.newChange(data);  
              
                      }else{
                      let data = {
                        frndList:this.currentUserDetails.friendList,
                        content:{
                          info:`New Subcard: ${newSubCard.subCardTitle} added to ${this.currentUserDetails.firstName}'s List: ${list.listName}, Card:${card.title}  by him/herself`
                        }
                      }
              
                      this.socketService.newChange(data);
                    } // end



                    }

                    event.target.value = ''
                    this.showAddSubCard(this.showAddSubCardEvent);

                  })

            }
          }

        } // end of if

      }
          

        } // end of response status

      })
    
    
      
    }

    // console.log(event.srcElement.parentElement.childNodes[0].innerText)
  } //  end of add subcard
  
  public showAddSubCardEvent;
  public showAddSubCard = (event) =>{
    // console.log(event.target.parentElement)
    
    this.showAddSubCardEvent = event;
    let id = event.target.parentElement.id.slice(2);

   let x  = document.getElementById(`i${id}`);

   if (x.style.display === "none") {
    x.style.display = "block";
} else {
    x.style.display = "none";
}


  } // end of show add subcard

  public newList = () =>{
    this.modal.open(this.modalContent,{size:'lg'})
  } // end of new list

  public newListName;

  public saveNew = () =>{
    
    let abc = {
      userId:this.userId,
      list:this.allLists
    }
  
    this.userSerrvice.updateList(abc).subscribe((response)=>{
      // console.log(response);
      if(response.status==200){

        
    let details = {
      userId:this.userId,
      listName:this.newListName,
      cards:[]
    }

    this.listService.createNewList(details).subscribe((response)=>{
      if(response.status == 200){
        // alert('new list create')
        this.snotifyService.success('List created')
        this.getAllLists();

        if(this.guestUserId){

          let data = {
            userId:this.currentUserDetails.userId,
            frndList:this.currentUserDetails.friendList,
            content:{
              info:`new List ${details.listName} has been added to ${this.currentUserDetails.firstName}'s list by ${this.guestUserDetails.firstName}`
            }  
          }

          // let obj ={
          //   userId:this.currentUserDetails.userId,
          //   fromUserId:this.currentUserDetails.userId,
          //   fromEmail:this.currentUserDetails.email,
          //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
          // }

          // data.frndList.push(obj);


          this.socketService.newChange(data);  

        }else{
        let data = {
          frndList:this.currentUserDetails.friendList,
          content:{
            info:`new List ${details.listName} has been added to ${this.currentUserDetails.firstName}'s list by him/her self`
          }
        }

        this.socketService.newChange(data);
      }

      }
    })
    
    this.newListName = '';
    

      }

    })
     
    // setTimeout(() => {
  
        
    // }, 500);

  } //  end of save new list

  public listtIdForEditing;
  public cardIdForEditing;
  public editCardTitle =  (event) =>{
  
//  console.log(event.path[1].id);

    
    this.listtIdForEditing = event.target.id.slice(5,14); 
    this.cardIdForEditing = event.target.id.slice(15);
    // console.log(this.listtIdForEditing);
    // console.log(this.cardIdForEditing)
    this.modal.open(this.modalContent1);
  } // end of edit card title


  public cardNameEdited;
  public saveEditedCard = () =>{

    let abc = {
      userId:this.userId,
      list:this.allLists
    }
  
    this.userSerrvice.updateList(abc).subscribe((response)=>{

      if(response.status==200){

        for(let list of this.allLists){

          if(list.listId == this.listtIdForEditing){
    
            for(let card of list.cards){
    
              if(card.cardId == this.cardIdForEditing){
                card.title = this.cardNameEdited;
                this.listService.updateListUsingListId(list).subscribe((response)=>{
                  if(response.status==200){
                    // alert('card title has been edited successfully');

                    
                    if(this.guestUserId){

                      let data = {
                        userId:this.currentUserDetails.userId,
                        frndList:this.currentUserDetails.friendList,
                        content:{
                          info:`A card title has been edited to ${card.title} in ${this.currentUserDetails.firstName}'s list:${list.listName} by ${this.guestUserDetails.firstName}`
                        }  
                      }

                      // let obj ={
                      //   userId:this.currentUserDetails.userId,
                      //   fromUserId:this.currentUserDetails.userId,
                      //   fromEmail:this.currentUserDetails.email,
                      //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
                      // }
  
                      // data.frndList.push(obj);
  

                      this.socketService.newChange(data);  
            
                    }else{
                    let data = {
                      frndList:this.currentUserDetails.friendList,
                      content:{
                        info:`A card title has been edited to ${card.title} in ${this.currentUserDetails.firstName}'s list:${list.listName} by him/her self`
                      }
                    }
            
                    this.socketService.newChange(data);
                  } // end

                  this.cardNameEdited = ''
                  }
                  
                })
              }
    
            }
    
          }
    
        }
    

      } // end of response status

    })
  



  } // end of save edited card


  public deleteCard = (event) =>{
    let abc = {
      userId:this.userId,
      list:this.allLists
    }
  
    this.userSerrvice.updateList(abc).subscribe((response)=>{

      if(response.status==200){


        
      let listId = event.target.id.slice(4,13)
      let cardId = event.target.id.slice(14)
      
      for(let list of this.allLists){
  
        if(list.listId == listId){
  
          for(let card of list.cards){
            if(card.cardId == cardId){
  
              let index = list.cards.indexOf(card);
  
              list.cards.splice(index,1);
  
              this.listService.updateListUsingListId(list).subscribe((response)=>{
                if(response.status==200){
                  // alert('card deleted successfully');

                  

                  
                  if(this.guestUserId){

                    let data = {
                      userId:this.currentUserDetails.userId,
                      frndList:this.currentUserDetails.friendList,
                      content:{
                        info:`Card: ${card.title} has been delete in ${this.currentUserDetails.firstName}'s list: ${list.listName} by ${this.guestUserDetails.firstName}`
                      }  
                    }

                    // let obj ={
                    //   userId:this.currentUserDetails.userId,
                    //   fromUserId:this.currentUserDetails.userId,
                    //   fromEmail:this.currentUserDetails.email,
                    //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
                    // }

                    // data.frndList.push(obj);


                    this.socketService.newChange(data);  
          
                  }else{
                  let data = {
                    frndList:this.currentUserDetails.friendList,
                    content:{
                      info:`Card: ${card.title} has been delete in ${this.currentUserDetails.firstName}'s list: ${list.listName} by him/her self`
                    }
                  }
          
                  this.socketService.newChange(data);
                } // end



                }
              })
  
  
            }
          }
  
        }
  
      }


      } // end of response.status

    })
  
          
    



    // console.log(event.path[1].id);
    // console.log(event.path[1].id.slice(4,13));
    // console.log(event.path[1].id.slice(14));

    
  } // end of delete card

  public deleteSubCard = (event) =>{
    // console.log(event.target.id);
    // console.log(event.path[0].id)
    // console.log(event.path[0].id.slice(5,14));
    // console.log(event.path[0].id.slice(15,24));
    // console.log(event.path[0].id.slice(25));
    let abc = {
      userId:this.userId,
      list:this.allLists
    }
  
    this.userSerrvice.updateList(abc).subscribe((response)=>{

      if(response.status==200){


        let listId =  event.target.id.slice(5,14);
        let cardId =  event.target.id.slice(15,24);
        let subCardTitle = event.target.id.slice(25);
    
        for(let list of this.allLists){
    
          if(list.listId == listId){
    
            for(let card of list.cards){
    
              if(card.cardId == cardId){
    
                for(let subCard of card.subcard){
                  if(subCard.subCardTitle == subCardTitle){
    
                   let index =  card.subcard.indexOf(subCard);
                    card.subcard.splice(index);
    
                    this.listService.updateListUsingListId(list).subscribe((response)=>{
                      if(response.status==200){
                        
                        // alert('subcard deleted successfully');

                        if(this.guestUserId){

                          let data = {
                            userId:this.currentUserDetails.userId,
                            frndList:this.currentUserDetails.friendList,
                            content:{
                              info:`SubCard:${subCard.subCardTitle} has been delete in Card: ${card.title} in ${this.currentUserDetails.firstName}'s List: ${list.listName} by ${this.guestUserDetails.firstName}`
                            }  
                          }

                          // let obj ={
                          //   userId:this.currentUserDetails.userId,
                          //   fromUserId:this.currentUserDetails.userId,
                          //   fromEmail:this.currentUserDetails.email,
                          //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
                          // }
      
                          // data.frndList.push(obj);
      

                          this.socketService.newChange(data);  
                
                        }else{
                        let data = {
                          frndList:this.currentUserDetails.friendList,
                          content:{
                            info:`SubCard:${subCard.subCardTitle} has been delete in Card: ${card.title} in ${this.currentUserDetails.firstName}'s List: ${list.listName} by him/her self`
                          }
                        }
                
                        this.socketService.newChange(data);
                      } // end



                      }
                    })
    
                  }
                }
    
              }
    
            }
    
          }
    
    
        }
    
    

      } // end of response status

    })
  

  }

public idOfListTitleToBeEdited;
public editListTitle = (event) =>{

  // console.log(event.path[0].id)
  // console.log(event.path[0].id.slice(5));
  
  this.idOfListTitleToBeEdited = event.target.id.slice(5)
  this.modal.open(this.modalContent2);

} // end of edit list title


public ListNameEdited;
public saveEditedList = () =>{

  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

      
for(let list of this.allLists){
  if(list.listId == this.idOfListTitleToBeEdited){
      list.listName = this.ListNameEdited;      
      this.listService.updateListUsingListId(list).subscribe((response)=>{
        if(response.status==200){
          // alert('list title edited');

          if(this.guestUserId){

            let data = {
              userId:this.currentUserDetails.userId,
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`A list in ${this.currentUserDetails.firstName}'s list's has been edited to ${list.listName} by ${this.guestUserDetails.firstName}`
              }  
            }

            // let obj ={
            //   userId:this.currentUserDetails.userId,
            //   fromUserId:this.currentUserDetails.userId,
            //   fromEmail:this.currentUserDetails.email,
            //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
            // }

            // data.frndList.push(obj);


            this.socketService.newChange(data);  
  
          }else{
          let data = {
            frndList:this.currentUserDetails.friendList,
            content:{
              info:`A list in ${this.currentUserDetails.firstName}'s list's has been edited to ${list.listName} by him/her self`
            }
          }
  
          this.socketService.newChange(data);
        } // end

        }
        this.ListNameEdited = ''
      })
  }
}



    }// end of response status

  })




} //  end of save edited list

public deleteList = (event) =>{

  // console.log(event.path[0].id);
  // console.log(event.path[0].id.slice(4));

  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

      let details = {
        listId:event.target.id.slice(4)
      }
      
      let temp;
      for(let each of this.allLists){
        if(each.listId == details.listId)
        temp = each.listName
      }

      this.listService.deleteList(details).subscribe((response)=>{
        if(response.status==200){
        
          
          this.getAllLists();
          // alert('list deleted successfully');

          if(this.guestUserId){

            let data = {
              userId:this.currentUserDetails.userId,
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`${this.currentUserDetails.firstName}'s list: ${temp} has been deleted by ${this.guestUserDetails.firstName}`
              }  
            }

            // let obj ={
            //   userId:this.currentUserDetails.userId,
            //   fromUserId:this.currentUserDetails.userId,
            //   fromEmail:this.currentUserDetails.email,
            //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
            // }

            // data.frndList.push(obj);


            this.socketService.newChange(data);  
  
          }else{
          let data = {
            frndList:this.currentUserDetails.friendList,
            content:{
              info:`${this.currentUserDetails.firstName}'s list: ${temp} has been deleted by him/herself`
            }
          }
  
          this.socketService.newChange(data);
        } // end
          
        }
      })
    

    } // end of response status

  })


} // end of delete list

public KeyPress(e) {
  
  // if (e.keyCode == 90 && e.ctrlKey) alert("Ctrl+z");
  alert(e.keyCode);


}


public undo = () =>{

//   let userDetails = {
//     userId:this.userId
//   }

//   this.userSerrvice.getUserDetails(userDetails).subscribe((response)=>{

//     let ci = response.data[0].currentIndex
//     ci = ci-1;
//     for(let each of response.data[0].listArr){

//       if(each.indexPos == ci){
//         this.allLists = each.hList;
//       }
// }
//       let  abc= {
//         userId:this.userId,
//         currentIndex:ci
//       }

//       this.userSerrvice.UpdateUser(abc).subscribe((response));


    
//       for(let each of response.data[0].listArr){

//         if(each.indexPos == ci){
//           let index = response.data[0].listArr.indexOf(each);

//           response.data[0].listArr.splice(index);
          
//         }

//       }

//           let xyz = {
//             userId:this.userId,
//             listArr:response.data[0].listArr
//           }

//           this.userSerrvice.UpdateUser(xyz).subscribe((response));
  
//         })

//       //       for(let each of this.allLists){

//       //         if(each.cards.length < 1){
//       //           alert('deletelis called');
//       //           this.listService.deleteList(each).subscribe((response));

//       //         }else{
//       //           alert('update list called')
//       //   this.listService.updateListUsingListId(each).subscribe((response));
//       // }

//       // }

    
//         for(let list of this.allLists){

//           if(list.cards.length == 0){
//             this.listService.deleteList(list).subscribe((response)=>{});
//           }else{
//             this.listService.updateListUsingListId(list).subscribe((response)=>{});
//           }

//         }
  


let abc = {
  userId:this.userId
}

this.userSerrvice.getUserDetails(abc).subscribe((response)=>{

  let index = response.data[0].listArr.length - 1;

  this.allLists = response.data[0].listArr[index];

  response.data[0].listArr.pop();

  let xyz = {
    userId:this.userId,
    listArr:response.data[0].listArr
  }

  this.userSerrvice.UpdateUser(xyz).subscribe((response1)=>{

  })


})

  let forDeleting = {
    userId:this.userId
  }  

  setTimeout(() => {
    

    
  this.listService.deleteAllListsOfUser(forDeleting).subscribe((response)=>{

    if(response.status == 200){

      for(let list of this.allLists){
        this.listService.createNewList(list).subscribe((response))
      }

   

    } // end of response status

  })

  
if(this.guestUserId){
  this.socketService.undo(this.userId);
}

this.snotifyService.warning('Rolling back please wait')

    
  }, 500);



// for(let list of this.allLists){

//   if(list.cards.length==0){
//     this.listService.deleteList(list).subscribe((response)=>{})
//   }else if(!list.cards){
//     this.listService.updateListUsingListId(list).subscribe((response)=>{})
//   }else{
//     this.listService.updateListUsingListId(list).subscribe((response)=>{})
//   }

// }


} //  end of undo


public markAsDone = (event) =>{


  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

     let id = event.target.id.slice(2);

     for(let list of this.allLists){
       if(list.listId == id){
         list.done = "(Done)"
         
         this.listService.updateListUsingListId(list).subscribe((response)=>{
            
          if(response.status==200){

            if(this.guestUserId){

              let data = {
                userId:this.currentUserDetails.userId,
                frndList:this.currentUserDetails.friendList,
                content:{
                  info:`List:${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as done by ${this.guestUserDetails.firstName}`
                }  
              }

              // let obj ={
              //   userId:this.currentUserDetails.userId,
              //   fromUserId:this.currentUserDetails.userId,
              //   fromEmail:this.currentUserDetails.email,
              //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
              // }

              // data.frndList.push(obj);


              this.socketService.newChange(data);  
    
            }else{
            let data = {
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`List:${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as done by him/her self`
              }
            }
    
            this.socketService.newChange(data);
          } //end

           
          }

         })
       }
     }

    } // end of response status

  })



} // end of mark as Done


public markAsOpen = (event) =>{


  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

     let id = event.target.id.slice(2);

     for(let list of this.allLists){
       if(list.listId == id){
         list.done = ''
         
         this.listService.updateListUsingListId(list).subscribe((response)=>{
            
          if(response.status==200){

            if(this.guestUserId){

              let data = {
                userId:this.currentUserDetails.userId,
                frndList:this.currentUserDetails.friendList,
                content:{
                  info:`List:${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as Open by ${this.guestUserDetails.firstName}`
                }  
              }

              // let obj ={
              //   userId:this.currentUserDetails.userId,
              //   fromUserId:this.currentUserDetails.userId,
              //   fromEmail:this.currentUserDetails.email,
              //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
              // }

              // data.frndList.push(obj);


              this.socketService.newChange(data);  
    
            }else{
            let data = {
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`List:${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as open by him/her self`
              }
            }
    
            this.socketService.newChange(data);
          } //end

           
          }

         })
       }
     }

    } // end of response status

  })



} // end of mark as Open



public markCardAsDone = (event) =>{
  
  // console.log(event.target.id);
  // console.log(event.target.id.slice(3,12))
  // console.log(event.target.id.slice(13));

  
  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

     let listId = event.target.id.slice(3,12)
     let cardId = event.target.id.slice(13)

      for(let list of this.allLists){

        if(list.listId = listId){

          for(let card of list.cards){

            if(card.cardId == cardId){

              card.done = "(Done)"

              this.listService.updateListUsingListId(list).subscribe((response)=>{
                if(response.status==200){

                
            if(this.guestUserId){

              let data = {
                userId:this.currentUserDetails.userId,
                frndList:this.currentUserDetails.friendList,
                content:{
                  info:`Card:${card.title} in list ${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as done by ${this.guestUserDetails.firstName}`
                }  
              }


              // let obj ={
              //   userId:this.currentUserDetails.userId,
              //   fromUserId:this.currentUserDetails.userId,
              //   fromEmail:this.currentUserDetails.email,
              //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
              // }

              // data.frndList.push(obj);


              this.socketService.newChange(data);  
    
            }else{
            let data = {
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`Card:${card.title} in list ${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as done by him/her self`
              }
            }
    
            this.socketService.newChange(data);
          } //end  

                } 
              })

            }

          }

        }

      }

    } //  end of response status

  })

} // end of mark card as done


public markCardAsOpen = (event) =>{
  
  // console.log(event.target.id);
  // console.log(event.target.id.slice(3,12))
  // console.log(event.target.id.slice(13));

  
  let abc = {
    userId:this.userId,
    list:this.allLists
  }

  this.userSerrvice.updateList(abc).subscribe((response)=>{

    if(response.status==200){

     let listId = event.target.id.slice(3,12)
     let cardId = event.target.id.slice(13)

      for(let list of this.allLists){

        if(list.listId = listId){

          for(let card of list.cards){

            if(card.cardId == cardId){

              card.done = ''

              this.listService.updateListUsingListId(list).subscribe((response)=>{
                if(response.status==200){

                
            if(this.guestUserId){

              let data = {
                userId:this.currentUserDetails.userId,
                frndList:this.currentUserDetails.friendList,
                content:{
                  info:`Card:${card.title} in list ${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as open by ${this.guestUserDetails.firstName}`
                }  
              }

              // let obj ={
              //   userId:this.currentUserDetails.userId,
              //   fromUserId:this.currentUserDetails.userId,
              //   fromEmail:this.currentUserDetails.email,
              //   fromName:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
              // }

              // data.frndList.push(obj);


              this.socketService.newChange(data);  
    
            }else{
            let data = {
              frndList:this.currentUserDetails.friendList,
              content:{
                info:`Card:${card.title} in list ${list.listName} in ${this.currentUserDetails.firstName}'s list's has been marked as open by him/her self`
              }
            }
    
            this.socketService.newChange(data);
          } //end  

                } 
              })

            }

          }

        }

      }

    } //  end of response status

  })

} // end of mark card as open




// beginning for friend functionality realted code
public requestAlreadySent;
public alreadyFrnd;
public searchResult;
public searchKey = {
  email:''
}
public searchFunction = () =>{
this.userSerrvice.getUserDetailsUsingEmail(this.searchKey).subscribe((response)=>{
  this.alreadyFrnd = false;
  this.requestAlreadySent=false;
    // console.log(response);
  if(response.status==200){
    
    this.searchResult = response.data;

    for(let each of this.currentUserDetails.friendList){
      if(response.data.userId == each.fromUserId){
        this.alreadyFrnd = true;
      }
    }

    for(let each of this.searchResult.friendReq){
      if(each.fromUserId == this.currentUserDetails.userId){
        this.requestAlreadySent = true;
      }
    }


  }else{
    this.snotifyService.warning('no such user exists');
  }
},((err)=>{

  this.snotifyService.error('some error occured');

}))

} //  end of search function

public userDetails = this.userSerrvice.getUserInfoInLocalStorage();

public sendRequest = () =>{

  if(this.userDetails.userId == this.searchResult.userId){
      this.snotifyService.error('You cannot send a friend request to yourself')
  }
  else{
    

  let details = {

    userId:this.searchResult.userId,
    fromUserId:this.userDetails.userId,
    fromName:this.userDetails.firstName+' '+this.userDetails.lastName,
    fromEmail:this.userDetails.email
  }


  this.userSerrvice.sendFrndRequest(details).subscribe((response)=>{
  
    if(response.status==200){
    this.snotifyService.success('frnd request sent');
    this.searchFunction()
    this.socketService.frndRequestSent(details.userId);
  }

  })

}

} // end of send request

public acceptRequest = (event) =>{
  // alert(event.target.id.slice(3));
  // console.log(event.path[0].id);
  // console.log(event.path[0].id.slice(3));
  let details = {
  userId:this.userId,
  fromUserId:event.target.id.slice(3)
}  

console.log(details);

  this.userSerrvice.moveUser(details).subscribe((response)=>{
    if(response.status==200){
      // alert('user moved');
      this.getCurrentUserInfo();
      let data = {
        id:details.fromUserId,
        name:this.currentUserDetails.firstName+' '+this.currentUserDetails.lastName
      }
      this.socketService.requestAccepted(data);
    }
  })

} //  end of accept request


public goToUserList = (event) =>{

  let id = event.path[0].id.slice(2);

  window.open(`/frnd/${this.userId}/${id}`,"_blank", "toolbar=yes,top=1000,left=1000,width=1000,height=1000");

} //  end of go to user List

public guestUser;

public guestUserDetails;

public getGuestUserDetails = () =>{

  let details = {
    userId:this.guestUserId
  }

  this.userSerrvice.getUserDetails(details).subscribe((response)=>{
    if(response.status==200){

      this.guestUserDetails = response.data[0];

    }
  })

} //  end of getGuestUserDetails

public register = () =>{

this.socketService.sendUserId().subscribe((data)=>{
  this.socketService.userId(this.userId);
})

} //  end of register

public changeInfo;
public checkForChanges = () =>{
  
  this.socketService.check().subscribe((data)=>{
  
    if(this.guestUserId){

    }else{


    this.changeInfo = data.content.info
    this.modal.open(this.modalContent3)
    this.getAllLists();
  }
  })
} // end of check for change


public searchEmailKeyUp = (event) =>{

  if(event.keyCode == 13){
    this.searchFunction();
  }else{
    if(!this.searchKey.email){
      this.searchResult='';
      this.getAllUsers();
    }
  }

} // end of search email keyup


public allUsersEmail;
public getAllUsers = () =>{

this.userSerrvice.getAllUsers().subscribe((response)=>{
  // console.log(response);
  if(response.status==200){
    this.allUsersEmail = response.data;
  }
})

} // end of get all users

public refresh = () =>{
  this.socketService.refresh().subscribe((data)=>{
    this.getCurrentUserInfo();
    this.snotifyService.create({
      title: `request`,
      body: 'new friend request',
      config: {
        position: SnotifyPosition.centerTop,
        type:'success'
      }
    })
    document.getElementById('navbarDropdown').click();
  })
} //  end of refresh

public newFriend = () =>{
  this.socketService.newFriend().subscribe((data)=>{
    this.getCurrentUserInfo();
    // this.snotifyService.info(`Friend request accepted by ${data.name}`);
    this.snotifyService.create({
      title: `Friend Request`,
      body:`Friend Request accepted by ${data.name}`,
      config: {
        position: SnotifyPosition.centerTop,
        type:'confirm'
      }
    })
  })
} //  end of new friend

public click(x,y){
  var ev = document.createEvent("MouseEvent");
  var el = document.elementFromPoint(x,y);
  ev.initMouseEvent(
      "click",
      true /* bubble */, true /* cancelable */,
      window, null,
      x, y, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
  );
  el.dispatchEvent(ev);
} //  end of click

public saveNewKeyUp = (event) =>{

if(event.keyCode == 13){
  this.saveNew();
  this.click(1,1);
}

} // end of save new key up


public saveEditedCardKeyUp = (event) =>{

  
if(event.keyCode == 13){
  this.saveEditedCard();
  this.click(1,1);
}

} //  end of save edited card key up

public saveEditedListKeyUp = (event) =>{
  if(event.keyCode == 13){
    this.saveEditedList()
    this.click(1,1);
  }
} //  end of save edited list keyup

public routeCheck = () =>{

  if(Cookie.get('authToken')==''||Cookie.get('authToken')==null||Cookie.get('authToken')==undefined||(!Cookie.get('authToken'))){
    this.router.navigate(['/login'])
  }

}

public logout = () => {
    
  Cookie.delete('authToken');
  this.router.navigate(['/home'])
}

public checkForUndo = () =>{
  this.socketService.undoEvent().subscribe((data)=>{
    if(this.guestUserId){

    }else{
    this.snotifyService.create({
      title: `Change`,
      body: 'an action has been undone in your lists, the list has been updated',
      config: {
        position: SnotifyPosition.leftTop,
        type:'warning'
      }
    })
    setTimeout(() => {
      this.getAllLists();
    }, 500);
   
  }

  })



} // end of checkForUndo

} // end of class
