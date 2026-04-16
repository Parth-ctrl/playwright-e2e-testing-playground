export interface ClickUpTask {
  id: string;
  name: string;
  time_estimate: number | null;
}

export interface ClickUpConfig {
  apiKey: string;
  teamId: string;
}

export function convertMillisecondsToDisplay(milliseconds: number | null): string | null {
  if (milliseconds === null || milliseconds === 0) {
    return null;
  }

  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

export class ClickUpClient {
  private apiKey: string;
  private baseUrl = 'https://api.clickup.com/api/v2';

  constructor(config: ClickUpConfig) {
    this.apiKey = config.apiKey;
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getTask(taskId: string): Promise<ClickUpTask> {
    const response = await this.request<{ task: ClickUpTask }>(
      `/task/${taskId}`,
      { 'fields': 'time_estimate' }
    );
    
    return response.task;
  }
}
