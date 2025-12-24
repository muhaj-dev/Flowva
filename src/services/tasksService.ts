import { supabase } from '../lib/supabase';
import type { Task, UserTask } from '../types';

export const tasksService = {
  // Get all active tasks
  async getActiveTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get user's task submissions
  async getUserTasks(userId: string): Promise<UserTask[]> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*, tasks(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  // Submit a task
  async submitTask(
    userId: string,
    taskId: string,
    submissionData: { email?: string; screenshot_url?: string }
  ) {
    const { data, error } = await supabase
      .from('user_tasks')
      .upsert({
        user_id: userId,
        task_id: taskId,
        submission_data: submissionData,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload screenshot to Supabase Storage
  async uploadScreenshot(file: File, userId: string, taskId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${taskId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('task-submissions')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('task-submissions')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  },

  // Check if user has submitted a task
  async hasSubmittedTask(userId: string, taskId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return !!data;
  },

  // Get task submission status
  async getTaskStatus(
    userId: string,
    taskId: string
  ): Promise<UserTask['status'] | null> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('status')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.status || null;
  },
};
