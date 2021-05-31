import { Component, OnInit } from '@angular/core';
import { AppService } from './../../services/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private appService: AppService) { }
  isCollapsed = true;
  ngOnInit(): void {
  }

  toggleSidebarPin(): void {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar(): void {
    this.appService.toggleSidebar();
  }

}
