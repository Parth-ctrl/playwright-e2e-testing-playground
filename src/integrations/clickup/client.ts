export interface ClickUpConfig {
  apiToken: string;
  teamId?: string;
}

export interface ClickUpTaskResponse {
  id: string;
  name: string;
  time_estimate: number | null;
}

export class ClickUpClient {
  private apiToken: string;
  private baseUrl = 'https://api.clickup.com/api/v2';

  constructor(config: ClickUpConfig) {
    this.apiToken = config.apiToken;
  }

  async getTask(taskId: string): Promise<ClickUpTaskResponse> {
    const url = `${this.baseUrl}/task/${taskId}?fields=time_estimate`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': this.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      time_estimate: data.time_estimate ?? null,
    };
  }
}

export function createClickUpClient(config: ClickUpConfig): ClickUpClient {
  return new ClickUpClient(config);
}