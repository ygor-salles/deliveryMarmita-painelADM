import { IProduto } from './../../../models/IProduto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormProduto } from './../../../models/IFormProduto.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.component.html',
  styleUrls: ['./modal-produto.component.scss']
})
export class ModalProdutoComponent implements OnInit {

  produtoForm: FormGroup;
  vaiEditar: boolean;

  constructor(
    public dialogRef: MatDialogRef<ModalProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormProduto,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar produto') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.produtoForm = this.formBuilder.group({
      tipo: [{ value: this.data.tipo, disabled: this.vaiEditar }, Validators.required],
      nome: [this.data.nome, Validators.required],
      descricao: [this.data.descricao, Validators.required],
      preco: [this.data.preco, Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoProduto = this.produtoForm.getRawValue() as IProduto;
    this.dialogRef.close({...novoProduto, id: this.data.id, status: this.data.status});
  }

}
