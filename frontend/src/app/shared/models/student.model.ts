export interface Student {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    isActive: boolean;
  };
  studentId: string;
  enrollmentDate: string;
  phone?: string;
  department?: string;
  year?: number;
}

export interface StudentDetail {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    isActive: boolean;
  };
  studentId: string;
  enrollmentDate: string;
  phone?: string;
  department?: string;
  year?: number;
}

export interface StudentUpdate {
  name?: string;
  phone?: string;
  department?: string;
  year?: number;
}
