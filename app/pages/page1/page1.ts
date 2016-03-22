import {Page} from 'ionic-angular';
import {MessageService} from "../../providers/message-service";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {

  notes$: Observable<any>;

  constructor(
      private _notesService: MessageService
  ){

    /*
      hardcoded data in here for the time being until I could get it working dynamically and refreshing
      on the page correctly. The service takes in two args that to point to the right node in the backend
    */
    this.notes$ = this._notesService.getGroupNotes('Alpha, LLC', 'Construction')
        .map(item => {
          console.log(item);
          return toNotesArray(item, 'Alpha, LLc');
        }
    );

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
    _arr.push(obj);
  }
  //console.log(_arr);
  return _arr;
}
