import { TopicItem } from './../pages/topic-list/item/item';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Request } from './services/request';
import { Auth } from './services/auth';
import { Utils } from './services/utils';

import { LinkPipe } from './pipes/link';
import { ProtocolPipe } from './pipes/protocol';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { TopicListPage } from '../pages/topic-list/topic-list';
import { TopicDetailPage } from '../pages/topic-detail/topic-detail';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';

export function provideStorage() {
  return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__cnode' });
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    TopicItem,
    TopicListPage,
    TopicDetailPage,
    LoginPage,
    UserPage,
    LinkPipe,
    ProtocolPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      pageTransition: 'ios',
      // backButtonText: '返回',
      swipeBackEnabled: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    TopicItem,
    TopicListPage,
    TopicDetailPage,
    LoginPage,
    UserPage,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Storage, useFactory: provideStorage },
    Auth,
    Request,
    Utils
  ]
})
export class AppModule {}
