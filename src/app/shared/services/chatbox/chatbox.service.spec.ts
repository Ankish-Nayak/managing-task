import { TestBed } from '@angular/core/testing';

import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
  let service: ChatboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
