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

  tempoChart = 'semana';

  chartBar: any;

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

      this.chartBar = new Chart('chart-bar', {
        type: 'bar',
        data: {
          labels: this.relatorio.arrayWeek.map(rel => rel.name),
          datasets: [{
            label: 'Total: R$',
            data: this.relatorio.arrayWeek.map(rel => rel.value),
            backgroundColor: '#98a4c7',
            borderColor: '#98a4c7',
            borderWidth: 2
          }]
        },
        options: {
          animation: {
            duration: 2000
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              position: 'bottom'
            }],
            yAxes: [{

              gridLines: {
                display: true,
                drawBorder: false
              }
            }]
          },
          responsive: true,
          legend: {
            position: 'bottom',
            display: false
          },
        }
      })
    });

  }

  filtroChart(type: string): void {
    this.tempoChart = type;

    if (type === 'dia') {
      this.chartBar.data.labels = this.relatorio.arrayDay.map(rel => rel.name);
      this.chartBar.data.datasets[0].data = this.relatorio.arrayDay.map(rel => rel.value);
    } else if (type === 'semana') {
      this.chartBar.data.labels = this.relatorio.arrayWeek.map(rel => rel.name);
      this.chartBar.data.datasets[0].data = this.relatorio.arrayWeek.map(rel => rel.value);
    } else {
      this.chartBar.data.labels = this.relatorio.arrayMonth.map(rel => rel.name);
      this.chartBar.data.datasets[0].data = this.relatorio.arrayMonth.map(rel => rel.value);
    }
    this.chartBar.update();
  }

}
