import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { SmoothScrollDirective } from '../../shared/directives/smooth-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SmoothScrollDirective],
  templateUrl: './home.html',
})
export class HomeComponent {
  i18n = inject(I18nService);
}