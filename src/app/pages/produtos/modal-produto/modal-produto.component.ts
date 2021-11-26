import { ProdutoService } from './../../../services/produto.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { IProduct } from '../../../models/IProduct.model';
import { StorageService } from '../../../services/storage.service';
import { environment } from 'src/environments/environment';

const { name_app, firebaseActive } = environment;

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
    private produtoService: ProdutoService,
    private storageService: StorageService,
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

  async confirm(): Promise<void> {
    this.executeSpinner();
    const novoProduto = this.produtoForm.getRawValue() as IProduct;
    // this.dialogRef.close({ ...novoProduto, id: this.data.id, status: this.data.status, img64: this.img64 });

    if (this.data.title === 'Cadastrar produto') {
      await this.cadastrarProduto(novoProduto);
    } else if (this.data.title === 'Editar produto') {
      await this.editarProduto(novoProduto);
    } else {
      await this.excluirProduto(novoProduto);
    }
  }

  async cadastrarProduto(novoProduto: IProduct): Promise<void> {
    const produto: IProduct = {
      name: novoProduto.name,
      description: novoProduto.description,
      price: novoProduto.price,
      type: novoProduto.type,
      size: novoProduto.size,
      image: this.img64.replace(/^data:image\/[a-z]+;base64,/, ""),
      firebasePost: false
    };

    if (firebaseActive) {
      const urlImage = await this.postNewImageFireabse();
      if (urlImage) {
        produto.firebasePost = true;
        produto.image = urlImage;
      }
    }

    this.produtoService.create(produto).subscribe(() => {
      this.stopSpinner(true);
      if (novoProduto.type==='marmita') {
        this.dialogRef.close({ type: 'marmita', message: 'Marmita cadastrada com sucesso' });
      }
      else {
        this.dialogRef.close({ type: 'bebida', message: 'Bebida cadastrada com sucesso' });
      }
    });
  }

  async editarProduto(novoProduto: IProduct): Promise<void> {
    let produto: IProduct;
    if (novoProduto.size) {
      if (this.img64) {
        produto = {
          name: novoProduto.name,
          description: novoProduto.description,
          price: novoProduto.price,
          type: novoProduto.type,
          size: novoProduto.size,
          image: this.img64.replace(/^data:image\/[a-z]+;base64,/, ""),
          firebasePost: false
        };
      } else {
        produto = {
          name: novoProduto.name,
          description: novoProduto.description,
          price: novoProduto.price,
          type: novoProduto.type,
          size: novoProduto.size,
          firebasePost: false
        };
      }
    } else {
      if (this.img64) {
        produto = {
          name: novoProduto.name,
          description: novoProduto.description,
          price: novoProduto.price,
          type: novoProduto.type,
          image: this.img64.replace(/^data:image\/[a-z]+;base64,/, ""),
          firebasePost: false
        };
      } else {
        produto = {
          name: novoProduto.name,
          description: novoProduto.description,
          price: novoProduto.price,
          type: novoProduto.type,
          firebasePost: false
        };
      }
    }

    // Cadastro e deleção de imagem no firebase
    if(this.img64 && firebaseActive) {
      const urlImage = await this.postNewImageFireabse()
      await this.deleteOldImageFirebase()
      produto.firebasePost = true;
      produto.image = urlImage || '';
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
  }

  async excluirProduto(novoProduto: IProduct) {
    await this.deleteOldImageFirebase();

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

  async postNewImageFireabse(): Promise<string> {
    return await this.storageService.subirImagen(`${name_app}_${Date.now()}`, this.img64);
  }

  async deleteOldImageFirebase(): Promise<void> {
    if (this.data.image.slice(0, 4) === 'http') {
      await this.storageService.removerImagem(this.data.image);
    }
  }

  transformImageUrl(imageUrl: string): string {
    return imageUrl.slice(0, 4) === 'http' ? imageUrl : transformProductImageUrl(imageUrl);
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
