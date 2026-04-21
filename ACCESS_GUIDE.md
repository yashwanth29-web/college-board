# 🎓 Smart College Activity Portal - Access Guide

## ✅ Your Application is Running!

**Frontend**: http://localhost:4200  
**Backend API**: http://127.0.0.1:8000/api/  
**Django Admin Panel**: http://127.0.0.1:8000/admin/

---

## 🔐 Login Credentials

### Admin Account (Full Access)
- **Email**: `admin@college.edu`
- **Password**: `admin123`
- **Access**: Admin portal, Django admin, all features

### Student Accounts (Any of these)
- **Email**: `john.doe@student.edu`
- **Email**: `jane.smith@student.edu`
- **Email**: `mike.johnson@student.edu`
- **Email**: `sarah.williams@student.edu`
- **Email**: `david.brown@student.edu`
- **Password**: `student123` (same for all students)
- **Access**: Student portal features

---

## 📱 How to Access Different Portals

### 1. Student Portal (http://localhost:4200)

**Login as a student** to access:
- ✅ **Dashboard** - Overview of your activities
- ✅ **Announcements** - View 5 announcements (library hours, career fair, etc.)
- ✅ **Upcoming Events** - Browse 6 events (Freshers Party, Tech Talk, Cultural Fest, etc.)
- ✅ **My Registered Events** - See events you've registered for
- ✅ **Reels Feed** - View media content (currently empty, admin can upload)
- ✅ **My Tickets** - View and create support tickets
- ✅ **Profile** - View your student profile

**Sample Data Available**:
- 5 Announcements
- 6 Upcoming Events
- Some students already registered for events
- 5 Support Tickets

### 2. Admin Portal (http://localhost:4200)

**Login with admin credentials** to access:
- ✅ **Admin Dashboard** - Statistics and overview
- ✅ **Student Management** - View, search, edit, deactivate students (5 students)
- ✅ **Announcement Management** - Create, edit, delete announcements
- ✅ **Event Management** - Create events, view registrations, manage capacity
- ✅ **Reel Management** - Upload videos/images (max 50MB)
- ✅ **Ticket Management** - View all tickets, assign, update status
- ✅ **Analytics Dashboard** - View participation metrics, ticket stats

### 3. Django Admin Panel (http://127.0.0.1:8000/admin/)

**Login with admin credentials** for database management:
- Direct database access
- User management
- Content moderation
- Advanced admin features

---

## 🎯 Quick Test Scenarios

### As a Student:

1. **View Announcements**
   - Login → Click "Announcements"
   - See 5 announcements about library, career fair, sports day, etc.

2. **Register for an Event**
   - Login → Click "Upcoming Events"
   - Click on any event (e.g., "Freshers Welcome Party")
   - Click "Register for Event"
   - Check "My Registered Events" to see your registration

3. **Create a Support Ticket**
   - Login → Click "My Tickets"
   - Click "Create New Ticket"
   - Fill in subject, description, category
   - Submit and view your ticket

4. **View Profile**
   - Login → Click on your name in navbar
   - See your student details (ID, department, year, etc.)

### As an Admin:

1. **Manage Students**
   - Login as admin → Click "Student Management"
   - Search students by name, email, or ID
   - View student details
   - Edit profiles or deactivate accounts

2. **Create an Announcement**
   - Admin Dashboard → "Announcement Management"
   - Click "Create Announcement"
   - Enter title and content
   - Publish (students will see it immediately)

3. **Create an Event**
   - Admin Dashboard → "Event Management"
   - Click "Create Event"
   - Fill in details (title, date, time, location, capacity)
   - Save (students can now register)

4. **Manage Support Tickets**
   - Admin Dashboard → "Ticket Management"
   - View all tickets from students
   - Assign tickets to yourself
   - Update status (open → in_progress → resolved)

5. **View Analytics**
   - Admin Dashboard → "Analytics"
   - See total students, events, announcements
   - View event participation rates
   - Check ticket resolution metrics

---

## 📊 Sample Data Summary

Your database now contains:

- **1 Admin User** (admin@college.edu)
- **5 Student Users** (john.doe@student.edu, jane.smith@student.edu, etc.)
- **5 Announcements** (Welcome message, Library hours, Career fair, Sports day, Exam schedule)
- **6 Events** (Freshers Party, Tech Talk, Cultural Fest, Hackathon, Guest Lecture, Blood Donation)
- **6 Event Registrations** (Some students already registered for events)
- **5 Support Tickets** (Library access, Grade issue, Fee receipt, Hostel maintenance, Course registration)

---

## 🔄 Testing the Full Workflow

### Complete Student Journey:
1. Register a new account at http://localhost:4200/register
2. Login with your new credentials
3. Browse announcements and events
4. Register for an event
5. Create a support ticket
6. Check "My Registered Events" and "My Tickets"

### Complete Admin Journey:
1. Login as admin (admin@college.edu / admin123)
2. View admin dashboard statistics
3. Create a new announcement
4. Create a new event
5. View student registrations for events
6. Manage support tickets (assign, update status)
7. View analytics dashboard

---

## 🛠️ API Testing (Optional)

You can also test the backend API directly:

### Get Announcements
```bash
curl http://127.0.0.1:8000/api/announcements/
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@student.edu","password":"student123"}'
```

### API Documentation
Visit: http://127.0.0.1:8000/api/docs/

---

## 🎨 Features to Explore

### Student Features:
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Real-time event capacity checking
- ✅ Pagination for announcements and events
- ✅ Search and filter functionality
- ✅ Profile management
- ✅ Ticket status tracking

### Admin Features:
- ✅ Student search (by name, email, student ID)
- ✅ Content management (CRUD operations)
- ✅ Event registration tracking
- ✅ Ticket assignment and resolution
- ✅ Analytics and reporting
- ✅ File upload for reels (videos/images)

### Security Features:
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting (100 req/hour for anonymous, 1000/hour for authenticated)
- ✅ Password hashing (PBKDF2)
- ✅ CORS protection
- ✅ Secure database connection (SSL to Neon)

---

## 💡 Tips

1. **Refresh the page** if you don't see data immediately after login
2. **Check the browser console** (F12) for any errors
3. **Admin users** see different navigation options than students
4. **Event capacity** is enforced - you can't register if an event is full
5. **Tickets** can only be viewed by the student who created them (unless you're admin)

---

## 🚀 Next Steps

1. **Explore all features** using the test accounts
2. **Create your own content** as admin
3. **Register new students** and test the full workflow
4. **Upload media files** in the Reel Management section
5. **Check analytics** to see participation metrics

---

## 📞 Need Help?

- Check the backend logs in the terminal running `python manage.py runserver`
- Check the frontend logs in the terminal running `npm start`
- Open browser DevTools (F12) to see console errors
- Review the README.md for detailed API documentation

---

**Enjoy exploring your Smart College Activity Portal! 🎓✨**
