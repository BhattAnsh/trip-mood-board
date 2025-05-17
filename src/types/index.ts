export type MoodColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange';

export interface Sticker {
  id: string;
  type: 'emoji' | 'image' | 'label';
  content: string;
  day: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface Trip {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  moodColor: MoodColor;
  description?: string;
  location?: string;
  stickers: Sticker[];
}
