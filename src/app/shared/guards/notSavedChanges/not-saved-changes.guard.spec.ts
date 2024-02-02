import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { notSavedChangesGuard } from './not-saved-changes.guard';

describe('notSavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notSavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
