import { ActivatedRoute } from '@angular/router';

export const getActiveEndpoint = (route: ActivatedRoute) => {
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
