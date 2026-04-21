export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentRegistrations: number;
  isFull: boolean;
  isActive: boolean;
  createdBy?: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

export interface EventRegistration {
  id: number;
  studentId: number;
  eventId: number;
  registeredAt: string;
}
