import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReelService } from '../../../core/services/reel.service';
import { Reel } from '../../../shared/models/reel.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reel-feed',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reels Feed</h1>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else {
              <div class="space-y-6">
                @for (reel of reels(); track reel.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/50 overflow-hidden">
                    @if (reel.fileType === 'video') {
                      <video 
                        controls 
                        class="w-full max-h-[600px] bg-black"
                        [poster]="reel.thumbnailUrl"
                      >
                        <source [src]="reel.fileUrl" type="video/mp4">
                        Your browser does not support the video tag.
                      </video>
                    } @else {
                      <img 
                        [src]="reel.fileUrl" 
                        [alt]="reel.title"
                        class="w-full max-h-[600px] object-contain bg-black"
                      />
                    }
                    
                    <div class="p-4">
                      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {{ reel.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-300 mb-3">
                        {{ reel.description }}
                      </p>
                      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{{ reel.createdAt | date:'medium' }}</span>
                        <span>{{ reel.views }} views</span>
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
export class ReelFeedComponent implements OnInit {
  reels = signal<Reel[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  hasMore = signal(true);

  constructor(private reelService: ReelService) {}

  ngOnInit() {
    this.loadReels();
  }

  loadReels() {
    this.loading.set(true);
    this.error.set(null);

    this.reelService.getReels(this.currentPage()).subscribe({
      next: (response) => {
        this.reels.set(response.results);
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load reels');
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.reelService.getReels(nextPage).subscribe({
      next: (response) => {
        this.reels.update(current => [...current, ...response.results]);
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
