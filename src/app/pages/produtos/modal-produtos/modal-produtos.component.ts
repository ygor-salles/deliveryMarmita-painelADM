import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogData } from 'src/app/models/formProduto.model';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-modal-produtos',
  templateUrl: './modal-produtos.component.html',
  styleUrls: ['./modal-produtos.component.scss']
})
export class ModalProdutosComponent implements OnInit {

  public prodForm!: FormGroup;
  public vaiEditar!: boolean;

  constructor(
    public dialogRef: MatDialogRef<ModalProdutosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.data.title === 'Editar produto' ? this.vaiEditar=true : this.vaiEditar=false;

    this.prodForm = this.formBuilder.group({
      selectProduto: [{value: this.data.selectProduto, disabled: this.vaiEditar}, Validators.required],
      nome: [this.data.nome, Validators.required],
      descricao: [this.data.descricao, Validators.required],
      estoque: [this.data.estoque, Validators.min(0)],
      validade: [this.data.validade, Validators.min(0)],
      imagens: [this.data.imagens, [Validators.required, FileUploadValidators.filesLimit(10)]],
    });
  }

  transformImageUrl(imageUrl: string): string {
    return transformProductImageUrl(imageUrl);
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

  confirm() {
    const novoProduto = this.prodForm.getRawValue() as DialogData;
    this.dialogRef.close({
      ...novoProduto,
      id: this.data.id,
      ativo: this.data.ativo,
      created_at: this.data.created_at,
      updated_at: this.data.updated_at,
      link_hotmat: this.data.link_hotmat
    });
  }

}
