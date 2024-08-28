import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AppService } from '../../app.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzStepsModule,
    NzButtonModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputModule,
    NzGridModule,
    NzMessageModule
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  current = 0;
  gens = [0, 1, 2, 3, 4, 5, 6, 7];
  validateForm: FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    birthday: FormControl<string>;
    gen: FormControl<string>;
    phoneNumber: FormControl<string>;
    message: FormControl<string>;

  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private appService: AppService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      phoneNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gen: ['', [Validators.required]],
      message: ['']
    });
  }

  ngOnInit() { }

  submitForm(): void {
    if (this.validateForm.valid) {
      let data: any = {
        email: this.validateForm.value.email,
        phoneNumber: this.validateForm.value.phoneNumber,
        name: this.validateForm.value.name,
        birthday: this.validateForm.value.birthday,
        gen: this.validateForm.value.gen?.toString(),
      };
  
      if (this.validateForm.value.message && this.validateForm.value.message.trim() !== "") {
        data.note = this.validateForm.value.message;
      } else {
        data.note = 'Chúc mừng sinh nhật 10 tuổi Egg Club';
      }
  
      console.log(data);
      this.appService.post<any, any>(data, '/dangky').subscribe(res => {
        if(res.body) {
          if(res.body.code === 201) {
            this.validateForm.reset();
            return this.message.success(res.body.message);
          }
            return this.message.error('Có lỗi xảy ra, vui lòng xem lại thông tin');
        }
        return this.message.error('Có lỗi xảy ra');
      }, (err) => {
        return this.message.error(err.error.message);
      }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log('done');
  }

}
