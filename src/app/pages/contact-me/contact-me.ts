import { AfterViewInit, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import emailjs from '@emailjs/browser';
import AOS from 'aos';

@Component({
  selector: 'app-contact-me',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss',
})
export class ContactMe implements AfterViewInit {
  contactForm: any; // Declare without initializing
  isSending = false;
  isSent = false;
  isError = false;

  constructor(private fb: FormBuilder) {
    // Initialize form inside the constructor
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.isSent = false;
    this.isError = false;

    const serviceId = 'service_mehqoa9';
    const templateId = 'template_5p6v8lu';
    const publicKey = '8thwn-u0ljQyLuIbs';

    emailjs
      .send(
        serviceId,
        templateId,
        {
          form_name: this.contactForm.value.name, // match template
          reply_to: this.contactForm.value.email,
          message: this.contactForm.value.message,
        },
        { publicKey }
      )
      .then(() => {
        this.isSending = false;
        this.isSent = true;
        this.contactForm.reset();
      })
      .catch(() => {
        this.isSending = false;
        this.isError = true;
      });
  }
  ngAfterViewInit() {
    AOS.init({
      duration: 2000, // animation duration in ms
      once: false, // whether animation should happen only once
    });
  }
}
