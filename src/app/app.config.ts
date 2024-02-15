import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.routes';
import { DatePipe } from '@angular/common';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    NgbModule,
    BrowserModule,
    importProvidersFrom(HttpClientModule),
    DatePipe,
    {
      provide: Window,
      useValue: window,
    },
  ],
};
