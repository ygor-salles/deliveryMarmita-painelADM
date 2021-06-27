import { ModalAlertComponent } from './../../modal-alert/modal-alert.component';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { IProduct } from '../../../models/IProduct.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormProduct } from '../../../models/IFormProduct.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.component.html',
  styleUrls: ['./modal-produto.component.scss']
})
export class ModalProdutoComponent implements OnInit {

  produtoForm: FormGroup;
  vaiEditar: boolean;
  img64: any;
  showUpdateImage = false;

  constructor(
    public dialogRef: MatDialogRef<ModalProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormProduct,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar produto') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.produtoForm = this.formBuilder.group({
      type: [{ value: this.data.type, disabled: this.vaiEditar }, Validators.required],
      size: [{ value: this.data.size, disabled: this.vaiEditar }],
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      price: [this.data.price, [Validators.required, Validators.min(0.5)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoProduto = this.produtoForm.getRawValue() as IProduct;
    this.dialogRef.close({ ...novoProduto, id: this.data.id, status: this.data.status, img64: this.img64 });
  }

  transformImageUrl(imageUrl: string): string {
    return transformProductImageUrl(imageUrl);
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.img64 = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
    }
  }

  removerImagem(): void {
    this.showUpdateImage = true;
  }

  cancelarAlteracao(): void {
    this.img64 = null;
    this.showUpdateImage = false;
  }

}
