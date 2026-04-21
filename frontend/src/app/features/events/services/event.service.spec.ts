import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { Event, EventRegistration } from '../../../shared/models/event.model';
import { ApiResponse } from '../../../shared/models/api.model';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/events';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register for event', (done) => {
    const mockResponse: ApiResponse<EventRegistration> = {
      status: 'success',
      data: {
        id: 1,
        studentId: 1,
        eventId: 1,
        registeredAt: '2024-01-15T10:00:00Z'
      }
    };

    service.registerForEvent(1).subscribe(data => {
      expect(data.eventId).toBe(1);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/1/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get my events', (done) => {
    const mockResponse: ApiResponse<Event[]> = {
      status: 'success',
      data: [{
        id: 1,
        title: 'Test Event',
        description: 'Description',
        date: '2024-02-20',
        time: '09:00:00',
        location: 'Main Hall',
        capacity: 100,
        currentRegistrations: 50,
        isFull: false,
        isActive: true
      }]
    };

    service.getMyEvents().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].title).toBe('Test Event');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/my-events`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
