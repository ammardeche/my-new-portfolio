import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-service',
  imports: [RouterLink],
  templateUrl: './service.html',
  styleUrl: './service.scss',
})
export class Service implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 2000, // animation duration in ms
      once: false, // whether animation should happen only once
    });
  }
}
