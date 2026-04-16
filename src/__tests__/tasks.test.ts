import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskSyncService } from '../sync/tasks';
import { ClickUpClient } from '../integrations/clickup/client';
import { SheetRow } from '../types';

describe('TaskSyncService', () => {
  let mockClient: ClickUpClient;
  let service: TaskSyncService;

  beforeEach(() => {
    mockClient = {
      getTask: vi.fn(),
    } as unknown as ClickUpClient;
    service = new TaskSyncService(mockClient);
  });

  describe('fetchTaskEstimation', () => {
    it('should return readable time estimate from API', async () => {
      vi.mocked(mockClient.getTask).mockResolvedValueOnce({
        id: 'task123',
        name: 'Test Task',
        time_estimate: 3600000,
      });

      const result = await service.fetchTaskEstimation('task123');
      expect(result).toBe('1h');
    });

    it('should return empty string when time_estimate is null', async () => {
      vi.mocked(mockClient.getTask).mockResolvedValueOnce({
        id: 'task123',
        name: 'Test Task',
        time_estimate: null,
      });

      const result = await service.fetchTaskEstimation('task123');
      expect(result).toBe('');
    });

    it('should return empty string when time_estimate is 0', async () => {
      vi.mocked(mockClient.getTask).mockResolvedValueOnce({
        id: 'task123',
        name: 'Test Task',
        time_estimate: 0,
      });

      const result = await service.fetchTaskEstimation('task123');
      expect(result).toBe('');
    });

    it('should return empty string on API error', async () => {
      vi.mocked(mockClient.getTask).mockRejectedValueOnce(new Error('API Error'));

      const result = await service.fetchTaskEstimation('task123');
      expect(result).toBe('');
    });

    it('should use cache when available', async () => {
      service.setCacheTimeout(60000);
      
      vi.mocked(mockClient.getTask).mockResolvedValueOnce({
        id: 'task123',
        name: 'Test Task',
        time_estimate: 7200000,
      });

      await service.fetchTaskEstimation('task123');
      const result = await service.fetchTaskEstimation('task123');

      expect(mockClient.getTask).toHaveBeenCalledTimes(1);
      expect(result).toBe('2h');
    });
  });

  describe('syncAllTasks', () => {
    it('should update all rows with time estimates', async () => {
      vi.mocked(mockClient.getTask)
        .mockResolvedValueOnce({
          id: 'task1',
          name: 'Task 1',
          time_estimate: 1800000,
        })
        .mockResolvedValueOnce({
          id: 'task2',
          name: 'Task 2',
          time_estimate: 3600000,
        });

      const rows: SheetRow[] = [
        { id: '1', ticketId: 'task1', ticketLink: '', timeEstimate: null, lastUpdated: null },
        { id: '2', ticketId: 'task2', ticketLink: '', timeEstimate: null, lastUpdated: null },
      ];

      const result = await service.syncAllTasks(rows);

      expect(result[0].timeEstimate).toBe('30m');
      expect(result[1].timeEstimate).toBe('1h');
      expect(result[0].lastUpdated).toBeDefined();
    });

    it('should call onProgress callback', async () => {
      vi.mocked(mockClient.getTask).mockResolvedValue({
        id: 'task1',
        name: 'Task 1',
        time_estimate: 1800000,
      });

      const onProgress = vi.fn();
      const rows: SheetRow[] = [
        { id: '1', ticketId: 'task1', ticketLink: '', timeEstimate: null, lastUpdated: null },
      ];

      await service.syncAllTasks(rows, { onProgress });

      expect(onProgress).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      vi.mocked(mockClient.getTask).mockResolvedValueOnce({
        id: 'task123',
        name: 'Test Task',
        time_estimate: 3600000,
      });

      await service.fetchTaskEstimation('task123');
      service.clearCache();
      await service.fetchTaskEstimation('task123');

      expect(mockClient.getTask).toHaveBeenCalledTimes(2);
    });
  });
});