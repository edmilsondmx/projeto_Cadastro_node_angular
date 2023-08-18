import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PessoaComponent } from './pages/pessoa/pessoa.component';
import { BairroComponent } from './pages/bairro/bairro.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { UfComponent } from './pages/uf/uf.component';

const routes: Routes = [
  { path: 'pessoa', component: PessoaComponent },
  { path: 'bairro', component: BairroComponent },
  { path: 'municipio', component: MunicipioComponent },
  { path: 'uf', component: UfComponent },
  { path: '**', redirectTo: 'pessoa' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
