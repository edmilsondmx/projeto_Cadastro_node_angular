import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  userAuthorized!: boolean;
  token: string | null = localStorage.getItem('token');

  constructor(private loginService: LoginService) {}
  ngOnInit(): void {
    if (this.token !== null) {
      this.loginService.userAuthorizedSource.next(true);
    }
    this.loginService.userAuthorized$.subscribe((userAuthorized) => {
      this.userAuthorized = userAuthorized;
    });
  }

  sair() {
    localStorage.removeItem('token');
    this.loginService.userAuthorizedSource.next(false);
  }
}
