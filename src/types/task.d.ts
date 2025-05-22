interface Task {
  id: number;
  task_name: string;
  description?: string;
  class_id: number;
  end_date: string;
  created_at?: string;
  user_id?: string;
}