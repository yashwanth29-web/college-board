import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../shared/models/event.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Upcoming Events</h1>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (event of events(); track event.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
                    <div class="p-6">
                      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {{ event.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {{ event.description }}
                      </p>
                      
                      <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ event.date | date:'mediumDate' }} at {{ event.time }}
                        </div>
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ event.location }}
                        </div>
                        <div class="flex items-center text-sm">
                          <svg class="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span [class]="event.isFull ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                            {{ event.currentRegistrations }} / {{ event.capacity }}
                            @if (event.isFull) {
                              <span class="ml-1">(Full)</span>
                            }
                          </span>
                        </div>
                      </div>

                      <a 
                        [routerLink]="['/events', event.id]"
                        class="block w-full text-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                }
              </div>

              @if (hasMore()) {
                <div class="mt-6 flex justify-center">
                  <button 
                    (click)="loadMore()"
                    [disabled]="loadingMore()"
                    class="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
                  >
                    @if (loadingMore()) {
                      <span>Loading...</span>
                    } @else {
                      <span>Load More</span>
                    }
                  </button>
                </div>
              }
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class EventListComponent implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  hasMore = signal(true);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getEvents(this.currentPage()).subscribe({
      next: (response) => {
        this.events.set(response.results);
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load events');
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.eventService.getEvents(nextPage).subscribe({
      next: (response) => {
        this.events.update(current => [...current, ...response.results]);
        this.currentPage.set(nextPage);
        this.hasMore.set(!!response.next);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }
}
