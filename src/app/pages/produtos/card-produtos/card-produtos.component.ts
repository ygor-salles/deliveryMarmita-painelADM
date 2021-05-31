import { Imagem } from './../../../models/imagem.model';
import { Component, Input, OnInit } from '@angular/core';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';

@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrls: ['./card-produtos.component.scss']
})
export class CardProdutosComponent implements OnInit {

  @Input('imagens') imagens!: Imagem[];
  @Input('descricao') descricao!: string;

  constructor() { }

  ngOnInit(): void {
  }

  transformImageUrl(imageUrl: string): string {
    return transformProductImageUrl(imageUrl);
  }

}
