export type Priority = 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: Priority;
  starred: boolean;
  categoryId: string;
  subTasks: SubTask[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type FilterType = 'today' | 'important' | 'upcoming' | 'all' | 'completed' | string;
export type SortOption = 'created' | 'due' | 'priority';

