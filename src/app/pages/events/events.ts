import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { I18nService } from '../../core/services/i18n.service';
import { EventItem, DriveFile } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class EventsComponent implements OnInit {
  private eventsService = inject(EventsService);
  i18n = inject(I18nService);

  loading = signal(true);
  error   = signal<string | null>(null);
  nextEvent  = signal<EventItem | null>(null);
  pastEvents = signal<EventItem[]>([]);

  // Modal state
  modalOpen     = signal(false);
  modalEvent    = signal<EventItem | null>(null);
  modalImages   = signal<DriveFile[]>([]);
  modalLoading  = signal(false);
  modalIndex    = signal(0);

  ngOnInit() {
    this.eventsService.loadAllEvents().subscribe({
      next: (events) => {
        const { next, rest } = this.eventsService.splitEvents(events);
        this.nextEvent.set(next);
        this.pastEvents.set(rest);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos.');
        this.loading.set(false);
      },
    });
  }

  coverUrl(fileId: string): string {
    return this.eventsService.coverUrl(fileId);
  }

  openModal(ev: EventItem): void {
    this.modalEvent.set(ev);
    this.modalImages.set([]);
    this.modalIndex.set(0);
    this.modalLoading.set(true);
    this.modalOpen.set(true);
    document.body.style.overflow = 'hidden';

    this.eventsService.fetchFolderImages(ev.folderId).subscribe({
      next: (imgs) => { this.modalImages.set(imgs); this.modalLoading.set(false); },
      error: ()    => { this.modalImages.set([]);   this.modalLoading.set(false); },
    });
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.modalEvent.set(null);
    this.modalImages.set([]);
    document.body.style.overflow = '';
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  prevSlide(): void {
    const len = this.modalImages().length;
    if (!len) return;
    this.modalIndex.update(i => (i - 1 + len) % len);
  }

  nextSlide(): void {
    const len = this.modalImages().length;
    if (!len) return;
    this.modalIndex.update(i => (i + 1) % len);
  }

  goToSlide(i: number): void { this.modalIndex.set(i); }

  openFull(fileId: string): void {
    window.open(this.coverUrl(fileId), '_blank', 'noopener');
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.modalOpen()) return;
    if (e.key === 'Escape')     this.closeModal();
    if (e.key === 'ArrowLeft')  this.prevSlide();
    if (e.key === 'ArrowRight') this.nextSlide();
  }
}
