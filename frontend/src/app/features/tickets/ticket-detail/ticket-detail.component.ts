import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../shared/models/ticket.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-4xl mx-auto">
            <a routerLink="/tickets" class="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Tickets
            </a>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else if (ticket()) {
              <div class="bg-white rounded-lg shadow-lg p-8">
                <div class="flex justify-between items-start mb-6">
                  <h1 class="text-3xl font-bold text-gray-800">
                    {{ ticket()!.subject }}
                  </h1>
                  <span [class]="getStatusClass(ticket()!.status)">
                    {{ ticket()!.status | uppercase }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
                  <div>
                    <p class="text-sm text-gray-500">Category</p>
                    <p class="font-medium text-gray-800">{{ ticket()!.category }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Created</p>
                    <p class="font-medium text-gray-800">{{ ticket()!.createdAt | date:'medium' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Last Updated</p>
                    <p class="font-medium text-gray-800">{{ ticket()!.updatedAt | date:'medium' }}</p>
                  </div>
                  @if (ticket()!.assignedTo) {
                    <div>
                      <p class="text-sm text-gray-500">Assigned To</p>
                      <p class="font-medium text-gray-800">{{ ticket()!.assignedTo?.name }}</p>
                    </div>
                  }
                </div>

                <div class="mb-6">
                  <h2 class="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ ticket()!.description }}</p>
                </div>

                @if (ticket()!.status === 'resolved' || ticket()!.status === 'closed') {
                  <div class="bg-green-50 border border-green-200 rounded p-4">
                    <p class="text-green-800">
                      This ticket has been {{ ticket()!.status }}.
                      @if (ticket()!.resolvedAt) {
                        <span class="block text-sm mt-1">
                          Resolved on {{ ticket()!.resolvedAt | date:'medium' }}
                        </span>
                      }
                    </p>
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
export class TicketDetailComponent implements OnInit {
  ticket = signal<Ticket | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTicket(id);
    }
  }

  loadTicket(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ticket');
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
