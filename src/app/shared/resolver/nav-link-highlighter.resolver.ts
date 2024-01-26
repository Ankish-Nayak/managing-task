import { inject } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { ActiveEndpointService } from '../services/activeEndpoint/active-endpoint.service';

export const navLinkHighlighterResolver: ResolveFn<void> = (route, state) => {
  const activatedRoute = inject(ActivatedRoute);
  const activeEndpoint = inject(ActiveEndpointService);
  const endPoint = getActiveEndpoint(activatedRoute);
  activeEndpoint.updateActiveEndpoint(endPoint);
};

const getActiveEndpoint = (route: ActivatedRoute) => {
  // Get the current activated route
  let currentRoute = route;
  while (currentRoute.firstChild) {
    currentRoute = currentRoute.firstChild;
  }

  // Get the URL segments of the activated route
  const urlSegments = currentRoute.snapshot.url.map((segment) => segment.path);

  // Determine the active endpoint based on the URL segments
  const activeEndpoint = '/' + urlSegments.join('/');
  return `.${activeEndpoint}`;
};
