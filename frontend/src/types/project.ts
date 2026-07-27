export type ProjectStatus = string;

export type ProjectResponse = {
  id: number;
  name: string;
  description: string | null;
  client_name: string | null;
  status: ProjectStatus;
  budget: number;
  start_date: string | null;
  deadline: string | null;
  owner_id: number;
  is_archived: boolean;
  created_at: string;
};

export type ProjectCreateRequest = {
  name: string;
  description?: string | null;
  client_name?: string | null;
  status?: ProjectStatus;
  budget?: number;
  start_date?: string | null;
  deadline?: string | null;
};

export type ProjectUpdateRequest = {
  name?: string | null;
  description?: string | null;
  client_name?: string | null;
  status?: ProjectStatus | null;
  budget?: number | null;
  start_date?: string | null;
  deadline?: string | null;
};
