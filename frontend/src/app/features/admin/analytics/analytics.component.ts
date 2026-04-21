import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ParticipationData, TicketAnalytics } from '../../../shared/models/analytics.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-navbar />
      
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error() }}
            </div>
          } @else {
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              @if (participationData()) {
                <div class="bg-white rounded-lg shadow p-6">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Event Participation</h2>
                  <div class="mb-4">
                    <p class="text-3xl font-bold text-blue-600">{{ participationData()!.totalRegistrations }}</p>
                    <p class="text-sm text-gray-600">Total Registrations</p>
                  </div>
                  
                  <div class="space-y-3">
                    <h3 class="font-medium text-gray-700">Top Events</h3>
                    @for (event of participationData()!.events.slice(0, 5); track event.eventId) {
                      <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div class="flex-1">
                          <p class="font-medium text-gray-800">{{ event.eventTitle }}</p>
                          <p class="text-sm text-gray-600">{{ event.registrations }} / {{ event.capacity }} registered</p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-semibold text-blue-600">{{ (event.fillRate || 0).toFixed(1) }}%</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @if (ticketAnalytics()) {
                <div class="bg-white rounded-lg shadow p-6">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Ticket Analytics</h2>
                  <div class="mb-4">
                    <p class="text-3xl font-bold text-yellow-600">{{ ticketAnalytics()!.totalTickets }}</p>
                    <p class="text-sm text-gray-600">Total Tickets</p>
                  </div>

                  <div class="space-y-3 mb-4">
                    <h3 class="font-medium text-gray-700">Status Distribution</h3>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="p-3 bg-blue-50 rounded">
                        <p class="text-2xl font-bold text-blue-600">{{ ticketAnalytics()!.statusDistribution.open }}</p>
                        <p class="text-sm text-gray-600">Open</p>
                      </div>
                      <div class="p-3 bg-yellow-50 rounded">
                        <p class="text-2xl font-bold text-yellow-600">{{ ticketAnalytics()!.statusDistribution.in_progress }}</p>
                        <p class="text-sm text-gray-600">In Progress</p>
                      </div>
                      <div class="p-3 bg-green-50 rounded">
                        <p class="text-2xl font-bold text-green-600">{{ ticketAnalytics()!.statusDistribution.resolved }}</p>
                        <p class="text-sm text-gray-600">Resolved</p>
                      </div>
                      <div class="p-3 bg-gray-50 rounded">
                        <p class="text-2xl font-bold text-gray-600">{{ ticketAnalytics()!.statusDistribution.closed }}</p>
                        <p class="text-sm text-gray-600">Closed</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-3 bg-purple-50 rounded">
                    <p class="text-sm text-gray-600">Average Resolution Time</p>
                    <p class="text-2xl font-bold text-purple-600">{{ (ticketAnalytics()!.averageResolutionTimeHours || 0).toFixed(1) }} hours</p>
                  </div>
                </div>
              }
            </div>

            @if (participationData()) {
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Registration Trend</h2>
                <div class="space-y-2">
                  @for (item of participationData()!.registrationsOverTime; track item.date) {
                    <div class="flex items-center">
                      <span class="text-sm text-gray-600 w-32">{{ item.date | date:'shortDate' }}</span>
                      <div class="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                        <div 
                          class="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                          [style.width.%]="(item.count / getMaxCount()) * 100"
                        >
                          <span class="text-xs text-white font-medium">{{ item.count }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            @if (ticketAnalytics()) {
              <div class="bg-white rounded-lg shadow p-6 mt-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Ticket Categories</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="p-4 bg-blue-50 rounded text-center">
                    <p class="text-3xl font-bold text-blue-600">{{ ticketAnalytics()!.categoryBreakdown.technical }}</p>
                    <p class="text-sm text-gray-600 mt-1">Technical</p>
                  </div>
                  <div class="p-4 bg-green-50 rounded text-center">
                    <p class="text-3xl font-bold text-green-600">{{ ticketAnalytics()!.categoryBreakdown.academic }}</p>
                    <p class="text-sm text-gray-600 mt-1">Academic</p>
                  </div>
                  <div class="p-4 bg-yellow-50 rounded text-center">
                    <p class="text-3xl font-bold text-yellow-600">{{ ticketAnalytics()!.categoryBreakdown.administrative }}</p>
                    <p class="text-sm text-gray-600 mt-1">Administrative</p>
                  </div>
                  <div class="p-4 bg-purple-50 rounded text-center">
                    <p class="text-3xl font-bold text-purple-600">{{ ticketAnalytics()!.categoryBreakdown.other }}</p>
                    <p class="text-sm text-gray-600 mt-1">Other</p>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </main>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  participationData = signal<ParticipationData | null>(null);
  ticketAnalytics = signal<TicketAnalytics | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    this.error.set(null);

    this.analyticsService.getParticipation().subscribe({
      next: (data) => {
        this.participationData.set(data);
      },
      error: () => {
        this.error.set('Failed to load participation data');
      }
    });

    this.analyticsService.getTicketAnalytics().subscribe({
      next: (data) => {
        this.ticketAnalytics.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ticket analytics');
        this.loading.set(false);
      }
    });
  }

  getMaxCount(): number {
    if (!this.participationData()) return 1;
    return Math.max(...this.participationData()!.registrationsOverTime.map(item => item.count), 1);
  }
}
