import type { Project as WorkspaceProject } from "@src/type/workspace";
import { IconFolderFilled } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useAppDispatch } from "@src/store/hook";
import { useState } from "react";
import { renameProject } from "@src/store/workspace/workspaceSlice";

interface ProjectProps {
    projects: WorkspaceProject[];
    selectedProjectId?: number;
    onProjectSelect: (projectId: number) => void;
}

function Project({
    projects,
    selectedProjectId,
    onProjectSelect,
}: ProjectProps) {
    return (
        <div className="mt-3 flex w-auto flex-col">
            <div className="flex w-auto items-center justify-between">
                <IconFolderFilled color="#f97316" width="2rem" height="2rem" />
                <Button variant="ghost">Add projects</Button>
            </div>
            <Separator className="bg-black-200/35" />
            <div className="mt-3 flex shrink-0 gap-4 overflow-auto">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        isSelected={project.id === selectedProjectId}
                        onSelect={onProjectSelect}
                    />
                ))}
            </div>
        </div>
    );
}

interface ProjectCardProps {
    project: WorkspaceProject;
    isSelected: boolean;
    onSelect: (projectId: number) => void;
}

function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
    const [value, setValue] = useState("")
    const dispatch = useAppDispatch()
    return (
        <button
            type="button"
            className={`flex w-fit rounded-2xl border-2 border-black-200/10 hover:bg-black-200/10 ${isSelected ? "bg-black-200/10" : ""
                }`}
            onClick={() => onSelect(project.id)}
        >
            <IconFolderFilled color="#f97316" width="5rem" height="5rem" />
            <div className="flex flex-col justify-center p-3 text-left">
                {editingProjectId === project.id ?
                    <input
                        type="text"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onBlur={() => {
                            dispatch(renameProject({ projectId: project.id, ProjectName: value }))
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.currentTarget.blur()
                            }
                        }}
                        autoFocus
                    />
                    : (
                        <h1 onDoubleClick={() => {
                            setValue(project.name)
                            setEditingProjectId(project.id)
                        }}>{project.name}</h1>
                    )
                }
                <h1>{project.tabNumber}</h1>
            </div>
        </button>
    );
}

export default Project;
