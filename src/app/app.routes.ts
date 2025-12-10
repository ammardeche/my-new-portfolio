import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { Pricing } from './pages/pricing/pricing';
import { Service } from './pages/service/service';
import { Project } from './pages/project/project';
import { ContactMe } from './pages/contact-me/contact-me';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about-me', component: AboutMe },
  { path: 'pricing', component: Pricing },
  { path: 'service', component: Service },
  { path: 'project', component: Project },
  { path: 'contact-me', component: ContactMe },
];
