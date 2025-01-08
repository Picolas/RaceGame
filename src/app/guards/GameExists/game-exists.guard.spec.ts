import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gameExistsGuard } from './game-exists.guard';

describe('gameExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gameExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
