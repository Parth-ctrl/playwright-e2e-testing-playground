import { Task } from '../types';
import { ClickUpClient, convertMillisecondsToDisplay } from '../integrations/clickup/client';

export interface SyncConfig {
  clickupClient: ClickUpClient;
  onSyncComplete?: (tasks: Task[]) => void;
  onError?: (error: Error) => void;
}

export async function syncTaskEstimation(
  task: Task,
  clickupClient: ClickUpClient
): Promise<Task> {
  try {
    const clickUpTask = await clickupClient.getTask(task.ticket_id);
    
    return {
      ...task,
      time_estimate: clickUpTask.time_estimate,
      time_estimate_display: convertMillisecondsToDisplay(clickUpTask.time_estimate),
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to sync estimation for task ${task.ticket_id}:`, error);
    return {
      ...task,
      time_estimate: null,
      time_estimate_display: null,
      last_updated: new Date().toISOString(),
    };
  }
}

export async function syncAllTasks(
  tasks: Task[],
  config: SyncConfig
): Promise<Task[]> {
  const syncedTasks: Task[] = [];
  
  for (const task of tasks) {
    if (task.ticket_id) {
      const syncedTask = await syncTaskEstimation(task, config.clickupClient);
      syncedTasks.push(syncedTask);
    } else {
      syncedTasks.push(task);
    }
  }

  config.onSyncComplete?.(syncedTasks);
  return syncedTasks;
}

export function startPeriodicSync(
  tasks: Task[],
  config: SyncConfig,
  intervalMs: number = 300000
): () => void {
  const syncInterval = setInterval(async () => {
    await syncAllTasks(tasks, config);
  }, intervalMs);

  return () => {
    clearInterval(syncInterval);
  };
}
