import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Welcome, {{ currentUser()?.name }}!
            </h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-500 dark:bg-blue-600 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Announcements</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">View</p>
                  </div>
                </div>
                <a routerLink="/announcements" class="mt-4 block text-sm text-blue-600 dark:text-blue-400 hover:underline">View all →</a>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-green-500 dark:bg-green-600 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Events</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Browse</p>
                  </div>
                </div>
                <a routerLink="/events" class="mt-4 block text-sm text-blue-600 dark:text-blue-400 hover:underline">View all →</a>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-purple-500 dark:bg-purple-600 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Reels</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Watch</p>
                  </div>
                </div>
                <a routerLink="/reels" class="mt-4 block text-sm text-blue-600 dark:text-blue-400 hover:underline">View feed →</a>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-yellow-500 dark:bg-yellow-600 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">Support</p>
                  </div>
                </div>
                <a routerLink="/tickets" class="mt-4 block text-sm text-blue-600 dark:text-blue-400 hover:underline">View tickets →</a>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
                <div class="space-y-3">
                  <a routerLink="/events" class="block p-3 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    <p class="font-medium text-blue-900 dark:text-blue-300">Browse Events</p>
                    <p class="text-sm text-blue-700 dark:text-blue-400">Find and register for upcoming events</p>
                  </a>
                  <a routerLink="/tickets/create" class="block p-3 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    <p class="font-medium text-green-900 dark:text-green-300">Create Ticket</p>
                    <p class="text-sm text-green-700 dark:text-green-400">Get help from support team</p>
                  </a>
                  <a routerLink="/my-events" class="block p-3 bg-purple-50 dark:bg-purple-900/30 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                    <p class="font-medium text-purple-900 dark:text-purple-300">My Events</p>
                    <p class="text-sm text-purple-700 dark:text-purple-400">View your registered events</p>
                  </a>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 transition-colors">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 h-2 w-2 mt-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-700 dark:text-gray-300">Welcome to the College Portal!</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Start exploring features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService) {}
  
  get currentUser() {
    return this.authService.currentUserSignal;
  }

  ngOnInit() {
    // Dashboard initialization
  }
}
