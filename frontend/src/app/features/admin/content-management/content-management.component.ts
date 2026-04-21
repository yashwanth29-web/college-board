import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { EventService } from '../../../core/services/event.service';
import { ReelService } from '../../../core/services/reel.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Announcement } from '../../../shared/models/announcement.model';
import { Event } from '../../../shared/models/event.model';
import { Reel } from '../../../shared/models/reel.model';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-navbar />
      
      <main class="p-6">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Content Management</h1>

          <div class="flex gap-4 mb-6">
            <button 
              (click)="activeTab.set('announcement')"
              [class]="activeTab() === 'announcement' ? 'px-4 py-2 bg-blue-600 text-white rounded-md' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100'"
            >
              Create Announcement
            </button>
            <button 
              (click)="activeTab.set('event')"
              [class]="activeTab() === 'event' ? 'px-4 py-2 bg-blue-600 text-white rounded-md' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100'"
            >
              Create Event
            </button>
            <button 
              (click)="activeTab.set('reel')"
              [class]="activeTab() === 'reel' ? 'px-4 py-2 bg-blue-600 text-white rounded-md' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100'"
            >
              Upload Reel
            </button>
            <button 
              (click)="switchToManageTab()"
              [class]="activeTab() === 'manage' ? 'px-4 py-2 bg-blue-600 text-white rounded-md' : 'px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100'"
            >
              Manage Content
            </button>
          </div>

          @if (successMessage()) {
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {{ successMessage() }}
            </div>
          }

          @if (error()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {{ error() }}
            </div>
          }

          @if (activeTab() === 'announcement') {
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Create Announcement</h2>
              <form [formGroup]="announcementForm" (ngSubmit)="createAnnouncement()">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input 
                    type="text" 
                    formControlName="title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Content</label>
                  <textarea 
                    formControlName="content"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  [disabled]="announcementForm.invalid || loading()"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {{ loading() ? 'Creating...' : 'Create Announcement' }}
                </button>
              </form>
            </div>
          }

          @if (activeTab() === 'event') {
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Create Event</h2>
              <form [formGroup]="eventForm" (ngSubmit)="createEvent()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input 
                      type="text" 
                      formControlName="title"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <input 
                      type="text" 
                      formControlName="location"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea 
                    formControlName="description"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Date</label>
                    <input 
                      type="date" 
                      formControlName="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Time</label>
                    <input 
                      type="time" 
                      formControlName="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Capacity</label>
                    <input 
                      type="number" 
                      formControlName="capacity"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  [disabled]="eventForm.invalid || loading()"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {{ loading() ? 'Creating...' : 'Create Event' }}
                </button>
              </form>
            </div>
          }

          @if (activeTab() === 'reel') {
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Upload Reel</h2>
              <form [formGroup]="reelForm" (ngSubmit)="uploadReel()">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input 
                    type="text" 
                    formControlName="title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea 
                    formControlName="description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">File Type</label>
                  <select 
                    formControlName="file_type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Media File (Max 50MB)</label>
                  <input 
                    type="file" 
                    (change)="onFileSelected($event)"
                    accept="video/*,image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit" 
                  [disabled]="reelForm.invalid || !selectedFile() || loading()"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {{ loading() ? 'Uploading...' : 'Upload Reel' }}
                </button>
              </form>
            </div>
          }

          @if (activeTab() === 'manage') {
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-6">Manage Content</h2>

              <!-- Announcements Section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Announcements</h3>
                @if (loadingContent()) {
                  <p class="text-gray-600">Loading...</p>
                } @else if (announcements().length === 0) {
                  <p class="text-gray-600">No announcements found.</p>
                } @else {
                  <div class="space-y-3">
                    @for (announcement of announcements(); track announcement.id) {
                      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-800">{{ announcement.title }}</h4>
                          <p class="text-sm text-gray-600 mt-1">{{ announcement.content.substring(0, 100) }}...</p>
                          <p class="text-xs text-gray-500 mt-1">Published: {{ announcement.publishedDate | date }}</p>
                        </div>
                        <button 
                          (click)="confirmDelete('announcement', announcement.id, announcement.title)"
                          class="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Events Section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Events</h3>
                @if (loadingContent()) {
                  <p class="text-gray-600">Loading...</p>
                } @else if (events().length === 0) {
                  <p class="text-gray-600">No events found.</p>
                } @else {
                  <div class="space-y-3">
                    @for (event of events(); track event.id) {
                      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-800">{{ event.title }}</h4>
                          <p class="text-sm text-gray-600 mt-1">{{ event.description.substring(0, 100) }}...</p>
                          <p class="text-xs text-gray-500 mt-1">Date: {{ event.date | date }} at {{ event.time }}</p>
                          <p class="text-xs text-gray-500">Location: {{ event.location }}</p>
                        </div>
                        <button 
                          (click)="confirmDelete('event', event.id, event.title)"
                          class="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Reels Section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Reels</h3>
                @if (loadingContent()) {
                  <p class="text-gray-600">Loading...</p>
                } @else if (reels().length === 0) {
                  <p class="text-gray-600">No reels found.</p>
                } @else {
                  <div class="space-y-3">
                    @for (reel of reels(); track reel.id) {
                      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-800">{{ reel.title }}</h4>
                          <p class="text-sm text-gray-600 mt-1">{{ reel.description }}</p>
                          <p class="text-xs text-gray-500 mt-1">Type: {{ reel.fileType }} | Views: {{ reel.views }}</p>
                          <p class="text-xs text-gray-500">Created: {{ reel.createdAt | date }}</p>
                        </div>
                        <button 
                          (click)="confirmDelete('reel', reel.id, reel.title)"
                          class="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- Delete Confirmation Modal -->
          @if (showDeleteConfirm()) {
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
                <p class="text-gray-600 mb-6">
                  Are you sure you want to delete "{{ deleteTarget().name }}"? This action cannot be undone.
                </p>
                <div class="flex gap-4">
                  <button 
                    (click)="cancelDelete()"
                    class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    (click)="executeDelete()"
                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ContentManagementComponent implements OnInit {
  activeTab = signal<'announcement' | 'event' | 'reel' | 'manage'>('announcement');
  loading = signal(false);
  loadingContent = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  
  // Content lists
  announcements = signal<Announcement[]>([]);
  events = signal<Event[]>([]);
  reels = signal<Reel[]>([]);
  
  // Delete confirmation
  showDeleteConfirm = signal(false);
  deleteTarget = signal<{ type: 'announcement' | 'event' | 'reel', id: number, name: string }>({ 
    type: 'announcement', 
    id: 0, 
    name: '' 
  });

  announcementForm: FormGroup;
  eventForm: FormGroup;
  reelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private eventService: EventService,
    private reelService: ReelService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });

    this.reelForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      file_type: ['video', Validators.required]
    });
  }

  ngOnInit() {
    // Load content when component initializes
    this.loadAllContent();
  }

  switchToManageTab() {
    this.activeTab.set('manage');
    this.loadAllContent();
  }

  loadAllContent() {
    this.loadAnnouncements();
    this.loadEvents();
    this.loadReels();
  }

  loadAnnouncements() {
    this.loadingContent.set(true);
    this.announcementService.getAnnouncements(1).subscribe({
      next: (response) => {
        this.announcements.set(response.results || []);
        this.loadingContent.set(false);
      },
      error: (err) => {
        console.error('Failed to load announcements:', err);
        this.loadingContent.set(false);
      }
    });
  }

  loadEvents() {
    this.loadingContent.set(true);
    this.eventService.getEvents(1).subscribe({
      next: (response) => {
        this.events.set(response.results || []);
        this.loadingContent.set(false);
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.loadingContent.set(false);
      }
    });
  }

  loadReels() {
    this.loadingContent.set(true);
    this.reelService.getReels(1).subscribe({
      next: (response) => {
        this.reels.set(response.results || []);
        this.loadingContent.set(false);
      },
      error: (err) => {
        console.error('Failed to load reels:', err);
        this.loadingContent.set(false);
      }
    });
  }

  confirmDelete(type: 'announcement' | 'event' | 'reel', id: number, name: string) {
    this.deleteTarget.set({ type, id, name });
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  executeDelete() {
    const target = this.deleteTarget();
    this.showDeleteConfirm.set(false);
    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    let deleteObservable;
    
    switch (target.type) {
      case 'announcement':
        deleteObservable = this.announcementService.deleteAnnouncement(target.id);
        break;
      case 'event':
        deleteObservable = this.eventService.deleteEvent(target.id);
        break;
      case 'reel':
        deleteObservable = this.reelService.deleteReel(target.id);
        break;
    }

    deleteObservable.subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(`${target.type.charAt(0).toUpperCase() + target.type.slice(1)} deleted successfully!`);
        
        // Reload the specific content list
        switch (target.type) {
          case 'announcement':
            this.loadAnnouncements();
            break;
          case 'event':
            this.loadEvents();
            break;
          case 'reel':
            this.loadReels();
            break;
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || `Failed to delete ${target.type}`);
      }
    });
  }

  createAnnouncement() {
    if (this.announcementForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      this.successMessage.set(null);

      this.announcementService.createAnnouncement(this.announcementForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Announcement created successfully!');
          this.announcementForm.reset();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Failed to create announcement');
        }
      });
    }
  }

  createEvent() {
    if (this.eventForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      this.successMessage.set(null);

      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Event created successfully!');
          this.eventForm.reset();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Failed to create event');
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        this.error.set('File size must be less than 50MB');
        this.selectedFile.set(null);
      } else {
        this.selectedFile.set(file);
        this.error.set(null);
      }
    }
  }

  uploadReel() {
    if (this.reelForm.valid && this.selectedFile()) {
      this.loading.set(true);
      this.error.set(null);
      this.successMessage.set(null);

      const formData = new FormData();
      formData.append('title', this.reelForm.get('title')?.value);
      formData.append('description', this.reelForm.get('description')?.value);
      formData.append('file_type', this.reelForm.get('file_type')?.value);
      formData.append('file', this.selectedFile()!);

      this.reelService.uploadReel(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Reel uploaded successfully!');
          this.reelForm.reset();
          this.selectedFile.set(null);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Failed to upload reel');
        }
      });
    }
  }
}
