import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { PetsService } from './pets.service';
import { Pet } from '../models/pet.model';
import { Filters } from '../../../shared/model/filters.model';
import { PetList } from '../models/pet-list.model';
import { PetRequest } from '../models/pet-request.model';
import { Attachment } from '../../../shared/model/attachment.model';

describe('PetsService', () => {
  let service: PetsService;
  let httpTesting: HttpTestingController;
  
  const apiUrl = `${environment.apiUrl}/v1/pets`;

  const MOCK_PET: Pet = { 
    id: 1, 
    nome: 'Rex', 
    raca: 'Golden Retriever', 
    idade: 5, 
    foto: null 
  };

  const MOCK_PET_LIST: PetList = { 
    page: 1, 
    size: 10, 
    pageCount: 1, 
    content: [MOCK_PET], 
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
        PetsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PetsService);
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
    it('should send GET request to correct endpoint and return pet', () => {
      const petId = 1;
      const expectedUrl = `${apiUrl}/${petId}`;

      service.getById(petId).subscribe((response) => {
        expect(response).toEqual(MOCK_PET);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PET);
    });
  });

  describe('getAll', () => {
    it('should send GET request with filters as query parameters', () => {
      const filters: Filters = { page: 1, size: 10, nome: 'Rex' };

      service.getAll(filters).subscribe((response) => {
        expect(response).toEqual(MOCK_PET_LIST);
      });

      const req = httpTesting.expectOne(r => r.url.includes('/pets'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.params.get('nome')).toBe('Rex');
      req.flush(MOCK_PET_LIST);
    });

    it('should convert page and size to strings in query parameters', () => {
      const filters: Filters = { page: 0, size: 10 };

      service.getAll(filters).subscribe();

      const req = httpTesting.expectOne(r => r.url.includes('/pets'));
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      req.flush(MOCK_PET_LIST);
    });
  });

  describe('create', () => {
    it('should send POST request without id in body', () => {
      const petRequest: PetRequest = { nome: 'Buddy', raca: 'Labrador', idade: 3 };

      service.create(petRequest).subscribe((response) => {
        expect(response).toEqual(MOCK_PET);
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBeUndefined();
      expect(req.request.body.nome).toBe('Buddy');
      req.flush(MOCK_PET);
    });
  });

  describe('update', () => {
    it('should send PUT request to correct endpoint with pet data', () => {
      const petRequest: PetRequest = { id: 5, nome: 'Max', raca: 'Bulldog', idade: 7 };
      const expectedUrl = `${apiUrl}/${petRequest.id}`;

      service.update(petRequest).subscribe((response) => {
        expect(response).toEqual(MOCK_PET);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBeUndefined();
      expect(req.request.body.nome).toBe('Max');
      req.flush(MOCK_PET);
    });
  });

  describe('delete', () => {
    it('should send DELETE request to correct endpoint', () => {
      const petId = 10;
      const expectedUrl = `${apiUrl}/${petId}`;

      service.delete(petId).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('uploadAttachment', () => {
    it('should send POST request with FormData containing file', () => {
      const petId = 123;
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      const expectedUrl = `${apiUrl}/${petId}/fotos`;

      service.uploadAttachment(petId, mockFile).subscribe((response) => {
        expect(response).toEqual(MOCK_ATTACHMENT);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush(MOCK_ATTACHMENT);
    });
  });

  describe('removeAttachment', () => {
    it('should send DELETE request to photo endpoint', () => {
      const petId = 1;
      const photoId = 99;
      const expectedUrl = `${apiUrl}/${petId}/fotos/${photoId}`;

      service.removeAttachment(petId, photoId).subscribe();

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
