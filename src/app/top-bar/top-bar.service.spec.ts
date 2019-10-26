import { TestBed } from '@angular/core/testing';

import { TopBarService } from './top-bar.service';

describe('TopBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopBarService = TestBed.get(TopBarService);
    expect(service).toBeTruthy();
  });
});
