import { ModalAcrescimoComponent } from './modal-acrescimo/modal-acrescimo.component';
import { MatDialog } from '@angular/material/dialog';
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
  displayedColumns = ['name', 'price', 'createdAt', 'actions'];

  constructor(private acrescimoService: AcrescimoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.acrescimoService.read().subscribe(acrescimos => {
      this.fonteAcrescimos = acrescimos;
    });
  }

  dialogCadastrar(): void {
    const dialogRef = this.dialog.open(ModalAcrescimoComponent, {
      width: '50%',
      data: { title: 'Cadastrar acréscimo' }
    });

    dialogRef.afterClosed().subscribe((result: IAcrescimo) => {
      if (result) {
        const acrescimo: IAcrescimo = {
          name: result.name,
          price: result.price,
        }
        this.acrescimoService.create(acrescimo).subscribe(() => {
          this.acrescimoService.showMessage('Acréscimo cadastrado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogEditar(event: MouseEvent, acrescimo: IAcrescimo): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalAcrescimoComponent, {
      width: '50%',
      data: {
        title: 'Editar acréscimo',
        id: acrescimo.id,
        name: acrescimo.name,
        price: acrescimo.price,
      }
    });

    dialogRef.afterClosed().subscribe((result: IAcrescimo) => {
      if (result) {
        const acrescimo: IAcrescimo = {
          name: result.name,
          price: result.price,
        }
        this.acrescimoService.update(acrescimo, result.id).subscribe(() => {
          this.acrescimoService.showMessage('Acréscimo alterado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogExcluir(event: MouseEvent, acrescimo: IAcrescimo): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalAcrescimoComponent, {
      width: '50%',
      data: { title: 'Excluir acréscimo', id: acrescimo.id, name: acrescimo.name }
    });

    dialogRef.afterClosed().subscribe((result: IAcrescimo) => {
      if (result) {
        this.acrescimoService.delete(result.id).subscribe(() => {
          this.acrescimoService.showMessage('Acréscimo excluído com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

}
