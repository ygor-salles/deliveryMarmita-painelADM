import { AcrescimoService } from './../../services/acrescimo.service';
import { IAcrescimo } from './../../models/IAcrescimo.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acrescimo',
  templateUrl: './acrescimo.component.html',
  styleUrls: ['./acrescimo.component.scss']
})
export class AcrescimoComponent implements OnInit {

  fonteAcrescimos: IAcrescimo[] = [];
  displayedColumns = ['name', 'price', 'createdAt'];

  constructor(private acrescimoService: AcrescimoService) { }

  ngOnInit(): void {
    this.acrescimoService.read().subscribe(acrescimos => {
      this.fonteAcrescimos = acrescimos;
    });
  }

  dialogCadastrar(): void {
    console.log('Abrir modal para cadastro');
  }

  dialogEditar(event: MouseEvent, acrescimo: IAcrescimo): void {
    event.stopPropagation();
    console.log('Abrir modal de editar', acrescimo);
  }

  dialogExcluir(event: MouseEvent, acrescimo: IAcrescimo): void {
    event.stopPropagation();
    console.log('Abrir modal de exclusão', acrescimo);
  }

}
