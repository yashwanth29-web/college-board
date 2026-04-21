export type ReelFileType = 'video' | 'image';

export interface Reel {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: ReelFileType;
  fileSize: number;
  thumbnailUrl?: string;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  isActive: boolean;
  views: number;
}
