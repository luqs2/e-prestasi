import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import { toast } from 'vue-sonner';

export const useTaskStore = defineStore('task', () => {
  const classTasks = ref<Task[]>([]);

  async function getTasksByClassId(classId: number) {
    try {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .eq('class_id', classId);

      if (error) {
        console.error('Error fetching tasks:', error.message);
        throw error;
      }

      // Simply assign the data to classTasks.value
      classTasks.value = data;
      
      return classTasks.value;
    } catch (error) {
      console.error('Error in getTasksByClassId:', error);
      return [];
    }
  }

  async function addTask(task: Partial<Task>) {
    try {
      // Get current user ID
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        toast.error("You must be signed in to create tasks");
        throw new Error("No authenticated user");
      }
      
      // Add user_id to the task data - omit end_time field
      const { data, error } = await supabase
        .from('task')
        .insert([{
          task_name: task.task_name,
          description: task.description,
          end_date: task.end_date,
          // Removed end_time field
          class_id: task.class_id,
          user_id: userId,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error adding task:', error.message);
        toast.error('Failed to add task');
        throw error;
      }

      toast.success('Task added successfully');
      return data[0] as Task;
    } catch (error) {
      console.error('Error in addTask:', error);
      throw error;
    }
  }

  async function updateTask(taskId: number, task: Partial<Task>) {
    try {
      const { data, error } = await supabase
        .from('task')
        .update({
          task_name: task.task_name,
          description: task.description,
          end_date: task.end_date,
          // Removed end_time field
          class_id: task.class_id
        })
        .eq('id', taskId)
        .select();

      if (error) {
        console.error('Error updating task:', error.message);
        toast.error('Failed to update task');
        throw error;
      }

      toast.success('Task updated successfully');
      return data[0] as Task;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  async function deleteTask(taskId: number) {
    try {
      const { error } = await supabase
        .from('task')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error.message);
        toast.error('Failed to delete task');
        throw error;
      }

      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      return false;
    }
  }



  return {
    classTasks,
    getTasksByClassId,
    addTask,
    updateTask,
    deleteTask,
  };
});