import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MapContainerComponent } from "./map-container/map-container";
import { MapComponent } from "./map/map";

//import { PopoverComponent } from './component/popover/popover';


@NgModule({
	declarations: [
		MapContainerComponent,
		MapComponent,
	],
	imports: [
		IonicModule,
		],
	exports: [
		MapContainerComponent,
		MapComponent,
	]
})
export class ComponentsModule {}
