import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClientModule } from '@angular/common/http';
import { RequestService } from '../services/request.service';
import { HttpClientLibrary } from '../libraries/http-client.library';
import { IonicStorageModule } from '@ionic/storage';
import { PageModule } from './page.module';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MessageLibrary } from '../libraries/message.library';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    PageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppBrowser,
    RequestService,
    HttpClientLibrary,
    MessageLibrary
  ]
})
export class AppModule {}
