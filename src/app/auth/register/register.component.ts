import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;
  public showAlertSuccess = false;
  public showAlertError = false;
  public messageAlert = '';

  public registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  createUser() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      this.alertVerifyForm();
      return;
    }

    this.userService
      .createUser(this.registerForm.value as RegisterForm)
      .subscribe({
        next: (resp) => {
          this.router.navigateByUrl('/');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  invalidFields(field: string): boolean {
    if (this.registerForm.get(field)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  alertVerifyForm() {
    this.showAlertError = true;
    this.messageAlert = 'El formulario no es correcto';
    setTimeout(() => {
      this.showAlertError = false;
    }, 3500);
  }

  handlingError(error: any) {
    let msgError = '';
    this.showAlertError = true;
    if (typeof error.message == 'string') {
      msgError = error.message;
    } else {
      error.message.forEach((msg: string) => {
        msgError += ` ${msg} and`;
      });
    }
    this.messageAlert = msgError;
    setTimeout(() => {
      this.showAlertError = false;
    }, 3500);
  }
}
