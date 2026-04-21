import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { Announcement } from '../../../shared/models/announcement.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Announcements</h1>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else {
              <div class="grid grid-cols-1 gap-6">
                @for (announcement of announcements(); track announcement.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
                    <div class="p-6">
                      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {{ announcement.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                        {{ announcement.content }}
                      </p>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ announcement.publishedDate | date:'medium' }}
                        </span>
                      </div>
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
export class AnnouncementListComponent implements OnInit {
  announcements = signal<Announcement[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  hasMore = signal(true);

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.loading.set(true);
    this.error.set(null);

    this.announcementService.getAnnouncements(this.currentPage()).subscribe({
      next: (response) => {
        this.announcements.set(response.results);
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load announcements');
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.announcementService.getAnnouncements(nextPage).subscribe({
      next: (response) => {
        this.announcements.update(current => [...current, ...response.results]);
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
