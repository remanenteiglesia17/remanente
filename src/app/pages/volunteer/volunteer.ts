import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({ selector: 'app-volunteer', standalone: true, templateUrl: './volunteer.html' })
export class VolunteerComponent { i18n = inject(I18nService); }
