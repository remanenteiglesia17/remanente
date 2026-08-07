export interface DriveFile {
  id: string;
  name: string;
}

export interface EventText {
  folder: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  cost?: string;
}

export interface EventItem {
  folderId: string;
  folderName: string;
  title: string;
  description: string;
  dateRaw: string | null;
  dateObj: Date | null;
  dateLabel: string | null;
  time: string;
  location: string;
  cost: string;
  coverId: string | null;
  imageCount: number;
}
