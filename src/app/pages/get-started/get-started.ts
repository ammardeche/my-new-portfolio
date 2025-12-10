import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import AOS from 'aos';
import emailjs from '@emailjs/browser';

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
  // Signals
  websiteType = signal<string>('');
  customDescription = signal<string>('');
  numPages = signal<number>(1);
  formSubmitted = signal<boolean>(false);
  price = signal<number>(0);
  isSendingEmail = signal<boolean>(false);
  emailSent = signal<boolean>(false);

  // EmailJS Configuration - UPDATE THESE WITH YOUR CREDENTIALS
  private readonly emailConfig = {
    serviceID: 'service_mehqoa9', // Replace with your EmailJS service ID
    templateID: 'template_o25nx8p', // Replace with your EmailJS template ID
    publicKey: '8thwn-u0ljQyLuIbs', // Replace with your EmailJS public key
    userEmail: 'YOUR_EMAIL@gmail.com', // Your email to receive notifications
  };

  // Constants
  readonly maxPages = 10;

  // Website types configuration
  readonly websiteTypes: WebsiteType[] = [
    { value: 'landing', label: 'Landing Page', icon: '🚀', basePrice: 50, deliveryDays: 5 },
    { value: 'portfolio', label: 'Portfolio', icon: '🎨', basePrice: 60, deliveryDays: 7 },
    { value: 'blog', label: 'Blog', icon: '📝', basePrice: 80, deliveryDays: 10 },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒', basePrice: 100, deliveryDays: 14 },
    { value: 'custom', label: 'Custom Project', icon: '✨', basePrice: 200, deliveryDays: 21 },
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

  // Initialize EmailJS
  constructor() {
    // Initialize EmailJS with your public key
    emailjs.init(this.emailConfig.publicKey);
  }

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

    // Price per page based on website type
    const pricePerPage: Record<string, number> = {
      landing: 50,
      portfolio: 75,
      blog: 65,
      ecommerce: 125,
      custom: 150,
    };

    const perPage = pricePerPage[this.websiteType()] || 50;
    price += (pages - 1) * perPage;

    // Apply discounts
    if (pages >= 5) {
      price *= 0.85; // 15% discount for 5+ pages
    } else if (pages >= 3) {
      price *= 0.9; // 10% discount for 3-4 pages
    }

    return Math.round(price);
  }

  calculateDeliveryTime(): number {
    const selectedType = this.websiteTypes.find((t) => t.value === this.websiteType());
    if (!selectedType) return 0;

    let days = selectedType.deliveryDays;
    const pages = this.numPages();

    // Add days based on pages
    if (pages > 5) {
      days += Math.ceil(pages / 2);
    } else if (pages > 3) {
      days += Math.ceil(pages / 3);
    }

    return days;
  }

  getWebsiteTypeLabel(): string {
    const type = this.websiteTypes.find((t) => t.value === this.websiteType());
    return type ? type.label : 'Unknown';
  }

  // Send email using EmailJS
  async sendEmail(): Promise<void> {
    if (this.isSendingEmail() || !this.isFormValid()) return;

    this.isSendingEmail.set(true);

    const templateParams = {
      to_email: this.emailConfig.userEmail,
      website_type: this.getWebsiteTypeLabel(),
      custom_description: this.customDescription(),
      num_pages: this.numPages(),
      estimated_price: this.calculatePrice(),
      delivery_time: this.calculateDeliveryTime(),
      submission_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await emailjs.send(
        this.emailConfig.serviceID,
        this.emailConfig.templateID,
        templateParams
      );

      console.log('Email sent successfully!', response);
      this.emailSent.set(true);

      // Show success notification
      this.showNotification(
        'Email sent successfully! You will receive a confirmation shortly.',
        'success'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      this.emailSent.set(false);

      // Show error notification but still allow form submission
      this.showNotification(
        'Email not sent, but form submitted successfully. We will contact you soon.',
        'warning'
      );
    } finally {
      this.isSendingEmail.set(false);
    }
  }

  // Submit form with email sending
  async submitForm(): Promise<void> {
    if (!this.isFormValid()) return;

    const calculatedPrice = this.calculatePrice();
    this.price.set(calculatedPrice);

    // Try to send email first
    await this.sendEmail();

    // Then show success message
    setTimeout(() => {
      this.formSubmitted.set(true);

      // Scroll to top of confirmation
      setTimeout(() => {
        document.querySelector('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 500);
  }

  // Reset form
  resetForm(): void {
    this.websiteType.set('');
    this.customDescription.set('');
    this.numPages.set(1);
    this.formSubmitted.set(false);
    this.price.set(0);
    this.emailSent.set(false);
  }

  // Show notification (you can implement a toast service or use simple alert)
  private showNotification(
    message: string,
    type: 'success' | 'error' | 'warning' = 'success'
  ): void {
    // Simple notification - you can replace with a proper toast library
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : type === 'error'
        ? 'bg-red-500 text-white'
        : 'bg-yellow-500 text-black'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('translate-x-0');
    }, 10);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('translate-x-0');
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  checkEmail(): void {
    // You can redirect to Gmail, Outlook, or any email client
    const emailProviders = [
      'https://mail.google.com',
      'https://outlook.live.com',
      'https://mail.yahoo.com',
    ];

    // Open the most common ones
    window.open('https://mail.google.com', '_blank');

    // Optional: Show a toast notification
    this.showNotification('Opening Gmail... Check your inbox!');
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }
}
