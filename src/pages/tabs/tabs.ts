import { Component } from '@angular/core';
import { TopicListPage } from '../topic-list/topic-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  isRootPage: boolean =  true;
  
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TopicListPage;

  constructor() {

  }
}
