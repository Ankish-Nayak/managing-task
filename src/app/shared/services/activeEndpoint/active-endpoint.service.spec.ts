import { TestBed } from '@angular/core/testing';

import { ActiveEndpointService } from './active-endpoint.service';

describe('ActiveEndpointService', () => {
  let service: ActiveEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
