import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { Ticket } from '../../../shared/models/ticket.model';
import { ApiResponse } from '../../../shared/models/api.model';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/tickets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create ticket', (done) => {
    const newTicket = {
      subject: 'Test Issue',
      description: 'Description',
      category: 'technical' as const
    };
    const mockResponse: ApiResponse<Ticket> = {
      status: 'success',
      data: {
        id: 1,
        ...newTicket,
        status: 'open',
        student: { id: 1, name: 'John', studentId: 'STU001' },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    };

    service.createTicket(newTicket).subscribe(data => {
      expect(data.subject).toBe('Test Issue');
      expect(data.status).toBe('open');
      done();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update ticket status', (done) => {
    const mockResponse: ApiResponse<Ticket> = {
      status: 'success',
      data: {
        id: 1,
        subject: 'Test',
        description: 'Desc',
        category: 'technical',
        status: 'resolved',
        student: { id: 1, name: 'John', studentId: 'STU001' },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    };

    service.updateTicketStatus(1, 'resolved').subscribe(data => {
      expect(data.status).toBe('resolved');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });
});
