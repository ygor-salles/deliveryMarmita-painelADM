import { IProduto } from './../../models/IProduto.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-acordian',
  templateUrl: './acordian.component.html',
  styleUrls: ['./acordian.component.scss']
})
export class AcordianComponent implements OnInit {

  @Input('produto') produto: IProduto;

  constructor() { }

  ngOnInit(): void {
  }

}
