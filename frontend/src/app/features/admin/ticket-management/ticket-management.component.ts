import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketStatus } from '../../../shared/models/ticket.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-navbar />
      
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Ticket Management</h1>

          <div class="flex gap-4 mb-6 overflow-x-auto">
            <button 
              (click)="filterByStatus(undefined)"
              [class]="!selectedStatus() ? 'px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap'"
            >
              All Tickets
            </button>
            <button 
              (click)="filterByStatus('open')"
              [class]="selectedStatus() === 'open' ? 'px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap'"
            >
              Open
            </button>
            <button 
              (click)="filterByStatus('in_progress')"
              [class]="selectedStatus() === 'in_progress' ? 'px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap'"
            >
              In Progress
            </button>
            <button 
              (click)="filterByStatus('resolved')"
              [class]="selectedStatus() === 'resolved' ? 'px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap'"
            >
              Resolved
            </button>
            <button 
              (click)="filterByStatus('closed')"
              [class]="selectedStatus() === 'closed' ? 'px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap'"
            >
              Closed
            </button>
          </div>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error() }}
            </div>
          } @else if (tickets().length === 0) {
            <div class="bg-white rounded-lg shadow p-8 text-center">
              <p class="text-gray-600">No tickets found.</p>
            </div>
          } @else {
            <div class="space-y-4">
              @for (ticket of tickets(); track ticket.id) {
                <div class="bg-white rounded-lg shadow p-6">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                      <h2 class="text-xl font-semibold text-gray-800 mb-1">
                        {{ ticket.subject }}
                      </h2>
                      <p class="text-gray-600 mb-2">
                        {{ ticket.description }}
                      </p>
                      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Student: {{ ticket.student.name }} ({{ ticket.student.studentId }})</span>
                        <span>Category: {{ ticket.category }}</span>
                        <span>Created: {{ ticket.createdAt | date:'short' }}</span>
                      </div>
                    </div>
                    <span [class]="getStatusClass(ticket.status)">
                      {{ ticket.status | uppercase }}
                    </span>
                  </div>

                  <div class="flex gap-2 mt-4">
                    @if (ticket.status === 'open') {
                      <button 
                        (click)="updateStatus(ticket.id, 'in_progress')"
                        class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Start Progress
                      </button>
                    }
                    @if (ticket.status === 'in_progress') {
                      <button 
                        (click)="updateStatus(ticket.id, 'resolved')"
                        class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Resolved
                      </button>
                    }
                    @if (ticket.status === 'resolved') {
                      <button 
                        (click)="updateStatus(ticket.id, 'closed')"
                        class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Close Ticket
                      </button>
                    }
                  </div>
                </div>
              }
            </div>

            @if (hasMore()) {
              <div class="mt-6 flex justify-center">
                <button 
                  (click)="loadMore()"
                  [disabled]="loadingMore()"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
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
  `
})
export class TicketManagementComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  hasMore = signal(true);
  selectedStatus = signal<TicketStatus | undefined>(undefined);

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading.set(true);
    this.error.set(null);

    this.ticketService.getTickets(this.selectedStatus(), this.currentPage()).subscribe({
      next: (response) => {
        this.tickets.set(response.results);
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tickets');
        this.loading.set(false);
      }
    });
  }

  filterByStatus(status: TicketStatus | undefined) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadTickets();
  }

  loadMore() {
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.ticketService.getTickets(this.selectedStatus(), nextPage).subscribe({
      next: (response) => {
        this.tickets.update(current => [...current, ...response.results]);
        this.currentPage.set(nextPage);
        this.hasMore.set(!!response.next);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }

  updateStatus(ticketId: number, status: TicketStatus) {
    this.ticketService.updateTicketStatus(ticketId, status).subscribe({
      next: () => {
        this.loadTickets();
      },
      error: () => {
        this.error.set('Failed to update ticket status');
      }
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap';
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
