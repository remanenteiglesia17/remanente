import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {
  isVisible = false;
  private readonly pxShow = 500; // Umbral de scroll del script original

  // Detecta el scroll de la ventana
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isVisible = window.scrollY >= this.pxShow;
  }

  // Realiza el scroll suave hacia arriba
  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}