import { ProdutoService } from './../../../services/produto.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { IProduct } from '../../../models/IProduct.model';

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
  showSpinner = false;

  constructor(
    public dialogRef: MatDialogRef<ModalProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private produtoService: ProdutoService
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
    this.executeSpinner();
    const novoProduto = this.produtoForm.getRawValue() as IProduct;
    // this.dialogRef.close({ ...novoProduto, id: this.data.id, status: this.data.status, img64: this.img64 });

    if (this.data.title === 'Cadastrar produto') {
      const produto: IProduct = {
        name: novoProduto.name,
        description: novoProduto.description,
        price: novoProduto.price,
        type: novoProduto.type,
        size: novoProduto.size,
        image: this.img64.replace(/^data:image\/[a-z]+;base64,/, "")
      };
      this.produtoService.create(produto).subscribe(() => {
        this.stopSpinner(true);
        if (novoProduto.type==='marmita') {
          this.dialogRef.close({ type: 'marmita', message: 'Marmita cadastrada com sucesso' });
        }
        else {
          this.dialogRef.close({ type: 'bebida', message: 'Bebida cadastrada com sucesso' });
        }
      });

    } else if (this.data.title === 'Editar produto') {

      let produto: IProduct;
      if (novoProduto.size) {
        if (this.img64) {
          produto = {
            name: novoProduto.name,
            description: novoProduto.description,
            price: novoProduto.price,
            type: novoProduto.type,
            size: novoProduto.size,
            image: this.img64.replace(/^data:image\/[a-z]+;base64,/, "")
          };
        } else {
          produto = {
            name: novoProduto.name,
            description: novoProduto.description,
            price: novoProduto.price,
            type: novoProduto.type,
            size: novoProduto.size,
          };
        }
      } else {
        if (this.img64) {
          produto = {
            name: novoProduto.name,
            description: novoProduto.description,
            price: novoProduto.price,
            type: novoProduto.type,
            image: this.img64.replace(/^data:image\/[a-z]+;base64,/, "")
          };
        } else {
          produto = {
            name: novoProduto.name,
            description: novoProduto.description,
            price: novoProduto.price,
            type: novoProduto.type,
          };
        }
      }
      this.produtoService.update(produto, this.data.id).subscribe(() => {
        this.stopSpinner(true);
        if (novoProduto.type==='marmita') {
          this.dialogRef.close({ type: 'marmita', message: 'Marmita editada com sucesso' });
        }
        else {
          this.dialogRef.close({ type: 'bebida', message: 'Bebida editada com sucesso' });
        }
      });

    } else {

      this.produtoService.delete(this.data.id).subscribe(() => {
        this.stopSpinner(true);
        if (novoProduto.type==='marmita') {
          this.dialogRef.close({ type: 'marmita', message: 'Marmita excluída com sucesso' });
        }
        else {
          this.dialogRef.close({ type: 'bebida', message: 'Bebida excluída com sucesso' });
        }
      });
    }
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

  executeSpinner(): void {
    this.showSpinner = true;
    this.produtoForm.disable();
  }

  stopSpinner(isExit: boolean): void {
    this.showSpinner = false;
    if (!isExit) {
      this.produtoForm.enable();
    }
  }

}
