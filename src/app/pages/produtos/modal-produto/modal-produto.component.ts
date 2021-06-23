import { ModalAlertComponent } from './../../modal-alert/modal-alert.component';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { IProduct } from '../../../models/IProduct.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormProduct } from '../../../models/IFormProduct.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ModalImagemComponent } from '../../modal-imagem/modal-imagem.component';

@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.component.html',
  styleUrls: ['./modal-produto.component.scss']
})
export class ModalProdutoComponent implements OnInit {

  produtoForm: FormGroup;
  vaiEditar: boolean;
  img64: any;

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
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      price: [this.data.price, Validators.required]
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
          const imgBase64Path = e.target.result;
          this.img64 = imgBase64Path
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
    }
  }

  abrirModalImagem(image: string): void {
    this.dialog.open(ModalImagemComponent, {
      width: 'auto',
      height: 'auto',
      data: { image },
    });
  }

  removerImagem(image: string): void {
    const imagensUpload = this.produtoForm.get('image')?.value;
    if (!imagensUpload) {
      this.dialog.open(ModalAlertComponent, {
        width: 'auto',
        height: 'auto',
        data: { title: 'Atenção', text: 'Esta imagem não pode ser removida. É necessário ao menos uma imagem para o produto, e nenhuma nova imagem foi anexada em upload' }
      })
    } else {
      console.log('Remover imagem: ', image);
    }
  }

}
