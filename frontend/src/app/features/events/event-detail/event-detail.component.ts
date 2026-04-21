import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../shared/models/event.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-4xl mx-auto">
            <a routerLink="/events" class="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Events
            </a>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else if (event()) {
              <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                  {{ event()!.title }}
                </h1>

                @if (successMessage()) {
                  <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {{ successMessage() }}
                  </div>
                }

                @if (registrationError()) {
                  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {{ registrationError() }}
                  </div>
                }

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="flex items-center text-gray-700">
                    <svg class="h-5 w-5 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Date & Time</p>
                      <p class="font-medium">{{ event()!.date | date:'mediumDate' }} at {{ event()!.time }}</p>
                    </div>
                  </div>

                  <div class="flex items-center text-gray-700">
                    <svg class="h-5 w-5 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Location</p>
                      <p class="font-medium">{{ event()!.location }}</p>
                    </div>
                  </div>

                  <div class="flex items-center text-gray-700">
                    <svg class="h-5 w-5 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-500">Capacity</p>
                      <p class="font-medium">
                        {{ event()!.currentRegistrations }} / {{ event()!.capacity }}
                        @if (event()!.isFull) {
                          <span class="text-red-600 ml-2">(Full)</span>
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mb-6">
                  <h2 class="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ event()!.description }}</p>
                </div>

                <button 
                  (click)="registerForEvent()"
                  [disabled]="event()!.isFull || registering()"
                  class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  @if (registering()) {
                    <span>Registering...</span>
                  } @else if (event()!.isFull) {
                    <span>Event Full</span>
                  } @else {
                    <span>Register for Event</span>
                  }
                </button>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  event = signal<Event | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  registering = signal(false);
  successMessage = signal<string | null>(null);
  registrationError = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load event');
        this.loading.set(false);
      }
    });
  }

  registerForEvent() {
    if (!this.event()) return;

    this.registering.set(true);
    this.registrationError.set(null);
    this.successMessage.set(null);

    this.eventService.registerForEvent(this.event()!.id).subscribe({
      next: () => {
        this.registering.set(false);
        this.successMessage.set('Successfully registered for event!');
        setTimeout(() => {
          this.router.navigate(['/my-events']);
        }, 2000);
      },
      error: (err) => {
        this.registering.set(false);
        this.registrationError.set(err.error?.message || 'Failed to register for event');
      }
    });
  }
}
