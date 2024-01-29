import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userBasedAuthGuard } from './user-based-auth.guard';

describe('userBasedAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userBasedAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
