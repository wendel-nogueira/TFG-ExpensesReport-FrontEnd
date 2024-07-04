import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '../../../../core/services/index';
import { FileUploadModule } from 'primeng/fileupload';
import { PrimeNGConfig } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { TagComponent } from '../tag/tag.component';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'expensesreport-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
  imports: [
    CommonModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    TagComponent,
    SkeletonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UploadComponent,
      multi: true,
    },
  ],
})
export class UploadComponent implements ControlValueAccessor, OnInit {
  @Input() loading = false;
  @Input() disabled = true;
  @Input() formControl = new FormControl('');
  @Input() useError = false;
  @Input() errors: any = null;
  @Output() valueChange = new EventEmitter<any>();

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  errorMessage = '';
  allErrors = {
    required: 'Required',
  };

  fileToUpload: any;
  fileToUploadUrl: any;
  uploadedFile: any;

  constructor(
    private config: PrimeNGConfig,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    if (this.errors) {
      this.allErrors = { ...this.allErrors, ...this.errors };
    }

    if (this.formControl.value) {
      this.checkErrors();
    }

    this.config.ripple = true;

    this.formControl.statusChanges.subscribe(() => {
      if (this.formControl.errors) {
        this.checkErrors();
      }
    });

    if (this.formControl.value) {
      const url = this.formControl.value;

      this.loading = true;
      fetch(url, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) this.toastService.showError('Error getting file');
          return response.blob();
        })
        .then((blob) => {
          const fileName = url.split('/').pop() as string;
          this.uploadedFile = new File([blob], fileName);
          this.loading = false;
        })
        .catch((error) => {
          console.error('Error:', error);
          this.toastService.showError('Error getting file');
          this.loading = false;
        });
      this.checkErrors();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouch(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  checkErrors() {
    if (this.formControl.errors) {
      const keys = Object.keys(this.formControl.errors);
      this.errorMessage =
        this.allErrors[keys[0] as keyof typeof this.allErrors];
    }
  }

  choose(event: any, callback: any) {
    callback();
  }

  uploadEvent(callback: any) {
    callback();
  }

  onSelect(event: any) {
    this.fileToUpload = event.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = () => {
      this.fileToUploadUrl = reader.result;
    };
  }

  onClear() {
    this.fileToUpload = null;
    this.fileToUploadUrl = null;
  }

  onUpload(event: any) {
    if (event.files.length === 0) {
      this.toastService.showError('No file selected');
      return;
    }

    const body = event.originalEvent.body as {
      content: any;
      contentType: string;
      name: string;
      size: number;
      uri: string;
    };

    this.uploadedFile = event.files[0];

    this.value = body.uri;
    this.onChange(body.uri);
    this.onTouch(body.uri);
    this.valueChange.emit(body.uri);

    this.checkErrors();

    this.toastService.showSuccess('File uploaded successfully');
  }
}
