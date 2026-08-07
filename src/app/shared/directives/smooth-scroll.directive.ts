import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[smoothScroll]',
  standalone: true,
})
export class SmoothScrollDirective {
  @Input() smoothScroll = '';   // acepta target opcional, p.ej. smoothScroll="#about"

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
    if (!href?.startsWith('#')) return;

    e.preventDefault();
    const targetId = href.slice(1);                         // quita el #
    const target   = targetId === 'top'
      ? document.body
      : document.getElementById(targetId);

    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
