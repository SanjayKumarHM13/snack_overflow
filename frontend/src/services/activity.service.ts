import { apiFetch } from './api';
import { Activity, PaginatedResponse } from '../types/index';

export const activityService = {
  async listActivities(page = 1, limit = 20): Promise<PaginatedResponse<Activity>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiFetch<PaginatedResponse<Activity>>(`/activities?${params.toString()}`);
  },
};
