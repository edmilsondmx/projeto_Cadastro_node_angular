import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PessoaComponent } from './pages/pessoa/pessoa.component';
import { BairroComponent } from './pages/bairro/bairro.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { UfComponent } from './pages/uf/uf.component';
import { HttpClientModule } from '@angular/common/http';
import { TabelaListaComponent } from './components/tabela-lista/tabela-lista.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { UfModalFormComponent } from './components/uf-modal-form/uf-modal-form.component';
import { MunicipioModalFormComponent } from './components/municipio-modal-form/municipio-modal-form.component';
import { BairroModalFormComponent } from './components/bairro-modal-form/bairro-modal-form.component';
import { PessoaModalFormComponent } from './components/pessoa-modal-form/pessoa-modal-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { ShowPessoaComponent } from './components/show-pessoa/show-pessoa.component';
import { CardEnderecoComponent } from './components/card-endereco/card-endereco.component';

@NgModule({
  declarations: [
    AppComponent,
    PessoaComponent,
    BairroComponent,
    MunicipioComponent,
    UfComponent,
    TabelaListaComponent,
    SidebarComponent,
    FooterComponent,
    UfModalFormComponent,
    MunicipioModalFormComponent,
    BairroModalFormComponent,
    PessoaModalFormComponent,
    LoginModalComponent,
    ShowPessoaComponent,
    CardEnderecoComponent,
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
    }),
  ],
  providers: [BsModalService],
  bootstrap: [AppComponent],
})
export class AppModule {}
