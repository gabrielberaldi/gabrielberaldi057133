import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';
import { TutorsService } from './tutors.service';
import { Tutor } from '../models/tutor.model';
import { Filters } from '../../../shared/model/filters.model';
import { TutorList } from '../models/tutor-list.model';
import { TutorRequest } from '../models/tutor-request.model';
import { Attachment } from '../../../shared/model/attachment.model';

describe('TutorsService', () => {
  let service: TutorsService;
  let httpTesting: HttpTestingController;
  
  const apiUrl = `${environment.apiUrl}/v1/tutores`;

  const MOCK_TUTOR: Tutor = { 
    id: 1, 
    endereco: 'Rua teste', 
    foto: { id: 1, url: 'mockUrl', contentType: 'png', name: 'File Mock' }, 
    nome: 'Tutor Mock', 
    telefone: '6599999999' 
  };

  const MOCK_TUTOR_LIST: TutorList = { 
    page: 1, 
    size: 10, 
    pageCount: 1, 
    content: [MOCK_TUTOR], 
    total: 10 
  };

  const MOCK_ATTACHMENT: Attachment = { 
    id: 1, 
    url: 'path/to/photo.png', 
    contentType: 'image/png', 
    name: 'avatar.png' 
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TutorsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TutorsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('when service is initialized', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getById', () => {
    it('should send GET request to correct endpoint and return tutor', () => {
      const id = 1;
      const expectedUrl = `${apiUrl}/${id}`;
      service.getById(id).subscribe((res) => {
        expect(res).toEqual(MOCK_TUTOR);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_TUTOR);
    });
  });

  describe('getAll', () => {
    it('should apply filters as query parameters and return a paginated list', () => {
      const filters: Filters = { page: 1, size: 10, nome: 'Carlos' };

      service.getAll(filters).subscribe((res) => {
        expect(res).toEqual(MOCK_TUTOR_LIST);
      });

      const req = httpTesting.expectOne(r => r.url.includes('/tutores'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.params.get('nome')).toBe('Carlos');
      req.flush(MOCK_TUTOR_LIST);
    });

    it('should convert page and size to strings in query parameters', () => {
      const filters: Filters = { page: 0, size: 10 };

      service.getAll(filters).subscribe();

      const req = httpTesting.expectOne(r => r.url.includes('/tutores'));
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      req.flush(MOCK_TUTOR_LIST);
    });
  });

  describe('create', () => {
    it('should send POST request with tutor data and no ID', () => {
      const tutorRequest: TutorRequest = { nome: 'Novo Tutor', telefone: '11988887777', endereco: 'Rua A' };
      const mockResponse = { ...MOCK_TUTOR, ...tutorRequest };

      service.create(tutorRequest).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBeUndefined();
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should send PUT request to correct URL with tutor payload', () => {
      const tutorRequest: TutorRequest = { id: 5, nome: 'Nome Alterado', telefone: '11999', endereco: 'Rua B' };
      const mockResponse = { ...MOCK_TUTOR, ...tutorRequest };
      const expectedUrl = `${apiUrl}/5`;

      service.update(tutorRequest).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBeUndefined();
      expect(req.request.body.nome).toBe('Nome Alterado');
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should send DELETE request to specific tutor endpoint', () => {
      const id = 10;
      const expectedUrl = `${apiUrl}/${id}`;

      service.delete(id).subscribe(res => {
        expect(res).toBeNull();
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('uploadAttachment', () => {
    it('should send multipart/form-data POST request', () => {
      const tutorId = 123;
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      const expectedUrl = `${apiUrl}/${tutorId}/fotos`;

      service.uploadAttachment(tutorId, mockFile).subscribe(res => {
        expect(res).toEqual(MOCK_ATTACHMENT);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush(MOCK_ATTACHMENT);
    });
  });

  describe('removeAttachment', () => {
    it('should send DELETE request to photo endpoint', () => {
      const tutorId = 1;
      const photoId = 99;
      const expectedUrl = `${apiUrl}/${tutorId}/fotos/${photoId}`;

      service.removeAttachment(tutorId, photoId).subscribe();

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('linkPet', () => {
    it('should send POST request with null body to link a pet', () => {
      const tutorId = 1;
      const petId = 45;
      const expectedUrl = `${apiUrl}/${tutorId}/pets/${petId}`;

      service.linkPet(tutorId, petId).subscribe();

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(null);
    });
  });

  describe('unlinkPet', () => {
    it('should send DELETE request to relationship endpoint', () => {
      const tutorId = 1;
      const petId = 45;
      const expectedUrl = `${apiUrl}/${tutorId}/pets/${petId}`;

      service.unlinkPet(tutorId, petId).subscribe();

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});