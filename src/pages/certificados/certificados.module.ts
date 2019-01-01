import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificadosPage } from './certificados';


@NgModule({
  declarations: [
    CertificadosPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificadosPage),
  ],
})
export class CertificadosPageModule {}
