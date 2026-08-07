import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { EventItem, DriveFile, EventText } from '../models/event.model';
import { environment } from '../../../environments/environment';

const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const JSONBIN_API = 'https://api.jsonbin.io/v3/b';

const MESES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
];

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);

  private formatFecha(fechaStr: string | undefined): string | null {
    if (!fechaStr) return null;
    const d = new Date(fechaStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  }

  coverUrl(fileId: string): string {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  private driveList(query: string, fields: string): Observable<DriveFile[]> {
    const url = `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(' + fields + ')')}&pageSize=200&key=${environment.googleApiKey}`;
    return this.http.get<{ files: DriveFile[] }>(url).pipe(
      map(res => res.files || [])
    );
  }

  private fetchFolders(): Observable<DriveFile[]> {
    const q = `'${environment.driveParentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    return this.driveList(q, 'id,name');
  }

  fetchFolderImages(folderId: string): Observable<DriveFile[]> {
    const q = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;
    return this.driveList(q, 'id,name').pipe(
      map(files => files.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  private fetchEventTexts(): Observable<EventText[]> {
    const headers: Record<string, string> = {
      'X-Access-Key': environment.jsonbinAccessKey,
    };
    return this.http.get<{ record: { events: EventText[] } }>(
      `${JSONBIN_API}/${environment.jsonbinBinId}/latest`,
      { headers }
    ).pipe(
      map(res => (res.record && res.record.events) || []),
      catchError(() => of([]))
    );
  }

  private matchText(folderName: string, texts: EventText[]): EventText | undefined {
    const norm = (s: string) => (s || '').trim().toLowerCase();
    return texts.find(t => norm(t.folder) === norm(folderName));
  }

  loadAllEvents(): Observable<EventItem[]> {
    return forkJoin([this.fetchFolders(), this.fetchEventTexts()]).pipe(
      switchMap(([folders, texts]) => {
        if (!folders.length) return of([]);
        const eventObs = folders.map(folder => {
          const text = this.matchText(folder.name, texts) || {};
          return this.fetchFolderImages(folder.id).pipe(
            catchError(() => of([])),
            map((images: DriveFile[]) => {
              const cover = images[0] || null;
              const dateObj = (text as EventText).date
                ? new Date((text as EventText).date! + 'T00:00:00')
                : null;
              const item: EventItem = {
                folderId: folder.id,
                folderName: folder.name,
                title: (text as EventText).title || folder.name,
                description: (text as EventText).description || '',
                dateRaw: (text as EventText).date || null,
                dateObj: dateObj && !isNaN(dateObj.getTime()) ? dateObj : null,
                dateLabel: this.formatFecha((text as EventText).date),
                time: (text as EventText).time || '',
                location: (text as EventText).location || '',
                cost: (text as EventText).cost || '',
                coverId: cover ? cover.id : null,
                imageCount: images.length,
              };
              return item;
            })
          );
        });
        return forkJoin(eventObs);
      })
    );
  }

  splitEvents(events: EventItem[]): { next: EventItem | null; rest: EventItem[] } {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => e.dateObj && e.dateObj >= now)
      .sort((a, b) => a.dateObj!.getTime() - b.dateObj!.getTime());

    const next = upcoming.shift() || null;

    const rest = events
      .filter(e => e !== next)
      .sort((a, b) => {
        if (a.dateObj && b.dateObj) return b.dateObj.getTime() - a.dateObj.getTime();
        if (a.dateObj) return -1;
        if (b.dateObj) return 1;
        return a.title.localeCompare(b.title);
      });

    return { next, rest };
  }
}
