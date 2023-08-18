import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { PessoaService } from 'src/app/services/pessoa.service';
import { UfService } from 'src/app/services/uf.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-tabela-lista',
  templateUrl: './tabela-lista.component.html',
  styleUrls: ['./tabela-lista.component.scss'],
})
export class TabelaListaComponent implements OnChanges {
  showMenuArray: boolean[] = [];
  menuOpen: boolean = false;

  pag = 1;
  contador = 5;

  @Input() titles!: string[];
  @Input() campos!: string[];
  @Input() dados!: any[];

  @Output() editarItem = new EventEmitter<any>();
  @Output() excluirItem = new EventEmitter<number>();
  @Output() showItem = new EventEmitter<any>();

  constructor(
    private ufService: UfService,
    private municipioService: MunicipioService,
    private loginService: LoginService,
    private pessoaService: PessoaService
  ) {}
  listaUfs: any[] = [];
  listaMunicipios: any[] = [];

  userAuthorized!: boolean;

  ngOnChanges() {
    this.loginService.userAuthorized$.subscribe((userAuthorized) => {
      this.userAuthorized = userAuthorized;

      if (this.campos[4] === 'login' && !this.userAuthorized) {
        this.dados.forEach((item: any) => {
          item.senha = '********';
        });
      } else if (this.campos[4] === 'login') {
        this.pessoaService.devolverListaPessoas().subscribe((pessoas) => {
          this.dados = pessoas;
        });
      }
    });

    if (this.campos[1] === 'codigoUF') {
      this.ufService.devolverUfs().subscribe((ufs) => {
        this.listaUfs = ufs;
        this.dados.forEach((item: any) => {
          let sigla = this.listaUfs.find(
            (uf) => uf.codigoUF === item.codigoUF
          )?.sigla;
          item.uf = sigla;
        });
      });
    }

    if (this.campos[1] === 'codigoMunicipio') {
      this.municipioService.devolverMunicipios().subscribe((municipios) => {
        this.listaMunicipios = municipios;
        this.dados.forEach((item: any) => {
          let nome = this.listaMunicipios.find(
            (municipio) => municipio.codigoMunicipio === item.codigoMunicipio
          )?.nome;
          item.municipio = nome;
        });
      });
    }
  }

  emitirEditarItem(item: any) {
    this.editarItem.emit(item);
  }

  emitirExcluirItem(item: any) {
    this.excluirItem.emit(item[this.campos[0]]);
  }

  emitirShowItem(item: any) {
    this.showItem.emit(item[this.campos[0]]);
  }

  toggleMenu(index: number) {
    this.showMenuArray.forEach((item, i) => {
      if (i !== index) {
        this.showMenuArray[i] = false;
      }
    });
    this.showMenuArray[index] = !this.showMenuArray[index];
    this.menuOpen = this.showMenuArray.some((value) => value);
  }
}
