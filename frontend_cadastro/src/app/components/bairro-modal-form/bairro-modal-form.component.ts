import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorsService } from 'src/app/errors/errors.service';
import { IBairro, IMunicipio } from 'src/app/models/interfaces';
import { AlertasService } from 'src/app/services/alertas.service';
import { MunicipioService } from 'src/app/services/municipio.service';

@Component({
  selector: 'app-bairro-modal-form',
  templateUrl: './bairro-modal-form.component.html',
  styleUrls: ['./bairro-modal-form.component.scss'],
})
export class BairroModalFormComponent implements OnInit {
  @Input() titulo!: string;
  @Input() bairroForm!: any;

  @Output() salvarItem = new EventEmitter<any>();

  listaMunicipios: IMunicipio[] = [];

  constructor(
    private municipioService: MunicipioService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarListaMunicipios();
  }

  salvar(): void {
    this.salvarItem.emit(this.bairroForm);
  }

  buscarListaMunicipios(): void {
    this.municipioService.devolverMunicipios().subscribe({
      next: (municipios) => {
        this.listaMunicipios = municipios;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }
}
