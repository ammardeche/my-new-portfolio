import { NgClass } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NgxTypedJsModule } from 'ngx-typed-js';
import Swiper from 'swiper';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { register } from 'swiper/element/bundle';
import Aos from 'aos';

@Component({
  selector: 'app-home',
  imports: [NgxTypedJsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, AfterViewInit {
  ngOnInit(): void {
    register();
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 2000, // animation duration in ms
      once: false, // whether animation should happen only once
    });
  }
}
