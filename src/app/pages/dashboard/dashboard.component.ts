import { RelatoriosService } from './../../services/relatorios.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

interface IReports {
  arrayDay: { value: number; name: string; }[];
  totalDay: number;
  arrayWeek: { value: number; name: string; }[];
  totalWeek: number;
  arrayMonth: { value: number; name: string; }[];
  totalMonth: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalPedidos: string;
  relatorio: IReports = {
    totalDay: null,
    totalMonth: null,
    totalWeek: null,
    arrayDay: null,
    arrayMonth: null,
    arrayWeek: null
  }

  constructor(
    private pedidoService: PedidoService,
    private relatorioService: RelatoriosService
  ) { }

  ngOnInit() {
    this.pedidoService.countOrders().subscribe(result => {
      this.totalPedidos = result.qtd;
    });

    this.relatorioService.handle().subscribe(result => {
      this.relatorio = result;

      new Chart('chart-bar', {
        type: 'bar',
        data: {
          labels: this.relatorio.arrayWeek.map(rel => rel.name),
          datasets: [{
            label: 'Produtos',
            data: this.relatorio.arrayWeek.map(rel => rel.value),
            backgroundColor: '#5b6582',
            borderColor: '#5b6582',
            borderWidth: 2
          }]
        },
        options:{
          barValueSpacing: 1,
          scales: {
              yAxes: [{
                ticks: {
                    fontColor: 'rgba(0,0,0,.6)',
                    fontStyle: 'bold',
                    beginAtZero: true,
                    maxTicksLimit: 8,
                    padding: 10
                }
            }],
            xAxes: [{
              barPercentage: 0.4
          }]
          },
          responsive: true,
          legend: {
            position:'bottom',
            display:false
          },
        }
      })
    });

  }

}
