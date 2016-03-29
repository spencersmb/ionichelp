import {Component, Input, EventEmitter, Output,} from 'angular2/core'
import {Item, Button, Icon} from 'ionic-angular'
import {MessageService} from "../../providers/message-service";


@Component({
    selector: 'post-item',
    templateUrl: 'build/pages/page1/post.component.html',
})

export class PostComponent {

    //pass in post to template
    @Input() post: any;
    @Output() toggled = new EventEmitter<any>();

    constructor(
        private _notesService: MessageService
    ) {
    }
    ngOnInit(){

        //on init emit the post back up
        //this triggers a refesh to make sure the data is set
        //if you have 3 items this gets called for each item
        //maybe refactor so this gets called on the parent and not each item
        this.toggled.emit(this.post);
    }
}