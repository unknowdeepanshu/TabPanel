import { IconExternalLinkFilled, IconDotsVerticalFilled } from '@tabler/icons-react';
import { IconWorld } from '@tabler/icons-react';
import type { Tab as WorkspaceTab } from "@src/type/workspace";
import { Separator } from '../ui/separator';
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    SidebarMenuAction,
    useSidebar,
} from "@src/components/ui/sidebar"
import { IconDownloadFilled, IconExternalLink, IconSquareX } from '@tabler/icons-react';
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { useOpenAllTabs } from '@src/utils/browser';


interface TabsProps {
    workspaceId?: number;
    tabs: WorkspaceTab[];
    selectedTabId?: number;
    onTabSelect: (tabId: number) => void;
    ProjectTitle: string | undefined;
    selectedProjectId?: number;
}

function Tabs({ workspaceId, tabs, selectedTabId, onTabSelect, ProjectTitle, selectedProjectId }: TabsProps) {
    const { isMobile } = useSidebar()
    const { openAllTabs, closeAllTabs } = useOpenAllTabs()
    const handleTabOpen = () => {
        const windowId = tabs[0]?.windowId
        if (windowId === undefined || workspaceId === undefined || selectedProjectId === undefined) return
        const TabUrls = tabs.map((tab) => (tab.url))
        openAllTabs({ workspaceId, urls: TabUrls, windowsId: windowId, projectId: selectedProjectId })
    }
    const handleTabClose = () => {
        const windowId = tabs[0]?.windowId
        if (windowId === undefined || workspaceId === undefined || selectedProjectId === undefined) return
        closeAllTabs(windowId)
    }
    return (<>
        <div className='flex w-auto flex-col p-2 rounded-2xl'>
            <div className='w-auto flex items-center relative justify-between'>
                <div className='flex items-center'>
                    <Chrome /><h1 className='text-[0.9rem]'>{ProjectTitle}</h1>
                </div>
                {/* <Button variant="ghost" ><IconDotsVerticalFilled /></Button> */}
                <DropdownMenu  >
                    <DropdownMenuTrigger
                        className="md:opacity-100"
                        render={
                            <SidebarMenuAction
                                showOnHover
                                className="aria-expanded:bg-muted"
                            />
                        }
                    >
                        <IconDotsVerticalFilled />
                        <span className="sr-only">More</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-fit "
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="default">
                            <IconDownloadFilled />
                            <span>Save session </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleTabOpen} variant="default">
                            <IconExternalLink />
                            <span>Open all Tabs</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleTabClose}>
                            <IconSquareX />
                            <span>Close all Tabs</span>
                        </DropdownMenuItem> <DropdownMenuItem variant="destructive">
                            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                            <span>Delete Project</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator className="bg-black-200/35" />
            <div className="mt-3 grid w-full grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
                {tabs.map((tab) => (
                    <TabsCard
                        key={tab.id}
                        tab={tab}
                        isSelected={tab.id === selectedTabId}
                        onSelect={onTabSelect}
                    />
                ))}
            </div>
        </div>

    </>);
}

interface TabsCardProps {
    tab: WorkspaceTab;
    isSelected: boolean;
    onSelect: (tabId: number) => void;
}
function TabsCard({ tab, isSelected, onSelect }: TabsCardProps) {
    const [faviconFailed, setFaviconFailed] = useState(!tab.favIconUrl)

    return (
        <>
            <button
                type="button"
                className={`flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-2xl border-2 border-gray-700/30  p-3 text-left hover:bg-black-200/5 ${isSelected ? "ring-2 bg-black-200/5 ring-orange-400" : ""
                    }`}
                onClick={() => onSelect(tab.id)}
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    {faviconFailed ? (
                        <IconWorld size={24} className="text-gray-500" />
                    ) : (
                        <img
                            src={tab.favIconUrl}
                            alt=""
                            className="h-8 w-8 object-contain"
                            onError={() => setFaviconFailed(true)}
                        />
                    )}
                </div>
                <span className="min-w-0 flex-1 truncate" title={tab.title}>
                    {tab.title || "Unknown"}
                </span>
                <IconExternalLinkFilled className="shrink-0" height={15} />
            </button>
        </>
    )
}
export default Tabs;

