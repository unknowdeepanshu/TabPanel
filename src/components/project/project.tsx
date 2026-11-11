import { IconFolderFilled } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

function Project() {
    return (<>
        <div className='flex w-auto flex-col mt-3'>
            <div className='w-auto flex items-center justify-between'>
                <IconFolderFilled color="#f97316" width="5rem" height="5rem" />
                <Button variant="ghost" >Add projects</Button>
            </div>
            <Separator className="bg-black-200/35" />
            <div className='flex mt-3 gap-4 shrink-0 overflow-auto '>
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </div>

    </>);
}

function ProjectCard() {
    return (
        <>
            <div className=' border-2 w-fit rounded-2xl  hover:bg-black-200/10  flex'>
                <IconFolderFilled color="#f97316" width="5rem" height="5rem" />
                <div className='flex p-3 flex-col justify-center'>
                    <h1 >Tab managemts</h1>
                    <h1>12 tabs</h1>
                </div>
            </div>
        </>
    )
}
export default Project;