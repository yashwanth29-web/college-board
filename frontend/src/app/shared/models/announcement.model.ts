export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishedDate: string;
  createdBy: {
    id: number;
    name: string;
  };
  isActive: boolean;
}
