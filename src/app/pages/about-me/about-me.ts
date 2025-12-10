import { AfterViewInit, Component } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-about-me',
  imports: [],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
})
export class AboutMe implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 2000, // animation duration in ms
      once: false, // whether animation should happen only once
    });
  }
}
