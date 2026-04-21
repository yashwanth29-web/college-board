import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white overflow-y-auto shadow-xl z-40 transition-colors duration-300">
      <div class="p-4 space-y-1">
        <div class="mb-4">
          <p class="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Navigation</p>
        </div>
        
        <a routerLink="/dashboard" routerLinkActive="bg-blue-600 shadow-lg" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-sm font-medium">Dashboard</span>
        </a>
        
        <a routerLink="/announcements" routerLinkActive="bg-blue-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span class="text-sm font-medium">Announcements</span>
        </a>
        
        <a routerLink="/events" routerLinkActive="bg-blue-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium">Events</span>
        </a>
        
        <a routerLink="/my-events" routerLinkActive="bg-blue-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="text-sm font-medium">My Events</span>
        </a>
        
        <a routerLink="/reels" routerLinkActive="bg-blue-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium">Reels</span>
        </a>
        
        <a routerLink="/tickets" routerLinkActive="bg-blue-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
          <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span class="text-sm font-medium">My Tickets</span>
        </a>
        
        @if (currentUser()?.isStaff) {
          <div class="pt-6 mt-6 border-t border-gray-700 dark:border-gray-800">
            <p class="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin Panel</p>
            
            <a routerLink="/admin" routerLinkActive="bg-purple-600 shadow-lg" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-sm font-medium">Dashboard</span>
            </a>
            
            <a routerLink="/admin/students" routerLinkActive="bg-purple-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-sm font-medium">Students</span>
            </a>
            
            <a routerLink="/admin/content" routerLinkActive="bg-purple-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="text-sm font-medium">Content</span>
            </a>
            
            <a routerLink="/admin/tickets" routerLinkActive="bg-purple-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span class="text-sm font-medium">Tickets</span>
            </a>
            
            <a routerLink="/admin/analytics" routerLinkActive="bg-purple-600 shadow-lg" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 group">
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-sm font-medium">Analytics</span>
            </a>
          </div>
        }
      </div>
    </aside>
  `
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}
  
  get currentUser() {
    return this.authService.currentUserSignal;
  }
}
