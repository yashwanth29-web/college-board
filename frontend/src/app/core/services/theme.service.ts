import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Apply theme on initialization
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleTheme() {
    this.isDarkMode.update(current => !current);
  }

  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
