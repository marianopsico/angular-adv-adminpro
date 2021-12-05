
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';



const routes: Routes = [
  { path: 'dashboard' ,
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    canLoad: [ AuthGuard ], // hay que implementarlo para trabajar con LazyLoad, tambien en AuthGuard (VER)
    loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule) // cargamos de forma peresoza el modulo
  },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
