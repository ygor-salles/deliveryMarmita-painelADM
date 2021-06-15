import { IProduct } from '../../../models/IProduct.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormProduct } from '../../../models/IFormProduct.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

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
    @Inject(MAT_DIALOG_DATA) public data: IFormProduct,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar produto') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.produtoForm = this.formBuilder.group({
      type: [{ value: this.data.type, disabled: this.vaiEditar }, Validators.required],
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      price: [this.data.price, Validators.required],
      image: [this.data.image, FileUploadValidators.filesLimit(1)]
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoProduto = this.produtoForm.getRawValue() as IProduct;
    this.dialogRef.close({...novoProduto, id: this.data.id, status: this.data.status});
  }

}
