import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { BackToTopComponent } from '../back-to-top/back-to-top.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, BackToTopComponent],
  templateUrl: './footer.html',
})
export class FooterComponent {
  i18n = inject(I18nService);
}
