import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import AOS from 'aos';

interface WebsiteType {
  value: string;
  label: string;
  icon: string;
  basePrice: number;
  deliveryDays: number;
}

@Component({
  selector: 'app-get-started',
  imports: [FormsModule],
  templateUrl: './get-started.html',
  styleUrl: './get-started.scss',
})
export class GetStarted implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 2000, // animation duration in ms
      once: false, // whether animation should happen only once
    });
  }
  // Signals
  websiteType = signal<string>('');
  customDescription = signal<string>('');
  numPages = signal<number>(1);
  formSubmitted = signal<boolean>(false);
  price = signal<number>(0);

  // Constants
  readonly maxPages = 10;

  // Website types configuration
  readonly websiteTypes: WebsiteType[] = [
    { value: 'landing', label: 'Landing Page', icon: '🚀', basePrice: 50, deliveryDays: 5 },
    { value: 'portfolio', label: 'Portfolio', icon: '🎨', basePrice: 70, deliveryDays: 7 },
    { value: 'blog', label: 'Blog', icon: '📝', basePrice: 60, deliveryDays: 10 },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒', basePrice: 100, deliveryDays: 14 },
    { value: 'custom', label: 'Custom', icon: '✨', basePrice: 150, deliveryDays: 21 },
  ];

  // Computed properties
  showCustomInput = computed(() => this.websiteType() === 'custom');

  isFormValid = computed(() => {
    if (!this.websiteType()) return false;
    if (this.websiteType() === 'custom' && this.customDescription().trim().length < 10)
      return false;
    return this.numPages() >= 1 && this.numPages() <= this.maxPages;
  });

  calculateProgress = computed(() => {
    let progress = 0;
    if (this.websiteType()) progress += 50;
    if (this.isFormValid()) progress += 50;
    return progress;
  });

  // Methods
  incrementPages(): void {
    if (this.numPages() < this.maxPages) {
      this.numPages.update((p) => p + 1);
    }
  }

  decrementPages(): void {
    if (this.numPages() > 1) {
      this.numPages.update((p) => p - 1);
    }
  }

  calculatePrice(): number {
    if (!this.websiteType()) return 0;

    const selectedType = this.websiteTypes.find((t) => t.value === this.websiteType());
    if (!selectedType) return 0;

    let price = selectedType.basePrice;
    const pages = this.numPages();

    // Price calculation logic
    switch (this.websiteType()) {
      case 'landing':
        price += pages * 10;
        break;
      case 'portfolio':
        price += pages * 15;
        break;
      case 'blog':
        price += pages * 12;
        break;
      case 'ecommerce':
        price += pages * 20;
        break;
      case 'custom':
        price += pages * 25;
        break;
    }

    // Apply discount for larger projects
    if (pages >= 5) {
      price *= 0.9; // 10% discount
    }

    return Math.round(price);
  }

  calculateDeliveryTime(): number {
    const selectedType = this.websiteTypes.find((t) => t.value === this.websiteType());
    if (!selectedType) return 0;

    let days = selectedType.deliveryDays;
    const pages = this.numPages();

    // Adjust delivery time based on pages
    if (pages > 3) {
      days += Math.ceil(pages / 3) * 2;
    }

    return days;
  }

  getWebsiteTypeLabel(): string {
    const type = this.websiteTypes.find((t) => t.value === this.websiteType());
    return type ? type.label : 'Unknown';
  }

  submitForm(): void {
    if (!this.isFormValid()) return;

    const calculatedPrice = this.calculatePrice();
    this.price.set(calculatedPrice);

    // Add a small delay for animation effect
    setTimeout(() => {
      this.formSubmitted.set(true);
    }, 500);
  }

  resetForm(): void {
    this.websiteType.set('');
    this.customDescription.set('');
    this.numPages.set(1);
    this.formSubmitted.set(false);
    this.price.set(0);
  }
}
