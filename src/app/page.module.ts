import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports:[
   
    IonicModule,
    ComponentsModule,
  ],
  declarations: [],
  exports: [
    IonicModule,
    ComponentsModule,
  ]
})
export class PageModule {}
