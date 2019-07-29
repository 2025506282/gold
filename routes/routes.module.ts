import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';

// single pages
import { Exception401Component } from './exception/401.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { CDSSModule } from './cdss/cdss.module';
import { NoDataComponent } from './exception/no-data/no-data.component';

const COMPONENTS = [
  Exception401Component,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  NoDataComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, CDSSModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {
}
