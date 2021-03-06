import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {MessageService} from "./providers/message-service";


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers:[MessageService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
      private _messageService: MessageService,
      platform: Platform
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      //original attempt at getting the data to show up in realtime
      this._messageService.getNotes();

    });
  }
}
