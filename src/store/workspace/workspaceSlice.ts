import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Workspace, Project, WorkspaceState } from "@/type/workspace";
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
    setActiveWorkspace: (state, action: PayloadAction<number | null>) => {
      state.activeWorkspaceId = action.payload;
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
  setActiveWorkspace,
  addProject,
  removeProject,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
