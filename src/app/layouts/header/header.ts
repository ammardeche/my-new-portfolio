import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);

  // Signal for mobile menu state
  isMenuOpen = signal(false);

  // Signal for active route
  activeRoute = signal('');

  ngOnInit() {
    // Set initial active route
    this.activeRoute.set(this.router.url.slice(1));

    // Update active route on navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.activeRoute.set(url === '/' ? '' : url.slice(1));
        this.closeMenu();
      });
  }

  // Close menu on route change
  onRouteClick(route: string) {
    this.activeRoute.set(route);
    this.closeMenu();
  }

  // Toggle mobile menu
  toggleMenu() {
    this.isMenuOpen.update((value) => !value);

    // Toggle body scroll
    if (this.isMenuOpen()) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  // Close mobile menu
  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.classList.remove('menu-open');
  }

  // Close menu on escape key - FIXED TYPE
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  // Close menu when clicking outside - FIXED TYPE
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isMenuOpen() && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
      this.closeMenu();
    }
  }

  // Optional: Close menu on window resize to large screen
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const window = event.target as Window;
    if (window.innerWidth >= 1024 && this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
