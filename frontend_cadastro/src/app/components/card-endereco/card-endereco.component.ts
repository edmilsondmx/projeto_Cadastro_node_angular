import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-endereco',
  templateUrl: './card-endereco.component.html',
  styleUrls: ['./card-endereco.component.scss'],
})
export class CardEnderecoComponent {
  @Input() enderecos!: any;
}
