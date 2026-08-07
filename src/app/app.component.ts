import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { SocialBarComponent } from './shared/components/social-bar/social-bar';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SocialBarComponent],
  template: `
    <div id="top">
      <app-header />
      <main>
        <router-outlet />
      </main>
      <app-social-bar />
      <app-footer />
    </div>
  `,
})
export class AppComponent implements OnInit {
  private i18n = inject(I18nService);
  ngOnInit() { this.i18n.init(); }
}
