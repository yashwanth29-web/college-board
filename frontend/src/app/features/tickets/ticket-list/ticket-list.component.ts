import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../shared/models/ticket.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-white">My Tickets</h1>
              <a 
                routerLink="/tickets/create"
                class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Create Ticket
              </a>
            </div>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else if (tickets().length === 0) {
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p class="text-gray-600 dark:text-gray-300 mb-4">You haven't created any tickets yet.</p>
                <a routerLink="/tickets/create" class="text-blue-600 dark:text-blue-400 hover:underline">Create your first ticket</a>
              </div>
            } @else {
              <div class="space-y-4">
                @for (ticket of tickets(); track ticket.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow p-6">
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                          {{ ticket.subject }}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {{ ticket.description }}
                        </p>
                      </div>
                      <span [class]="getStatusClass(ticket.status)">
                        {{ ticket.status | uppercase }}
                      </span>
                    </div>

                    <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span class="flex items-center">
                        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {{ ticket.category }}
                      </span>
                      <span class="flex items-center">
                        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ ticket.createdAt | date:'medium' }}
                      </span>
                      @if (ticket.assignedTo) {
                        <span class="flex items-center">
                          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Assigned to {{ ticket.assignedTo.name }}
                        </span>
                      }
                    </div>

                    <a 
                      [routerLink]="['/tickets', ticket.id]"
                      class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                    >
                      View Details →
                    </a>
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
export class TicketListComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading.set(true);
    this.error.set(null);

    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tickets');
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'open':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in_progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
}
