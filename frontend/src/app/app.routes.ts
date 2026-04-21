import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

// Auth Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Student Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AnnouncementListComponent } from './features/announcements/announcement-list/announcement-list.component';
import { AnnouncementDetailComponent } from './features/announcements/announcement-detail/announcement-detail.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { MyEventsComponent } from './features/events/my-events/my-events.component';
import { ReelFeedComponent } from './features/reels/reel-feed/reel-feed.component';
import { TicketListComponent } from './features/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './features/tickets/ticket-create/ticket-create.component';

// Admin Components
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StudentManagementComponent } from './features/admin/student-management/student-management.component';
import { ContentManagementComponent } from './features/admin/content-management/content-management.component';
import { TicketManagementComponent } from './features/admin/ticket-management/ticket-management.component';
import { AnalyticsComponent } from './features/admin/analytics/analytics.component';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected student routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'announcements', component: AnnouncementListComponent, canActivate: [authGuard] },
  { path: 'announcements/:id', component: AnnouncementDetailComponent, canActivate: [authGuard] },
  { path: 'events', component: EventListComponent, canActivate: [authGuard] },
  { path: 'events/:id', component: EventDetailComponent, canActivate: [authGuard] },
  { path: 'my-events', component: MyEventsComponent, canActivate: [authGuard] },
  { path: 'reels', component: ReelFeedComponent, canActivate: [authGuard] },
  { path: 'tickets', component: TicketListComponent, canActivate: [authGuard] },
  { path: 'tickets/create', component: TicketCreateComponent, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetailComponent, canActivate: [authGuard] },

  // Protected admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/students', component: StudentManagementComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/content', component: ContentManagementComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/tickets', component: TicketManagementComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/analytics', component: AnalyticsComponent, canActivate: [authGuard, adminGuard] },

  // Fallback
  { path: '**', redirectTo: '/login' }
];
