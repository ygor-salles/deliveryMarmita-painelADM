import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessaoService } from 'src/app/services/sessao.service';
import { ModalAlertComponent } from './../../pages/modal-alert/modal-alert.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private sessaoService: SessaoService,) { }

  ngOnInit(): void {
  }

  logout(evento: MouseEvent): void {
    evento.preventDefault();

    const dialogRef = this.dialog.open(ModalAlertComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        title: 'Sair do sistema',
        text: `Você tem certeza de que deseja Sair?`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sessaoService.logout();
        this.router.navigate(['login']);
      }
    });
  }

}
