"""
Django management command to seed the database with sample data
Run with: python manage.py seed_database
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from authentication.models import Student
from announcements.models import Announcement
from events.models import Event, EventRegistration
from tickets.models import Ticket
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Starting database seeding...")

        # Create admin user
        self.stdout.write("\n👤 Creating admin user...")
        admin_user, created = User.objects.get_or_create(
            email='admin@college.edu',
            defaults={
                'name': 'Admin User',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("✅ Admin user created: admin@college.edu / admin123"))
        else:
            self.stdout.write(self.style.WARNING("ℹ️  Admin user already exists: admin@college.edu"))

        # Create student users
        self.stdout.write("\n👥 Creating student users...")
        students_data = [
            {
                'email': 'john.doe@student.edu',
                'first_name': 'John',
                'last_name': 'Doe',
                'student_id': 'STU001',
                'phone': '1234567890',
                'department': 'Computer Science',
                'year': 2
            },
            {
                'email': 'jane.smith@student.edu',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'student_id': 'STU002',
                'phone': '1234567891',
                'department': 'Electrical Engineering',
                'year': 3
            },
            {
                'email': 'mike.johnson@student.edu',
                'first_name': 'Mike',
                'last_name': 'Johnson',
                'student_id': 'STU003',
                'phone': '1234567892',
                'department': 'Mechanical Engineering',
                'year': 1
            },
            {
                'email': 'sarah.williams@student.edu',
                'first_name': 'Sarah',
                'last_name': 'Williams',
                'student_id': 'STU004',
                'phone': '1234567893',
                'department': 'Business Administration',
                'year': 4
            },
            {
                'email': 'david.brown@student.edu',
                'first_name': 'David',
                'last_name': 'Brown',
                'student_id': 'STU005',
                'phone': '1234567894',
                'department': 'Computer Science',
                'year': 2
            }
        ]

        student_users = []
        for student_data in students_data:
            user, created = User.objects.get_or_create(
                email=student_data['email'],
                defaults={
                    'name': f"{student_data['first_name']} {student_data['last_name']}",
                    'is_student': True,
                    'is_active': True,
                }
            )
            if created:
                user.set_password('student123')
                user.save()
                
                # Create student profile
                Student.objects.get_or_create(
                    user=user,
                    defaults={
                        'student_id': student_data['student_id'],
                        'phone': student_data['phone'],
                        'department': student_data['department'],
                        'year': student_data['year'],
                    }
                )
                self.stdout.write(self.style.SUCCESS(f"✅ Student created: {student_data['email']} / student123"))
            else:
                self.stdout.write(self.style.WARNING(f"ℹ️  Student already exists: {student_data['email']}"))
            
            student_users.append(user)

        # Create announcements
        self.stdout.write("\n📢 Creating announcements...")
        announcements_data = [
            {
                'title': 'Welcome to the New Academic Year!',
                'content': 'We are excited to welcome all students to the new academic year. Please check your schedules and attend the orientation session.',
                'published_date': timezone.now() - timedelta(days=5)
            },
            {
                'title': 'Library Hours Extended',
                'content': 'The library will now be open until 10 PM on weekdays to accommodate student study needs during exam season.',
                'published_date': timezone.now() - timedelta(days=3)
            },
            {
                'title': 'Career Fair Next Week',
                'content': 'Join us for the annual career fair where top companies will be recruiting. Bring your resumes and dress professionally!',
                'published_date': timezone.now() - timedelta(days=2)
            },
            {
                'title': 'Sports Day Registration Open',
                'content': 'Register now for the upcoming sports day events. Multiple categories available including cricket, football, basketball, and athletics.',
                'published_date': timezone.now() - timedelta(days=1)
            },
            {
                'title': 'Mid-Term Exam Schedule Released',
                'content': 'The mid-term examination schedule has been posted on the student portal. Please review your exam dates and prepare accordingly.',
                'published_date': timezone.now()
            }
        ]

        for ann_data in announcements_data:
            announcement, created = Announcement.objects.get_or_create(
                title=ann_data['title'],
                defaults={
                    'content': ann_data['content'],
                    'published_date': ann_data['published_date'],
                    'created_by': admin_user,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Announcement created: {ann_data['title']}"))
            else:
                self.stdout.write(self.style.WARNING(f"ℹ️  Announcement already exists: {ann_data['title']}"))

        # Create events
        self.stdout.write("\n🎉 Creating events...")
        events_data = [
            {
                'title': 'Freshers Welcome Party',
                'description': 'Join us for an exciting welcome party for all new students. Music, food, and fun activities!',
                'date': (timezone.now() + timedelta(days=3)).date(),
                'time': '18:00:00',
                'location': 'Main Auditorium',
                'capacity': 200,
                'current_registrations': 0
            },
            {
                'title': 'Tech Talk: AI and Machine Learning',
                'description': 'Industry experts will discuss the latest trends in AI and ML. Great networking opportunity!',
                'date': (timezone.now() + timedelta(days=7)).date(),
                'time': '14:00:00',
                'location': 'Seminar Hall A',
                'capacity': 100,
                'current_registrations': 0
            },
            {
                'title': 'Annual Cultural Fest',
                'description': 'Three days of music, dance, drama, and art. Showcase your talents and enjoy performances!',
                'date': (timezone.now() + timedelta(days=14)).date(),
                'time': '10:00:00',
                'location': 'College Grounds',
                'capacity': 500,
                'current_registrations': 0
            },
            {
                'title': 'Coding Hackathon 2026',
                'description': '24-hour coding challenge with exciting prizes. Form teams of 3-4 members and compete!',
                'date': (timezone.now() + timedelta(days=10)).date(),
                'time': '09:00:00',
                'location': 'Computer Lab',
                'capacity': 80,
                'current_registrations': 0
            },
            {
                'title': 'Guest Lecture: Entrepreneurship',
                'description': 'Successful entrepreneur shares insights on starting and growing a business.',
                'date': (timezone.now() + timedelta(days=5)).date(),
                'time': '15:30:00',
                'location': 'Conference Room',
                'capacity': 60,
                'current_registrations': 0
            },
            {
                'title': 'Blood Donation Camp',
                'description': 'Donate blood and save lives. All healthy students are encouraged to participate.',
                'date': (timezone.now() + timedelta(days=12)).date(),
                'time': '08:00:00',
                'location': 'Medical Center',
                'capacity': 150,
                'current_registrations': 0
            }
        ]

        created_events = []
        for event_data in events_data:
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults={
                    'description': event_data['description'],
                    'date': event_data['date'],
                    'time': event_data['time'],
                    'location': event_data['location'],
                    'capacity': event_data['capacity'],
                    'current_registrations': event_data['current_registrations'],
                    'created_by': admin_user,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Event created: {event_data['title']}"))
                created_events.append(event)
            else:
                self.stdout.write(self.style.WARNING(f"ℹ️  Event already exists: {event_data['title']}"))
                created_events.append(event)

        # Register some students for events
        self.stdout.write("\n📝 Creating event registrations...")
        if len(student_users) >= 3 and len(created_events) >= 3:
            registrations = [
                (student_users[0], created_events[0]),  # John -> Freshers Party
                (student_users[0], created_events[1]),  # John -> Tech Talk
                (student_users[1], created_events[0]),  # Jane -> Freshers Party
                (student_users[1], created_events[2]),  # Jane -> Cultural Fest
                (student_users[2], created_events[1]),  # Mike -> Tech Talk
                (student_users[2], created_events[3]),  # Mike -> Hackathon
            ]
            
            for student, event in registrations:
                student_profile = Student.objects.filter(user=student).first()
                if student_profile:
                    reg, created = EventRegistration.objects.get_or_create(
                        student=student_profile,
                        event=event
                    )
                    if created:
                        event.current_registrations += 1
                        event.save()
                        self.stdout.write(self.style.SUCCESS(f"✅ Registered {student.name} for {event.title}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"ℹ️  Registration already exists: {student.name} -> {event.title}"))

        # Create tickets
        self.stdout.write("\n🎫 Creating support tickets...")
        tickets_data = [
            {
                'subject': 'Cannot access library portal',
                'description': 'I am unable to login to the library portal. Getting authentication error.',
                'category': 'technical',
                'status': 'open',
                'student_index': 0
            },
            {
                'subject': 'Grade discrepancy in Math course',
                'description': 'My grade for the mid-term exam seems incorrect. Can someone review it?',
                'category': 'academic',
                'status': 'in_progress',
                'student_index': 1
            },
            {
                'subject': 'Fee payment receipt not received',
                'description': 'I paid my semester fees last week but have not received the receipt yet.',
                'category': 'administrative',
                'status': 'open',
                'student_index': 2
            },
            {
                'subject': 'Hostel room maintenance required',
                'description': 'The AC in my hostel room is not working. Please send maintenance staff.',
                'category': 'other',
                'status': 'resolved',
                'student_index': 3
            },
            {
                'subject': 'Course registration issue',
                'description': 'Unable to register for elective courses. The system shows all slots are full.',
                'category': 'academic',
                'status': 'open',
                'student_index': 4
            }
        ]

        for ticket_data in tickets_data:
            if ticket_data['student_index'] < len(student_users):
                student = student_users[ticket_data['student_index']]
                student_profile = Student.objects.filter(user=student).first()
                
                if student_profile:
                    ticket, created = Ticket.objects.get_or_create(
                        subject=ticket_data['subject'],
                        student=student_profile,
                        defaults={
                            'description': ticket_data['description'],
                            'category': ticket_data['category'],
                            'status': ticket_data['status'],
                            'assigned_to': admin_user if ticket_data['status'] in ['in_progress', 'resolved'] else None,
                            'resolved_at': timezone.now() if ticket_data['status'] == 'resolved' else None
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f"✅ Ticket created: {ticket_data['subject']}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"ℹ️  Ticket already exists: {ticket_data['subject']}"))

        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("✅ Database seeding completed successfully!"))
        self.stdout.write("="*60)
        self.stdout.write("\n📊 Summary:")
        self.stdout.write(f"   - Admin users: 1")
        self.stdout.write(f"   - Student users: {len(student_users)}")
        self.stdout.write(f"   - Announcements: {len(announcements_data)}")
        self.stdout.write(f"   - Events: {len(events_data)}")
        self.stdout.write(f"   - Tickets: {len(tickets_data)}")
        self.stdout.write("\n🔐 Login Credentials:")
        self.stdout.write("   Admin Portal:")
        self.stdout.write("   - Email: admin@college.edu")
        self.stdout.write("   - Password: admin123")
        self.stdout.write("\n   Student Portal (any of these):")
        self.stdout.write("   - Email: john.doe@student.edu")
        self.stdout.write("   - Email: jane.smith@student.edu")
        self.stdout.write("   - Email: mike.johnson@student.edu")
        self.stdout.write("   - Password: student123 (for all students)")
        self.stdout.write("\n🌐 Access URLs:")
        self.stdout.write("   - Frontend: http://localhost:4200")
        self.stdout.write("   - Backend API: http://127.0.0.1:8000/api/")
        self.stdout.write("   - Django Admin: http://127.0.0.1:8000/admin/")
        self.stdout.write("="*60)
