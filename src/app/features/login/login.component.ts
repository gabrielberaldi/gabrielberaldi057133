import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { AuthFacade } from '../../core/auth/facades/auth.facade';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ButtonComponent, ReactiveFormsModule, InputComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  
  private readonly authFacade = inject(AuthFacade);
  private readonly formBuilder = inject(FormBuilder);
  
  protected loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void { 
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    };
    const credentials = this.loginForm.getRawValue();
    this.authFacade.login(credentials).subscribe();
  }

}
