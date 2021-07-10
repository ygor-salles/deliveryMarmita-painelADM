import { IFrete } from './../../../models/IFrete.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-frete',
  templateUrl: './modal-frete.component.html',
  styleUrls: ['./modal-frete.component.scss']
})
export class ModalFreteComponent implements OnInit {

  freteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFreteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFrete,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.freteForm = this.formBuilder.group({
      neighborhood: [this.data.neighborhood, Validators.required],
      value: [this.data.value, [Validators.required, Validators.min(0.5)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoFrete = this.freteForm.getRawValue() as IFrete;
    this.dialogRef.close({ ...novoFrete, id: this.data.id });
  }


}
