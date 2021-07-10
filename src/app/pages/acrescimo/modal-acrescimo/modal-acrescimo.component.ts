import { IAcrescimo } from './../../../models/IAcrescimo.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-acrescimo',
  templateUrl: './modal-acrescimo.component.html',
  styleUrls: ['./modal-acrescimo.component.scss']
})
export class ModalAcrescimoComponent implements OnInit {

  acrescimoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalAcrescimoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAcrescimo,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.acrescimoForm = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      price: [this.data.price, [Validators.required, Validators.min(0.5)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoAcrescimo = this.acrescimoForm.getRawValue() as IAcrescimo;
    this.dialogRef.close({ ...novoAcrescimo, id: this.data.id });
  }

}
