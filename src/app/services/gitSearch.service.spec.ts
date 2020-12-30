/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GitSearchService } from './gitSearch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: GitSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitSearchService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should ...', inject([GitSearchService], (service: GitSearchService) => {
    expect(service).toBeTruthy();
  }));
});
