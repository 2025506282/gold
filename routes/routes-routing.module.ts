import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

// single pages
import { Exception401Component } from './exception/401.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { CDSSComponent } from './cdss/cdss.component';
import { AiAnalysisComponent } from './cdss/decision-support/ai-analysis/ai-analysis.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { NoDataComponent } from './exception/no-data/no-data.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', component: CDSSComponent, data: { title: 'cdss' } },
      { path: '401', component: Exception401Component },
      { path: '403', component: Exception403Component },
      { path: '404', component: Exception404Component },
      { path: '500', component: Exception500Component },
      { path: 'error', component: NoDataComponent },
    ]
  },
  { path: 'aiAnalysis', component: AiAnalysisComponent, data: { title: 'AI评估' } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
