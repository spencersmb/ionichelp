import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import 'rxjs/Rx';
import {Subject, BehaviorSubject} from 'rxjs/Rx'

declare var Firebase: any;

/*
 Generated class for the NotesService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class MessageService {
    errorMessage: string;
    ref: any;
    firebaseUrl:string;
    notesStream$: Observable<any>;
    notesObserver$: Observer<any>;
    notesData: any;

    //variable setup to store data in locally - not currently in use


    constructor(
        private _http: Http
    ) {
        //insert your firebase URL here
        this.firebaseUrl = 'https://firebaseio.com';
        this.ref = new Firebase(this.firebaseUrl);


        this.notesStream$ = new Observable(observer =>
            this.notesObserver$ = observer).share();

        this.notesData = [''];
    }
    getGroupNotes(name, subname){
        return new Observable(observer => {
            this.ref.child('notifications').child(name).child(subname).child('messages')
                .on("value", function(snapshot) {

                    //console.log(snapshot.val());
                    observer.next(snapshot.val());

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
        });
    }
    getNewNotes(){
        return this._http.get(this.ref + 'notifications/Alpha, LLC/Construction/messages.json')
            .map(response => response.json()).map(item => {
                console.log(item);
                let arr = [];
                let obj = {};
                for( var name in item){
                    obj = {
                        date: item[name].date,
                        message: item[name].message
                    }
                }
                arr = arr.concat([obj]);
                return arr;
            });
    }
    getNotes(){
        new Observable(observer => {
            this.ref.child('notifications').child('Alpha, LLC').child('Construction').child('messages')
                .on("value", function(snapshot) {

                    //console.log(snapshot.val());
                    observer.next(snapshot.val());

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
        })
        .map(item => {
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
        })
        .subscribe(
            data => {
                //push data to cached array
                this.notesData = data;
                //console.log(this.notesData);
                // Push new messages into the shared Observable stream
                this.notesObserver$.next(data);
            }
        );
    }
    allPosts(): Subject<any> {
        const postsObservable = new BehaviorSubject<any>(null);

        this.ref.child('notifications').child('Alpha, LLC').child('Construction').child('messages').on('value', snapshot => {
            const data = snapshot.val();
            postsObservable.next(data)
        });

        //return observable to subscribe to in the component
        return postsObservable
    }
}