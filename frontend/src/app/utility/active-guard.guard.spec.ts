import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activeGuardGuard } from './active-guard.guard';

describe('activeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activeGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
