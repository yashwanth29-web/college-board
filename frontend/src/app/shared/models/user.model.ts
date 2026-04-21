export interface User {
  id: number;
  email: string;
  name: string;
  isStudent: boolean;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
}

export interface Student {
  id: number;
  userId: number;
  studentId: string;
  enrollmentDate: string;
  phone?: string;
  department?: string;
  year?: number;
}
