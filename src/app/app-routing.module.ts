import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    component: AppComponent,
    path: 'buying-order-agent'
  },
  {
    path: 'configuration',
    loadChildren: () =>
      import('./configuration/configuration.module').then(
        m => m.ConfigurationModule
      )
  },
  {
    path: '',
    redirectTo: '/configuration',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
