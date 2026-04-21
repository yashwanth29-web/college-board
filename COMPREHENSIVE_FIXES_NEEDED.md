# Comprehensive Fixes Needed

## Issues to Fix:

### 1. Ticket Detail View - Shows Nothing
**Problem**: Ticket detail page not displaying data
**Likely Cause**: Response format mismatch (backend returns direct object, frontend expects wrapped)
**Fix**: Update TicketService.getTicketById() to handle direct response

### 2. Student ID Not Displaying
**Problem**: Student management page not showing student IDs
**Fix**: Check Student model and serializer, ensure student_id field is included

### 3. Change Ticket Status (Admin Only)
**Problem**: No UI to change ticket status
**Fix**: Add status dropdown in admin ticket management page

### 4. Delete Functionality Missing
**Problem**: Admin cannot delete announcements, events, or reels
**Fixes Needed**:
- Add delete buttons to content management page
- Add delete methods to services
- Add confirmation dialogs
- Add DELETE endpoint for reels in backend

---

## Implementation Plan:

### Fix 1: Ticket Detail Response Format
```typescript
// Update TicketService.getTicketById()
getTicketById(id: number): Observable<Ticket> {
  return this.get<any>(`/tickets/${id}`).pipe(
    map(response => {
      // Check if direct response
      if (response.id) {
        return response as Ticket;
      }
      return response.data as Ticket;
    })
  );
}
```

### Fix 2: Student ID Display
- Check backend serializer includes `student_id`
- Ensure frontend Student model has `studentId` field
- Update student management component template

### Fix 3: Ticket Status Change
- Add dropdown in ticket management component
- Call updateTicketStatus() on change
- Show success/error messages

### Fix 4: Delete Functionality

#### Backend - Add Reel Delete Endpoint
```python
# In backend/reels/views.py
def destroy(self, request, pk=None):
    """Soft delete by setting is_active to False"""
    instance = self.get_object()
    instance.is_active = False
    instance.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
```

#### Frontend - Add Delete Methods
```typescript
// EventService
deleteEvent(id: number): Observable<void> {
  return this.delete<void>(`/events/${id}/`);
}

// ReelService  
deleteReel(id: number): Observable<void> {
  return this.delete<void>(`/reels/${id}/`);
}
```

#### Frontend - Update Content Management
- Show lists of existing items
- Add delete button for each item
- Add confirmation dialog
- Refresh list after delete

---

## Priority Order:
1. Fix ticket detail view (quick fix)
2. Fix student ID display (quick fix)
3. Add ticket status change (medium)
4. Add delete functionality (larger feature)
