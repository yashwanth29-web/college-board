import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-3">
            <img src="data:image/jpeg;base64,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" 
                 alt="College Logo" 
                 class="h-10 w-10 rounded-full border-2 border-white shadow-md" />
            <a routerLink="/dashboard" class="text-2xl font-bold hover:text-blue-200 transition-colors">
              College Portal
            </a>
          </div>
          
          <div class="hidden md:flex items-center space-x-2">
            @if (currentUser()) {
              <a routerLink="/dashboard" routerLinkActive="bg-blue-800" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Dashboard</a>
              <a routerLink="/announcements" routerLinkActive="bg-blue-800" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Announcements</a>
              <a routerLink="/events" routerLinkActive="bg-blue-800" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Events</a>
              <a routerLink="/reels" routerLinkActive="bg-blue-800" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Reels</a>
              <a routerLink="/tickets" routerLinkActive="bg-blue-800" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Tickets</a>
              @if (currentUser()?.isStaff) {
                <a routerLink="/admin" routerLinkActive="bg-blue-800" class="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">Admin</a>
              }
              <div class="ml-4 flex items-center space-x-3 border-l border-blue-500 pl-4">
                <app-theme-toggle />
                <span class="text-sm">{{ currentUser()?.name }}</span>
                <button (click)="logout()" class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md">Logout</button>
              </div>
            }
          </div>

          <div class="md:hidden flex items-center">
            <button (click)="toggleMenu()" class="p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                @if (menuOpen()) {
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                } @else {
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      @if (menuOpen()) {
        <div class="md:hidden bg-blue-800 border-t border-blue-600">
          <div class="px-2 pt-2 pb-3 space-y-1">
            @if (currentUser()) {
              <div class="px-3 py-2 text-sm text-blue-200">{{ currentUser()?.name }}</div>
              <a routerLink="/dashboard" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Dashboard</a>
              <a routerLink="/announcements" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Announcements</a>
              <a routerLink="/events" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Events</a>
              <a routerLink="/reels" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Reels</a>
              <a routerLink="/tickets" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Tickets</a>
              @if (currentUser()?.isStaff) {
                <a routerLink="/admin" (click)="toggleMenu()" routerLinkActive="bg-blue-900" class="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors">Admin</a>
              }
              <button (click)="logout()" class="w-full text-left px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors mt-2">Logout</button>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  menuOpen = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  get currentUser() {
    return this.authService.currentUserSignal;
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.menuOpen.set(false);
  }
}
