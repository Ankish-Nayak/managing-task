import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { navLinkHighlighterResolver } from './nav-link-highlighter.resolver';

describe('navLinkHighlighterResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => navLinkHighlighterResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
