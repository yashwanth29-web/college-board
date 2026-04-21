import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AnalyticsOverview } from '../../../shared/models/analytics.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-15px) rotate(5deg);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-slide-in-right {
      animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-scale-in {
      animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-float {
      animation: float 4s ease-in-out infinite;
    }

    .stat-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .stat-card:hover::before {
      left: 100%;
    }

    .stat-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .stat-icon {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.15) rotate(10deg);
    }

    .action-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .action-card::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .action-card:hover::after {
      width: 300px;
      height: 300px;
    }

    .action-card:hover {
      transform: translateX(10px) scale(1.03);
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .progress-bar {
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-600 { animation-delay: 0.6s; }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <main class="p-6 pt-20">
        <div class="max-w-7xl mx-auto">
          <!-- Welcome Header -->
          <div class="mb-10 animate-scale-in">
            <h1 class="text-5xl md:text-6xl font-extrabold mb-3">
              <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-300 text-xl font-medium">Welcome back! Here's your overview for today.</p>
          </div>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <div class="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-5 rounded-2xl shadow-lg animate-fade-in-up">
              <div class="flex items-center">
                <svg class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold">{{ error() }}</span>
              </div>
            </div>
          } @else if (overview()) {
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <!-- Students Card -->
              <div class="stat-card glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-7 animate-fade-in-up delay-100">
                <div class="flex items-start justify-between mb-5">
                  <div class="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 shadow-lg animate-float">
                    <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Students</p>
                    <p class="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {{ overview()!.totalStudents }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Total enrolled</span>
                  <div class="flex items-center text-green-600 dark:text-green-400">
                    <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="text-sm font-bold">Active</span>
                  </div>
                </div>
              </div>

              <!-- Events Card -->
              <div class="stat-card glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-7 animate-fade-in-up delay-200">
                <div class="flex items-start justify-between mb-5">
                  <div class="stat-icon bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 shadow-lg animate-float" style="animation-delay: 0.5s;">
                    <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Events</p>
                    <p class="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {{ overview()!.totalEvents }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Active events</span>
                  <span class="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-md">
                    {{ overview()!.activeEvents }}
                  </span>
                </div>
              </div>

              <!-- Announcements Card -->
              <div class="stat-card glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-7 animate-fade-in-up delay-300">
                <div class="flex items-start justify-between mb-5">
                  <div class="stat-icon bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg animate-float" style="animation-delay: 1s;">
                    <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Announcements</p>
                    <p class="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {{ overview()!.totalAnnouncements }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Published</span>
                  <div class="flex items-center text-purple-600 dark:text-purple-400">
                    <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="text-sm font-bold">Live</span>
                  </div>
                </div>
              </div>

              <!-- Tickets Card -->
              <div class="stat-card glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-7 animate-fade-in-up delay-400">
                <div class="flex items-start justify-between mb-5">
                  <div class="stat-icon bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg animate-float" style="animation-delay: 1.5s;">
                    <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tickets</p>
                    <p class="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {{ overview()!.totalTickets }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Open tickets</span>
                  <span class="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-md">
                    {{ overview()!.openTickets }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Bottom Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Quick Actions -->
              <div class="lg:col-span-2 glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-8 animate-slide-in-right delay-500">
                <div class="flex items-center mb-8">
                  <div class="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-3 mr-4 shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 class="text-3xl font-black text-gray-800 dark:text-white">Quick Actions</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <a routerLink="/admin/students" class="action-card group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600">
                    <div class="flex items-start relative z-10">
                      <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                        <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-black text-blue-900 dark:text-blue-300 text-xl mb-1">Manage Students</p>
                        <p class="text-sm text-blue-700 dark:text-blue-400 font-medium">View and manage student records</p>
                      </div>
                    </div>
                  </a>

                  <a routerLink="/admin/content" class="action-card group p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600">
                    <div class="flex items-start relative z-10">
                      <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                        <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-black text-green-900 dark:text-green-300 text-xl mb-1">Manage Content</p>
                        <p class="text-sm text-green-700 dark:text-green-400 font-medium">Create announcements, events, and reels</p>
                      </div>
                    </div>
                  </a>

                  <a routerLink="/admin/tickets" class="action-card group p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600">
                    <div class="flex items-start relative z-10">
                      <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                        <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-black text-orange-900 dark:text-orange-300 text-xl mb-1">Manage Tickets</p>
                        <p class="text-sm text-orange-700 dark:text-orange-400 font-medium">Review and assign support tickets</p>
                      </div>
                    </div>
                  </a>

                  <a routerLink="/admin/analytics" class="action-card group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600">
                    <div class="flex items-start relative z-10">
                      <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                        <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-black text-purple-900 dark:text-purple-300 text-xl mb-1">View Analytics</p>
                        <p class="text-sm text-purple-700 dark:text-purple-400 font-medium">Track engagement and participation</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <!-- System Status -->
              <div class="glass-effect dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl shadow-2xl p-8 animate-slide-in-right delay-600">
                <div class="flex items-center mb-8">
                  <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-3 mr-4 shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 class="text-3xl font-black text-gray-800 dark:text-white">System Status</h2>
                </div>
                <div class="space-y-6">
                  <div class="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-md">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-gray-700 dark:text-gray-300 font-bold text-lg">Active Events</span>
                      <span class="text-3xl font-black text-green-600 dark:text-green-400">{{ overview()!.activeEvents }}</span>
                    </div>
                    <div class="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-3 overflow-hidden">
                      <div class="progress-bar bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-inner" 
                           [style.width.%]="(overview()!.activeEvents / overview()!.totalEvents) * 100"></div>
                    </div>
                  </div>

                  <div class="p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl border-2 border-orange-200 dark:border-orange-800 shadow-md">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-gray-700 dark:text-gray-300 font-bold text-lg">Open Tickets</span>
                      <span class="text-3xl font-black text-orange-600 dark:text-orange-400">{{ overview()!.openTickets }}</span>
                    </div>
                    <div class="w-full bg-orange-200 dark:bg-orange-900/50 rounded-full h-3 overflow-hidden">
                      <div class="progress-bar bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full shadow-inner" 
                           [style.width.%]="(overview()!.openTickets / overview()!.totalTickets) * 100"></div>
                    </div>
                  </div>

                  <div class="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-md">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-gray-700 dark:text-gray-300 font-bold text-lg">Total Students</span>
                      <span class="text-3xl font-black text-blue-600 dark:text-blue-400">{{ overview()!.totalStudents }}</span>
                    </div>
                    <div class="flex items-center text-blue-600 dark:text-blue-400 mt-3">
                      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span class="text-sm font-bold">All enrolled and active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  overview = signal<AnalyticsOverview | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadOverview();
  }

  loadOverview() {
    this.loading.set(true);
    this.error.set(null);

    this.analyticsService.getOverview().subscribe({
      next: (data) => {
        this.overview.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard data');
        this.loading.set(false);
      }
    });
  }
}
