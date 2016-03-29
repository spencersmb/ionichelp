import {Page} from 'ionic-angular';
import {MessageService} from "../../providers/message-service";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {NgZone} from "angular2/core";
import {PostComponent} from "./postComponent";

@Page({
  templateUrl: 'build/pages/page1/page1.html',
    directives:[PostComponent]
})
export class Page1 {
  notes$: Observable<any>;
  notesData$: any;
    filteredPosts: any;
    posts: any;


    constructor(
      private _notesService: MessageService,
      private zone: NgZone
  ){
    this.notesData$ = this._notesService.notesData;
    this.zone = new NgZone({enableLongStackTrace: false});
    this.posts = [];
    /*
      hardcoded data in here for the time being until I could get it working dynamically and refreshing
      on the page correctly. The service takes in two args that to point to the right node in the backend
    */
    //this.notes$ = this._notesService.getGroupNotes('Alpha, LLC', 'Construction')
    //    .map(item => {
    //      console.log(item);
    //      return toNotesArray(item, 'Alpha, LLc');
    //    }
    //);

    //original attempt to get data working realtime
    this.notes$ = this._notesService.getGroupNotes('Alpha, LLC', 'Construction')
        .map(item => {
              //convert items to a nice array object list for angular to loop through
              return toNotesArray(item, 'Alpha, LLc');
            }
        );

  }
  ngOnInit(){

    //subscribe to notes stream
    // original attempt to get data working realtime
      this._notesService.notesStream$.subscribe(
        newNote => {

          this.zone.run(() => {
            this.notesData$ = newNote;
          });
          //this._notesService.getNewNotes().subscribe(item => {
          //  console.log('HIT HTTP TWICE IN A ROW');
          //  this.notesData$ = item;
          //});
        },
        error => {
          console.log(error);
        }
    );

  //working observable for real-time data on actual devices.
  this._notesService.allPosts()
      .map(item => {
          //map over items to convert into a nice object
          let _arr = [];
          let obj ={};
          for(var key in item){
              obj = {
                  id: key,
                  category:'Construction',
                  client: 'Alpha, LLC',
                  date: item[key].date,
                  message: item[key].message
              };
              _arr = _arr.concat([obj]);
          }
          return _arr;
      }).subscribe(posts => {
          //when data comes in - run zone and then
          this.zone.run(() => {

              //set the posts data to a local variable
              this.posts = posts;

              //after the data comes in refresh it to a 2nd variable that angular loops through in the template
              this.refreshPostSource()
          });
      })

  }
  refreshPostSource() {
    this.filteredPosts = this.posts
  }
refresh(event){
    //when the emitter comes back up we set the data again on the template to complete the digest loop
    console.log('refresh');
    this.filteredPosts = this.posts
}

}
/*
 Function to transform data into an array for angular to handle easily
 */
function toNotesArray(data, name){
  let _arr = [];
  let obj = {};

  for( var key in data){
    obj = {
      name: name,
      date: data[key].date,
      message: data[key].message
    };
    _arr = _arr.concat([obj])
  }
  //console.log(_arr);
  return _arr;
}
