import { ModalFreteComponent } from './modal-frete/modal-frete.component';
import { MatDialog } from '@angular/material/dialog';
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
  displayedColumns = ['neighborhood', 'value', 'createdAt', 'actions'];

  showSpinner = false;

  constructor(private freteService: FreteService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.freteService.read().subscribe(fretes => {
      this.fonteFretes = fretes;
      this.showSpinner = false;
    });
  }

  dialogCadastrar(): void {
    const dialogRef = this.dialog.open(ModalFreteComponent, {
      width: '50%',
      data: { title: 'Cadastrar frete' }
    });

    dialogRef.afterClosed().subscribe((result: IFrete) => {
      if (result) {
        const frete: IFrete = {
          neighborhood: result.neighborhood,
          value: result.value
        }
        this.freteService.create(frete).subscribe(() => {
          this.freteService.showMessage('Frete cadastrado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogEditar(event: MouseEvent, frete: IFrete): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalFreteComponent, {
      width: '50%',
      data: {
        title: 'Editar frete',
        id: frete.id,
        neighborhood: frete.neighborhood,
        value: frete.value,
      }
    });

    dialogRef.afterClosed().subscribe((result: IFrete) => {
      if (result) {
        const frete: IFrete = {
          neighborhood: result.neighborhood,
          value: result.value,
        }
        this.freteService.update(frete, result.id).subscribe(() => {
          this.freteService.showMessage('Frete alterado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogExcluir(event: MouseEvent, frete: IFrete): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalFreteComponent, {
      width: '50%',
      data: { title: 'Excluir frete', id: frete.id, neighborhood: frete.neighborhood }
    });

    dialogRef.afterClosed().subscribe((result: IFrete) => {
      if (result) {
        this.freteService.delete(result.id).subscribe(() => {
          this.freteService.showMessage('Frete excluído com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }
}
