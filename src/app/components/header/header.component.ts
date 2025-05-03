import { NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonTitle, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, NgIf],
})
export class HeaderComponent implements OnInit {
  @Input() title!: string;
  @Input() backButton!: string;

  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn = false;

  constructor() {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
