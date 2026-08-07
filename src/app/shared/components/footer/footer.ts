import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { SmoothScrollDirective } from '../../directives/smooth-scroll.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, SmoothScrollDirective],
  templateUrl: './footer.html',
})
export class FooterComponent {
  i18n = inject(I18nService);
}
