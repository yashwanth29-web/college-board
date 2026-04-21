import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', (done) => {
    const mockData = { data: 'test' };
    
    service['get']('/test').subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/api/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should perform POST request', (done) => {
    const mockData = { data: 'test' };
    const postData = { name: 'test' };
    
    service['post']('/test', postData).subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(mockData);
  });

  it('should build HTTP params correctly', () => {
    const params = service['buildParams']({ page: 1, search: 'test', empty: null });
    expect(params.get('page')).toBe('1');
    expect(params.get('search')).toBe('test');
    expect(params.get('empty')).toBeNull();
  });
});
