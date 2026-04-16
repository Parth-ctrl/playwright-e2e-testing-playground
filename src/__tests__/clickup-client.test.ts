import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClickUpClient, ClickUpTaskResponse } from '../integrations/clickup/client';

describe('ClickUpClient', () => {
  let client: ClickUpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    client = new ClickUpClient({ apiToken: 'test-token' });
  });

  it('should fetch task with time_estimate field', async () => {
    const mockTask: ClickUpTaskResponse = {
      id: 'task123',
      name: 'Test Task',
      time_estimate: 3600000,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    });

    const result = await client.getTask('task123');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.clickup.com/api/v2/task/task123?fields=time_estimate',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'test-token',
        }),
      })
    );
    expect(result).toEqual(mockTask);
  });

  it('should return null for time_estimate when not set', async () => {
    const mockTask: ClickUpTaskResponse = {
      id: 'task123',
      name: 'Test Task',
      time_estimate: null,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    });

    const result = await client.getTask('task123');
    expect(result.time_estimate).toBeNull();
  });

  it('should throw error on failed request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(client.getTask('task123')).rejects.toThrow('Failed to fetch task: 401 Unauthorized');
  });
});