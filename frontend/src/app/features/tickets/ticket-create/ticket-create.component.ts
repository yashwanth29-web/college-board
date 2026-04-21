import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <div class="flex pt-16">
        <app-sidebar />
        
        <main class="flex-1 lg:ml-64 p-6 min-h-screen">
          <div class="max-w-2xl mx-auto">
            <a routerLink="/tickets" class="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Tickets
            </a>

            <div class="bg-white rounded-lg shadow-lg p-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-6">Create Support Ticket</h1>

              @if (error()) {
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {{ error() }}
                </div>
              }

              <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                  <input 
                    type="text" 
                    formControlName="subject"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                  @if (ticketForm.get('subject')?.invalid && ticketForm.get('subject')?.touched) {
                    <p class="text-red-500 text-xs mt-1">Subject is required</p>
                  }
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
                  <select 
                    formControlName="category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical</option>
                    <option value="academic">Academic</option>
                    <option value="administrative">Administrative</option>
                    <option value="other">Other</option>
                  </select>
                  @if (ticketForm.get('category')?.invalid && ticketForm.get('category')?.touched) {
                    <p class="text-red-500 text-xs mt-1">Category is required</p>
                  }
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea 
                    formControlName="description"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed information about your issue"
                  ></textarea>
                  @if (ticketForm.get('description')?.invalid && ticketForm.get('description')?.touched) {
                    <p class="text-red-500 text-xs mt-1">Description is required</p>
                  }
                </div>

                <div class="flex gap-4">
                  <button 
                    type="submit" 
                    [disabled]="ticketForm.invalid || loading()"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    @if (loading()) {
                      <span>Creating...</span>
                    } @else {
                      <span>Create Ticket</span>
                    }
                  </button>
                  <a 
                    routerLink="/tickets"
                    class="flex-1 text-center bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class TicketCreateComponent {
  ticketForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      this.ticketService.createTicket(this.ticketForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Failed to create ticket');
        }
      });
    }
  }
}
