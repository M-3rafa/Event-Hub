import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'dashboard/createEvent', renderMode: RenderMode.Client },
  {
    path: 'dashboard/eventDetails/:id',
    renderMode: RenderMode.Client,
  },

  {
    path: 'dashboard/editPlace/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/PlaceAvailability/:id',
    renderMode: RenderMode.Client,
  },

  {
    path: 'dashboard/eventDetails/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/editPlace/:id',
    renderMode: RenderMode.Client,
  },

  {
    path: 'User/EventsDetails/:id',
    renderMode: RenderMode.Client,
  },

  { path: '**', renderMode: RenderMode.Client },
];
