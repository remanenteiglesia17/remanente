import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
})
export class AboutComponent {
  i18n = inject(I18nService);

  staff = [
    { name: 'Jonathan Doe',            role: 'Lead Pastor',          img: 'assets/images/avatars/user-01.jpg' },
    { name: 'Jane Doe',                role: 'Lead Pastor',          img: 'assets/images/avatars/user-02.jpg' },
    { name: 'Charles Spurgeon',        role: 'Associate Pastor',     img: 'assets/images/avatars/user-03.jpg' },
    { name: 'Martin Luther',           role: 'Associate Pastor',     img: 'assets/images/avatars/user-04.jpg' },
    { name: 'John Wesley',             role: 'Youth Pastor',         img: 'assets/images/avatars/user-05.jpg' },
    { name: 'Aimee Semple McPherson',  role: 'Kids Church Director', img: 'assets/images/avatars/user-06.jpg' },
  ];
}
