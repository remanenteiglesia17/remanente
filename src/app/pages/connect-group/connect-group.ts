import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({ selector: 'app-connect-group', standalone: true, templateUrl: './connect-group.html' })
export class ConnectGroupComponent { i18n = inject(I18nService); }
