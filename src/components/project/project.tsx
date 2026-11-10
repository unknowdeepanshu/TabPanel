import { IconFolderFilled } from '@tabler/icons-react';
import { Button } from '../ui/button';

function Project() {
    return (<>
        <div className='flex w-auto flex-col'>
            <div className='w-auto flex items-center justify-between'>
                <IconFolderFilled color="#18181b" width="5rem" height="5rem" />
                <Button variant="ghost" >Add projects</Button>
            </div>
            <div className='flex'>

                <ProjectCard />
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
            <div className=' border-2 w-fit rounded-2xl  hover:border-orange-100  flex'>
                <IconFolderFilled color="#18181b" width="5rem" height="5rem" />
                <div className='flex p-3 flex-col justify-center'>
                    <h1 >Tab managemts</h1>
                    <h1>12 tabs</h1>
                </div>
            </div>
        </>
    )
}
export default Project;