import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({ selector: 'app-contact', standalone: true, templateUrl: './contact.html' })
export class ContactComponent { i18n = inject(I18nService); }
