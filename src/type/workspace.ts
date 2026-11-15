type Tab = {
  id: number;
  favIconUrl: string;
  link: string;
  title: string;
  groupId: number;
};
type Project = {
  id: number;
  name: string;
  tabNumber: number;
  tabs: Tab[];
};

type Workspace = {
  id: number;
  workspaceName: string;
  projects: Project[];
};

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: number | null;
}

export type { Tab, Project, Workspace, WorkspaceState };
