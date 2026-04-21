import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <!-- Sun Icon (Light Mode) -->
      <svg
        *ngIf="!themeService.isDarkMode()"
        class="w-6 h-6 text-yellow-500 transition-transform duration-300 hover:rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      <!-- Moon Icon (Dark Mode) -->
      <svg
        *ngIf="themeService.isDarkMode()"
        class="w-6 h-6 text-indigo-400 transition-transform duration-300 hover:rotate-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  `,
  styles: [`
    button {
      -webkit-tap-highlight-color: transparent;
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
