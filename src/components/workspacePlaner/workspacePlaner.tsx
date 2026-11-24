import Project from "../project/project";
import Tabs from "../tab/tab";
import { Button } from "@src/components/ui/button";
import { Field } from "@src/components/ui/field";
import { Input } from "@src/components/ui/input";

import type { Project as WorkspaceProject } from "@src/type/workspace";
export interface WorkspacePlannerProps {
    workspaceId: number;
    workspaceName: string;
    projects: WorkspaceProject[];
    selectedProjectId?: number;
    selectedTabId?: number;
    onProjectSelect: (projectId: number) => void;
    onTabSelect: (tabId: number) => void;
}

export function WorkspacePlanner({
    workspaceId,
    workspaceName,
    projects,
    selectedProjectId,
    selectedTabId,
    onProjectSelect,
    onTabSelect,
}: WorkspacePlannerProps) {
    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId,
    );
    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                <h1 className="flex text-3xl">{workspaceName}</h1>
                <InputInline />
            </div>
            <div className="rounded-xl bg-white/90 p-4 shadow-sm">
                <Project
                    workspaceId={workspaceId}
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onProjectSelect={onProjectSelect}
                />
            </div>
            <div className="rounded-xl bg-white/80 p-1 shadow-sm">
                <Tabs
                    selectedProjectId={selectedProjectId}
                    workspaceId={workspaceId}
                    ProjectTitle={selectedProject?.name}
                    tabs={selectedProject?.tabs ?? []}
                    selectedTabId={selectedTabId}
                    onTabSelect={onTabSelect}
                />
            </div>
        </div>
    );
}


export function InputInline() {
    return (
        <Field orientation="horizontal">
            <Input type="search" placeholder="Search..." className="ring-1" />
            <Button variant="orange" className="">
                Search
            </Button>
        </Field>
    );
}