import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }
}
