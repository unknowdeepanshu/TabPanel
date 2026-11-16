import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Workspace, Project, WorkspaceState } from "@src/type/workspace";
import { filledWorkspaceData } from "./thunkapi/workspaceThunk";

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspaces.push(action.payload);
      state.activeWorkspaceId ??= action.payload.id;
    },
    removeWorkspace: (state, action: PayloadAction<number>) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload,
      );

      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = state.workspaces[0]?.id ?? null;
      }
    },
    renameWorkspace: (
      state,
      action: PayloadAction<{
        id: number | null;
        workspaceName: string | null;
      }>,
    ) => {
      const workspace = state.workspaces.find(
        (item) => item.id === action.payload.id,
      );

      if (workspace && action.payload.workspaceName !== null) {
        workspace.workspaceName = action.payload.workspaceName;
      }
    },
    addProject: (
      state,
      action: PayloadAction<{ workspaceId: number; project: Project }>,
    ) => {
      const workspace = state.workspaces.find(
        (item) => item.id === action.payload.workspaceId,
      );

      if (workspace) {
        workspace.projects.push(action.payload.project);
      }
    },
    renameProject: (
      state,
      action: PayloadAction<{
        projectId: number;
        ProjectName: string;
      }>,
    ) => {
      const project = state.workspaces
        .flatMap((workspace) => workspace.projects)
        .find((project) => project.id === action.payload.projectId);

      if (project && action.payload.ProjectName !== null) {
        project.name = action.payload.ProjectName;
      }
    },
    removeProject: (
      state,
      action: PayloadAction<{ workspaceId: number; projectId: number }>,
    ) => {
      const workspace = state.workspaces.find(
        (item) => item.id === action.payload.workspaceId,
      );

      if (workspace) {
        workspace.projects = workspace.projects.filter(
          (project) => project.id !== action.payload.projectId,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(filledWorkspaceData.fulfilled, (state, action) => {
      state.workspaces = action.payload;
      state.activeWorkspaceId = action.payload[0]?.id ?? null;
    });
  },
});

export const {
  addWorkspace,
  removeWorkspace,
  renameWorkspace,
  addProject,
  removeProject,
  renameProject,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
