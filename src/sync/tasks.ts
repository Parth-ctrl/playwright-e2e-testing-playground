import { ClickUpClient, ClickUpTaskResponse } from '../integrations/clickup/client';
import { SheetRow, convertMillisecondsToReadable } from '../types';

export interface SyncOptions {
  onProgress?: (current: number, total: number) => void;
}

export class TaskSyncService {
  private clickUpClient: ClickUpClient;
  private cache: Map<string, { data: ClickUpTaskResponse; timestamp: number }> = new Map();
  private cacheTimeout = 300000;

  constructor(clickUpClient: ClickUpClient) {
    this.clickUpClient = clickUpClient;
  }

  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }

  async fetchTaskEstimation(taskId: string): Promise<string> {
    const cached = this.cache.get(taskId);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return convertMillisecondsToReadable(cached.data.time_estimate);
    }

    try {
      const task = await this.clickUpClient.getTask(taskId);
      this.cache.set(taskId, { data: task, timestamp: now });
      return convertMillisecondsToReadable(task.time_estimate);
    } catch (error) {
      console.error(`Failed to fetch estimation for task ${taskId}:`, error);
      return '';
    }
  }

  async syncAllTasks(
    rows: SheetRow[],
    options: SyncOptions = {}
  ): Promise<SheetRow[]> {
    const total = rows.length;
    let current = 0;

    const updatedRows: SheetRow[] = [];

    for (const row of rows) {
      const timeEstimate = await this.fetchTaskEstimation(row.ticketId);
      
      updatedRows.push({
        ...row,
        timeEstimate,
        lastUpdated: new Date().toISOString(),
      });

      current++;
      options.onProgress?.(current, total);
    }

    return updatedRows;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export function createSyncService(clickUpClient: ClickUpClient): TaskSyncService {
  return new TaskSyncService(clickUpClient);
}