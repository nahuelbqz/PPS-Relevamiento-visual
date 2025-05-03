import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    // IonLabel,
    IonItem,
    IonButton,
    IonIcon,
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    HeaderComponent,
    ReactiveFormsModule,
  ],
})
export class RegisterPage {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  hidePassword = true;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage: string | null = null;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    const rawForm = this.form.getRawValue();

    this.authService
      .register(rawForm.username, rawForm.email, rawForm.password)
      .subscribe((result) => {
        if (result.error) {
          this.errorMessage = result.error.message;
        } else {
          console.log('Registro exitoso');
          this.router.navigateByUrl('/home');
        }
      });
  }
}
