import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { Announcement } from '../../../shared/models/announcement.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-announcement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-4xl mx-auto">
            <a routerLink="/announcements" class="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Announcements
            </a>

            @if (loading()) {
              <app-loading-spinner />
            } @else if (error()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ error() }}
              </div>
            } @else if (announcement()) {
              <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                  {{ announcement()!.title }}
                </h1>
                
                <div class="flex items-center text-sm text-gray-500 mb-6">
                  <span>Posted by {{ announcement()!.createdBy.name }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ announcement()!.publishedDate | date:'medium' }}</span>
                </div>

                <div class="prose max-w-none">
                  <p class="text-gray-700 whitespace-pre-wrap">{{ announcement()!.content }}</p>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class AnnouncementDetailComponent implements OnInit {
  announcement = signal<Announcement | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadAnnouncement(id);
    }
  }

  loadAnnouncement(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.announcementService.getAnnouncementById(id).subscribe({
      next: (announcement) => {
        this.announcement.set(announcement);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load announcement');
        this.loading.set(false);
      }
    });
  }
}
