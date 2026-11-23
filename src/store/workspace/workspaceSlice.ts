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
      state.activeWorkspaceId = action.payload.id;
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
    addTab: (state, action: PayloadAction<{ Tab: any }>) => {
      const project = state.workspaces
        .flatMap((workspace) => workspace.projects)
        .find((project) => project.id === action.payload.Tab.windowId);
      if (!project) {
        console.error(
          "Unable to find project for browser window:",
          action.payload.Tab.windowId,
        );
        return;
      }

      const tabId = action.payload.Tab.id;
      if (
        typeof tabId === "number" &&
        project.tabs?.some((tab) => tab.id === tabId)
      ) {
        return;
      }

      project.tabs ??= [];
      project.tabs.push(action.payload.Tab);
      project.tabNumber = project.tabs.length;
    },
    removeTab: (
      state,
      action: PayloadAction<{ tabId: number; windowId: number }>,
    ) => {
      const project = state.workspaces
        .flatMap((workspace) => workspace.projects)
        .find((project) => project.id === action.payload.windowId);
      if (!project) {
        console.error(
          "Unable to find project for browser window:",
          action.payload.windowId,
        );
        return;
      }
      const tabId = action.payload.tabId;
      if (typeof tabId === "number" && project.tabs) {
        project.tabs = project.tabs.filter((tab) => tab.id !== tabId);
        project.tabNumber = project.tabs.length;
      }
    },
    updateTab: (state, action: PayloadAction<{ Tab: any }>) => {
      const project = state.workspaces
        .flatMap((workspace) => workspace.projects)
        .find((project) => project.id === action.payload.Tab.windowId);
      if (!project) {
        console.error(
          "Unable to find project for browser window:",
          action.payload.Tab.windowId,
        );
        return;
      }

      const tabId = action.payload.Tab.id;
      project.tabs ??= [];

      if (typeof tabId === "number") {
        const existingIndex = project.tabs.findIndex((tab) => tab.id === tabId);

        if (existingIndex !== -1) {
          project.tabs[existingIndex] = action.payload.Tab;
        } else {
          project.tabs.push(action.payload.Tab);
        }
      } else {
        project.tabs.push(action.payload.Tab);
      }

      project.tabNumber = project.tabs.length;
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
  addTab,
  removeTab,
  updateTab,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
