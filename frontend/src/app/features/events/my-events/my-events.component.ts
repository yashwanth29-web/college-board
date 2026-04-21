import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../shared/models/event.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">My Registered Events</h1>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else if (events().length === 0) {
              <div class="bg-white rounded-lg shadow p-12 text-center">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Registered Events</h3>
                <p class="text-gray-600 mb-6">You haven't registered for any events yet. Browse available events and register to get started!</p>
                <a routerLink="/events" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Events
                </a>
              </div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (event of events(); track event.id) {
                  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div class="p-6">
                      <div class="flex justify-between items-start mb-2">
                        <h2 class="text-xl font-semibold text-gray-800">
                          {{ event.title }}
                        </h2>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Registered
                        </span>
                      </div>
                      
                      <p class="text-gray-600 mb-4 line-clamp-2">
                        {{ event.description }}
                      </p>
                      
                      <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600">
                          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ event.date | date:'mediumDate' }} at {{ event.time }}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {{ event.location }}
                        </div>
                      </div>

                      <a 
                        [routerLink]="['/events', event.id]"
                        class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class MyEventsComponent implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadMyEvents();
  }

  loadMyEvents() {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        // Check if it's a 403 error (admin trying to access student-only endpoint)
        if (err.status === 403) {
          this.error.set(null); // Don't show error, show empty state instead
          this.events.set([]); // Set empty array to trigger the "no events" message
        } else {
          this.error.set('Failed to load your events');
        }
      }
    });
  }
}
