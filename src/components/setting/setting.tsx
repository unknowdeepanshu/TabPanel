import {
    observeFolder,
    selectBackupFolder,
    subscribeToFolderChanges,
    UpdateFolder,
    type FolderChange,
} from "@src/utils/filehandler";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

function describeChange(change: FolderChange) {
    switch (change.type) {
        case "moved":
            return `Moved: ${change.path}${change.movedFrom ? ` (from ${change.movedFrom})` : ""}`;
        case "disappeared":
            return `Deleted or moved out: ${change.path}`;
        case "appeared":
            return `Created or moved in: ${change.path}`;
        case "modified":
            return `Modified: ${change.path}`;
        case "errored":
            return "Monitoring stopped because the selected folder is no longer available.";
        case "unknown":
            return "Some changes may have been missed.";
        default:
            return `${change.type}: ${change.path}`;
    }
}

function Setting() {
    return (
        <div className="flex h-full w-full bg-white p-4">
            <div className="flex w-full flex-col gap-3 bg-white">
                <FileConnection />
            </div>
        </div>
    );
}

function FileConnection() {
    const [folderName, setFolderName] = useState("");
    const [monitoring, setMonitoring] = useState(false);
    const [monitorMessage, setMonitorMessage] = useState("");
    const [changes, setChanges] = useState<FolderChange[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(
        () =>
            subscribeToFolderChanges((newChanges) => {
                setChanges((previousChanges) =>
                    [...newChanges, ...previousChanges].slice(0, 10),
                );
                if (newChanges.some((change) => change.type === "errored")) {
                    setMonitoring(false);
                    setMonitorMessage(
                        "Monitoring stopped because the selected folder is no longer available.",
                    );
                }
            }),
        [],
    );

    const handleSelectFolder = async () => {
        setIsSelecting(true);
        setErrorMessage("");
        try {
            const name = await selectBackupFolder();
            setChanges([]);
            setFolderName(name);
            await UpdateFolder();

            const isMonitoring = await observeFolder();
            setMonitoring(isMonitoring);
            setMonitorMessage(
                isMonitoring
                    ? "Monitoring this folder for changes."
                    : "This browser does not support live folder monitoring.",
            );
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            setMonitoring(false);
            setMonitorMessage("");
            setErrorMessage(
                error instanceof Error ? error.message : String(error),
            );
        } finally {
            setIsSelecting(false);
        }
    };

    return (
        <>
            <Separator />
            <div className="flex h-fit w-full justify-between">
                <h2 className="text-[1rem] font-bold">Selected Folder:</h2>
                <div className="flex items-center gap-3">
                    {folderName && <p>{folderName}</p>}
                    <button
                        className="h-fit w-fit"
                        onClick={handleSelectFolder}
                        disabled={isSelecting}
                    >
                        {isSelecting
                            ? "Selecting..."
                            : folderName
                              ? "Change Folder"
                              : "Select Folder & Create File"}
                    </button>
                </div>
            </div>
            {monitorMessage && (
                <p
                    role="status"
                    className={monitoring ? "text-green-700" : "text-amber-700"}
                >
                    {monitorMessage}
                </p>
            )}
            {errorMessage && (
                <p role="alert" className="text-red-700">
                    {errorMessage}
                </p>
            )}
            {changes.length > 0 && (
                <section aria-label="Recent folder changes" className="mt-3">
                    <h3 className="font-semibold">Recent changes</h3>
                    <ul className="list-inside list-disc">
                        {changes.map((change, index) => (
                            <li key={`${change.type}-${change.path}-${index}`}>
                                {describeChange(change)}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <Separator />
        </>
    );
}

export { Setting, FileConnection };
