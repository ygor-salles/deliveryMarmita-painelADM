import { FreteService } from './../../services/frete.service';
import { IFrete } from './../../models/IFrete.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frete',
  templateUrl: './frete.component.html',
  styleUrls: ['./frete.component.scss']
})
export class FreteComponent implements OnInit {

  fonteFretes: IFrete[] = [];
  displayedColumns = ['cep', 'neighborhood', 'value', 'createdAt'];

  constructor(private freteService: FreteService) { }

  ngOnInit(): void {
    this.freteService.read().subscribe(fretes => {
      this.fonteFretes = fretes;
    });
  }

  dialogCadastrar(): void {
    console.log('Abrir modal para cadastro');
  }

  dialogEditar(event: MouseEvent, frete: IFrete): void {
    event.stopPropagation();
    console.log('Abrir modal de editar', frete);
  }

  dialogExcluir(event: MouseEvent, frete: IFrete): void {
    event.stopPropagation();
    console.log('Abrir modal de exclusão', frete);
  }
}