function Chrome() {
    return (<>

        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 2000 2000">
            <defs>
                <clipPath id="clip-0">

                </clipPath>
                <clipPath id="clip-1">
                    <path clipRule="nonzero" d="M 453 368 L 1547 368 L 1547 1158 L 453 1158 Z M 453 368 " />
                </clipPath>
                <clipPath id="clip-2">
                    <path clipRule="nonzero" d="M 1000 368.859375 C 766.398438 368.859375 562.597656 495.871094 453.464844 684.511719 L 726.703125 1157.789062 L 1000 1000.011719 L 1000 684.441406 L 1546.5 684.441406 C 1437.351562 495.839844 1233.578125 368.859375 1000 368.859375 Z M 1000 368.859375 " />
                </clipPath>
                <clipPath id="clip-3">
                    <path clipRule="nonzero" d="M 1000 368.859375 C 766.398438 368.859375 562.597656 495.871094 453.464844 684.511719 L 726.703125 1157.789062 L 1000 1000.011719 L 1000 684.441406 L 1546.5 684.441406 C 1437.351562 495.839844 1233.578125 368.859375 1000 368.859375 " />
                </clipPath>
                <linearGradient id="linear-pattern-0" gradientUnits="userSpaceOnUse" x1="-0.33156" y1="0" x2="1.582476" y2="0" gradientTransform="matrix(571.064, 0, 0, -571.064, 642.805, 763.33)">
                    <stop offset="0" stopColor="rgb(87.988281%, 18.182373%, 19.010925%)" stop-opacity="1" />
                    <stop offset="0.125" stopColor="rgb(87.988281%, 18.182373%, 19.010925%)" stop-opacity="1" />
                    <stop offset="0.1875" stopColor="rgb(88.093567%, 18.173218%, 18.997192%)" stop-opacity="1" />
                    <stop offset="0.195312" stopColor="rgb(88.247681%, 18.264771%, 18.971252%)" stop-opacity="1" />
                    <stop offset="0.203125" stopColor="rgb(88.296509%, 18.414307%, 19.009399%)" stop-opacity="1" />
                    <stop offset="0.21875" stopColor="rgb(88.299561%, 18.450928%, 19.096375%)" stop-opacity="1" />
                    <stop offset="0.226562" stopColor="rgb(88.362122%, 18.438721%, 19.12384%)" stop-opacity="1" />
                    <stop offset="0.234375" stopColor="rgb(88.508606%, 18.423462%, 19.10553%)" stop-opacity="1" />
                    <stop offset="0.242187" stopColor="rgb(88.595581%, 18.467712%, 19.091797%)" stop-opacity="1" />
                    <stop offset="0.25" stopColor="rgb(88.604736%, 18.624878%, 19.104004%)" stop-opacity="1" />
                    <stop offset="0.257812" stopColor="rgb(88.641357%, 18.716431%, 19.18335%)" stop-opacity="1" />
                    <stop offset="0.265625" stopColor="rgb(88.787842%, 18.690491%, 19.232178%)" stop-opacity="1" />
                    <stop offset="0.28125" stopColor="rgb(88.903809%, 18.682861%, 19.216919%)" stop-opacity="1" />
                    <stop offset="0.296875" stopColor="rgb(89.047241%, 18.818665%, 19.271851%)" stop-opacity="1" />
                    <stop offset="0.3125" stopColor="rgb(89.204407%, 18.946838%, 19.334412%)" stop-opacity="1" />
                    <stop offset="0.328125" stopColor="rgb(89.318848%, 18.955994%, 19.429016%)" stop-opacity="1" />
                    <stop offset="0.335937" stopColor="rgb(89.476013%, 19.076538%, 19.552612%)" stop-opacity="1" />
                    <stop offset="0.34375" stopColor="rgb(89.61792%, 19.238281%, 19.572449%)" stop-opacity="1" />
                    <stop offset="0.351562" stopColor="rgb(89.768982%, 19.277954%, 19.596863%)" stop-opacity="1" />
                    <stop offset="0.359375" stopColor="rgb(89.831543%, 19.255066%, 19.680786%)" stop-opacity="1" />
                    <stop offset="0.375" stopColor="rgb(89.831543%, 19.245911%, 19.726562%)" stop-opacity="1" />
                    <stop offset="0.382812" stopColor="rgb(89.872742%, 19.238281%, 19.746399%)" stop-opacity="1" />
                    <stop offset="0.390625" stopColor="rgb(90.019226%, 19.207764%, 19.819641%)" stop-opacity="1" />
                    <stop offset="0.398438" stopColor="rgb(90.126038%, 19.210815%, 19.871521%)" stop-opacity="1" />
                    <stop offset="0.40625" stopColor="rgb(90.138245%, 19.377136%, 19.862366%)" stop-opacity="1" />
                    <stop offset="0.421875" stopColor="rgb(90.293884%, 19.502258%, 19.836426%)" stop-opacity="1" />
                    <stop offset="0.429688" stopColor="rgb(90.440369%, 19.473267%, 19.903564%)" stop-opacity="1" />
                    <stop offset="0.4375" stopColor="rgb(90.440369%, 19.454956%, 19.995117%)" stop-opacity="1" />
                    <stop offset="0.453125" stopColor="rgb(90.560913%, 19.569397%, 19.981384%)" stop-opacity="1" />
                    <stop offset="0.460937" stopColor="rgb(90.72113%, 19.709778%, 20.018005%)" stop-opacity="1" />
                    <stop offset="0.46875" stopColor="rgb(90.759277%, 19.729614%, 20.10498%)" stop-opacity="1" />
                    <stop offset="0.484375" stopColor="rgb(90.757751%, 19.725037%, 20.132446%)" stop-opacity="1" />
                    <stop offset="0.492187" stopColor="rgb(90.826416%, 19.711304%, 20.167542%)" stop-opacity="1" />
                    <stop offset="0.5" stopColor="rgb(90.979004%, 19.747925%, 20.237732%)" stop-opacity="1" />
                    <stop offset="0.515625" stopColor="rgb(91.069031%, 19.897461%, 20.269775%)" stop-opacity="1" />
                    <stop offset="0.523438" stopColor="rgb(91.07666%, 19.993591%, 20.28656%)" stop-opacity="1" />
                    <stop offset="0.53125" stopColor="rgb(91.1026%, 19.973755%, 20.376587%)" stop-opacity="1" />
                    <stop offset="0.546875" stopColor="rgb(91.249084%, 19.95697%, 20.429993%)" stop-opacity="1" />
                    <stop offset="0.5625" stopColor="rgb(91.384888%, 20.114136%, 20.407104%)" stop-opacity="1" />
                    <stop offset="0.570312" stopColor="rgb(91.526794%, 20.245361%, 20.465088%)" stop-opacity="1" />
                    <stop offset="0.578125" stopColor="rgb(91.673279%, 20.214844%, 20.541382%)" stop-opacity="1" />
                    <stop offset="0.59375" stopColor="rgb(91.796875%, 20.202637%, 20.536804%)" stop-opacity="1" />
                    <stop offset="0.609375" stopColor="rgb(91.944885%, 20.179749%, 20.573425%)" stop-opacity="1" />
                    <stop offset="0.617188" stopColor="rgb(91.993713%, 20.249939%, 20.658875%)" stop-opacity="1" />
                    <stop offset="0.625" stopColor="rgb(92.077637%, 20.404053%, 20.680237%)" stop-opacity="1" />
                    <stop offset="0.632812" stopColor="rgb(92.23175%, 20.462036%, 20.698547%)" stop-opacity="1" />
                    <stop offset="0.640625" stopColor="rgb(92.308044%, 20.439148%, 20.782471%)" stop-opacity="1" />
                    <stop offset="0.65625" stopColor="rgb(92.308044%, 20.428467%, 20.837402%)" stop-opacity="1" />
                    <stop offset="0.664062" stopColor="rgb(92.337036%, 20.423889%, 20.851135%)" stop-opacity="1" />
                    <stop offset="0.671875" stopColor="rgb(92.483521%, 20.393372%, 20.928955%)" stop-opacity="1" />
                    <stop offset="0.6875" stopColor="rgb(92.604065%, 20.372009%, 20.98999%)" stop-opacity="1" />
                    <stop offset="0.75" stopColor="rgb(92.616272%, 20.541382%, 20.982361%)" stop-opacity="1" />
                    <stop offset="1" stopColor="rgb(92.630005%, 20.707703%, 20.976257%)" stop-opacity="1" />
                </linearGradient>
                <clipPath id="clip-4">
                    <path clipRule="nonzero" d="M 368 684 L 1274 684 L 1274 1632 L 368 1632 Z M 368 684 " />
                </clipPath>
                <clipPath id="clip-5">
                    <path clipRule="nonzero" d="M 368.863281 1000 C 368.863281 1348.570312 651.425781 1631.140625 1000 1631.140625 L 1273.300781 1157.78125 L 1000 1000 L 726.703125 1157.78125 L 453.464844 684.5 C 399.757812 777.339844 368.859375 885.019531 368.859375 999.988281 " />
                </clipPath>
                <clipPath id="clip-6">
                    <path clipRule="nonzero" d="M 368.863281 1000 C 368.863281 1348.570312 651.425781 1631.140625 1000 1631.140625 L 1273.300781 1157.78125 L 1000 1000 L 726.703125 1157.78125 L 453.464844 684.5 C 399.757812 777.339844 368.859375 885.019531 368.859375 999.988281 " />
                </clipPath>
                <linearGradient id="linear-pattern-1" gradientUnits="userSpaceOnUse" x1="-0.464825" y1="0" x2="2.252595" y2="0" gradientTransform="matrix(234.05, 405.39, 405.39, -234.05, 609.386, 796.88)">
                    <stop offset="0" stopColor="rgb(24.031067%, 70.657349%, 33.743286%)" stop-opacity="1" />
                    <stop offset="0.125" stopColor="rgb(24.031067%, 70.657349%, 33.743286%)" stop-opacity="1" />
                    <stop offset="0.15625" stopColor="rgb(24.031067%, 70.657349%, 33.743286%)" stop-opacity="1" />
                    <stop offset="0.171875" stopColor="rgb(24.031067%, 70.657349%, 33.743286%)" stop-opacity="1" />
                    <stop offset="0.179688" stopColor="rgb(24.043274%, 70.606995%, 33.734131%)" stop-opacity="1" />
                    <stop offset="0.1875" stopColor="rgb(24.07074%, 70.495605%, 33.605957%)" stop-opacity="1" />
                    <stop offset="0.191406" stopColor="rgb(23.89679%, 70.362854%, 33.508301%)" stop-opacity="1" />
                    <stop offset="0.195312" stopColor="rgb(23.707581%, 70.288086%, 33.529663%)" stop-opacity="1" />
                    <stop offset="0.203125" stopColor="rgb(23.730469%, 70.198059%, 33.51593%)" stop-opacity="1" />
                    <stop offset="0.210938" stopColor="rgb(23.777771%, 70.016479%, 33.375549%)" stop-opacity="1" />
                    <stop offset="0.21875" stopColor="rgb(23.81134%, 69.88678%, 33.21991%)" stop-opacity="1" />
                    <stop offset="0.226562" stopColor="rgb(23.745728%, 69.734192%, 33.203125%)" stop-opacity="1" />
                    <stop offset="0.234375" stopColor="rgb(23.577881%, 69.584656%, 33.125305%)" stop-opacity="1" />
                    <stop offset="0.238281" stopColor="rgb(23.509216%, 69.447327%, 32.998657%)" stop-opacity="1" />
                    <stop offset="0.242187" stopColor="rgb(23.538208%, 69.338989%, 32.96051%)" stop-opacity="1" />
                    <stop offset="0.25" stopColor="rgb(23.538208%, 69.338989%, 32.96051%)" stop-opacity="1" />
                    <stop offset="0.257812" stopColor="rgb(23.397827%, 69.203186%, 32.987976%)" stop-opacity="1" />
                    <stop offset="0.261719" stopColor="rgb(23.239136%, 69.018555%, 32.885742%)" stop-opacity="1" />
                    <stop offset="0.265625" stopColor="rgb(23.219299%, 68.968201%, 32.751465%)" stop-opacity="1" />
                    <stop offset="0.273438" stopColor="rgb(23.243713%, 68.884277%, 32.739258%)" stop-opacity="1" />
                    <stop offset="0.28125" stopColor="rgb(23.291016%, 68.70575%, 32.711792%)" stop-opacity="1" />
                    <stop offset="0.289062" stopColor="rgb(23.272705%, 68.566895%, 32.693481%)" stop-opacity="1" />
                    <stop offset="0.296875" stopColor="rgb(23.060608%, 68.319702%, 32.598877%)" stop-opacity="1" />
                    <stop offset="0.3125" stopColor="rgb(22.909546%, 68.048096%, 32.437134%)" stop-opacity="1" />
                    <stop offset="0.320312" stopColor="rgb(22.950745%, 67.889404%, 32.278442%)" stop-opacity="1" />
                    <stop offset="0.328125" stopColor="rgb(22.973633%, 67.802429%, 32.133484%)" stop-opacity="1" />
                    <stop offset="0.332031" stopColor="rgb(22.9599%, 67.683411%, 32.069397%)" stop-opacity="1" />
                    <stop offset="0.335937" stopColor="rgb(22.944641%, 67.565918%, 32.066345%)" stop-opacity="1" />
                    <stop offset="0.34375" stopColor="rgb(22.796631%, 67.523193%, 32.028198%)" stop-opacity="1" />
                    <stop offset="0.351562" stopColor="rgb(22.676086%, 67.382812%, 31.921387%)" stop-opacity="1" />
                    <stop offset="0.359375" stopColor="rgb(22.712708%, 67.251587%, 31.843567%)" stop-opacity="1" />
                    <stop offset="0.367187" stopColor="rgb(22.744751%, 67.134094%, 31.750488%)" stop-opacity="1" />
                    <stop offset="0.375" stopColor="rgb(22.793579%, 66.955566%, 31.593323%)" stop-opacity="1" />
                    <stop offset="0.382812" stopColor="rgb(22.775269%, 66.835022%, 31.533813%)" stop-opacity="1" />
                    <stop offset="0.390625" stopColor="rgb(22.58606%, 66.775513%, 31.582642%)" stop-opacity="1" />
                    <stop offset="0.398437" stopColor="rgb(22.471619%, 66.635132%, 31.484985%)" stop-opacity="1" />
                    <stop offset="0.40625" stopColor="rgb(22.50824%, 66.499329%, 31.333923%)" stop-opacity="1" />
                    <stop offset="0.421875" stopColor="rgb(22.361755%, 66.334534%, 31.231689%)" stop-opacity="1" />
                    <stop offset="0.425781" stopColor="rgb(22.212219%, 66.067505%, 31.109619%)" stop-opacity="1" />
                    <stop offset="0.429688" stopColor="rgb(22.219849%, 65.92865%, 31.072998%)" stop-opacity="1" />
                    <stop offset="0.4375" stopColor="rgb(22.209167%, 65.78064%, 31.021118%)" stop-opacity="1" />
                    <stop offset="0.445312" stopColor="rgb(22.210693%, 65.589905%, 30.839539%)" stop-opacity="1" />
                    <stop offset="0.453125" stopColor="rgb(22.167969%, 65.530396%, 30.718994%)" stop-opacity="1" />
                    <stop offset="0.460937" stopColor="rgb(21.99707%, 65.415955%, 30.752563%)" stop-opacity="1" />
                    <stop offset="0.46875" stopColor="rgb(21.893311%, 65.272522%, 30.648804%)" stop-opacity="1" />
                    <stop offset="0.476562" stopColor="rgb(21.913147%, 65.19928%, 30.509949%)" stop-opacity="1" />
                    <stop offset="0.484375" stopColor="rgb(21.943665%, 65.097046%, 30.490112%)" stop-opacity="1" />
                    <stop offset="0.492187" stopColor="rgb(21.780396%, 64.976501%, 30.528259%)" stop-opacity="1" />
                    <stop offset="0.496094" stopColor="rgb(21.621704%, 64.820862%, 30.435181%)" stop-opacity="1" />
                    <stop offset="0.5" stopColor="rgb(21.647644%, 64.710999%, 30.293274%)" stop-opacity="1" />
                    <stop offset="0.507812" stopColor="rgb(21.641541%, 64.572144%, 30.245972%)" stop-opacity="1" />
                    <stop offset="0.515625" stopColor="rgb(21.632385%, 64.355469%, 30.174255%)" stop-opacity="1" />
                    <stop offset="0.523438" stopColor="rgb(21.640015%, 64.24408%, 30.102539%)" stop-opacity="1" />
                    <stop offset="0.53125" stopColor="rgb(21.670532%, 64.138794%, 29.960632%)" stop-opacity="1" />
                    <stop offset="0.535156" stopColor="rgb(21.504211%, 64.01825%, 29.914856%)" stop-opacity="1" />
                    <stop offset="0.539062" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                    <stop offset="0.546875" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                    <stop offset="0.5625" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                    <stop offset="0.625" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                    <stop offset="0.75" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                    <stop offset="1" stopColor="rgb(21.316528%, 63.969421%, 29.963684%)" stop-opacity="1" />
                </linearGradient>
            </defs>

            <g clipPath="url(#clip-0)">
                <path fillRule="nonzero" fill="rgb(80.08728%, 61.309814%, 83.11615%)" fillOpacity="1" d="M 453.460938 684.570312 L 453.425781 684.488281 L 453.460938 684.570312 " />
                <path fillRule="nonzero" fill="rgb(71.510315%, 61.524963%, 83.566284%)" fillOpacity="1" d="M 453.460938 684.570312 L 453.425781 684.488281 L 453.460938 684.570312 " />
            </g>
            <path fillRule="nonzero" fill="rgb(97.257996%, 71.791077%, 10.601807%)" fillOpacity="1" d="M 1000 1000 L 1273.300781 1157.78125 L 1000 1631.140625 C 1348.570312 1631.140625 1631.140625 1348.570312 1631.140625 1000 C 1631.140625 885.011719 1600.230469 777.289062 1546.5 684.429688 L 999.996094 684.429688 L 1000 1000 " />
            <g clipPath="url(#clip-1)">
                <g clipPath="url(#clip-2)">
                    <g clipPath="url(#clip-3)">
                        <path fillRule="nonzero" fill="url(#linear-pattern-0)" d="M 453.464844 1157.789062 L 453.464844 368.859375 L 1546.5 368.859375 L 1546.5 1157.789062 Z M 453.464844 1157.789062 " />
                    </g>
                </g>
            </g>
            <g clipPath="url(#clip-4)">
                <g clipPath="url(#clip-5)">
                    <g clipPath="url(#clip-6)">
                        <path fillRule="nonzero" fill="url(#linear-pattern-1)" d="M -41.042969 921.15625 L 1047.191406 292.867188 L 1683.207031 1394.484375 L 594.96875 2022.773438 Z M -41.042969 921.15625 " />
                    </g>
                </g>
            </g>
            <path fillRule="nonzero" fill="rgb(100%, 100%, 100%)" fillOpacity="1" d="M 1315.578125 1000 C 1315.578125 1174.28125 1174.289062 1315.570312 1000 1315.570312 C 825.71875 1315.570312 684.429688 1174.28125 684.429688 1000 C 684.429688 825.71875 825.71875 684.429688 1000 684.429688 C 1174.289062 684.429688 1315.578125 825.71875 1315.578125 1000 " />
            <path fillRule="nonzero" fill="rgb(25.186157%, 41.859436%, 73.982239%)" fillOpacity="1" d="M 1256.410156 1000 C 1256.410156 1141.609375 1141.609375 1256.398438 1000 1256.398438 C 858.394531 1256.398438 743.597656 1141.609375 743.597656 1000 C 743.597656 858.390625 858.394531 743.601562 1000 743.601562 C 1141.609375 743.601562 1256.410156 858.390625 1256.410156 1000 " />
        </svg>
    </>);
}
