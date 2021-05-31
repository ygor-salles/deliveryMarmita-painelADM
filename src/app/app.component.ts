import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { SessaoService } from './services/sessao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pro-dashboard-angular';
  logado: boolean;

  constructor(private appService: AppService, private sessaoService: SessaoService) {}

  ngOnInit(): void {
    this.logado = this.sessaoService.isLogged();
    this.sessaoService.isLoggedAsObservable().subscribe(logged => {
      this.logado = logged;
    });
  }

  getClasses(): any {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    };
    return classes;
  }
  toggleSidebar(): void {
    this.appService.toggleSidebar();
  }
}
