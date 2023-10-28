"use client";
import { Collection, Task } from '@prisma/client'
import { useMemo, useState, useTransition } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { CaretDownIcon, CaretUpIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { deleteCollection } from '@/actions/collection';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import CreateTaskDialog from './CreateTaskDialog';
import TaskCard from './TaskCard';

type Props = {
  collection: Collection & {
    tasks: Task[]
  }
}

const CollectionCard = ({collection}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [isLoading, startTransition] = useTransition()

  const tasks = collection.tasks

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: 'Success',
        description: 'Collection deleted successfully'
      });
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length
  }, [collection.tasks])

  const totalTasks = collection.tasks.length;

  const progress = collection.tasks.length === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <>
      <CreateTaskDialog open={showCreateModal} setOpen={setShowCreateModal} collection={collection} />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "w-full flex justify-between p-6", 
              CollectionColors[collection.color as CollectionColor],
              isOpen && "rounded-b-none"
            )}
          >
            <span className='text-white font-bold'>{collection.name}</span>
            {!isOpen && <CaretDownIcon className='h-6 w-6' />}
            {isOpen && <CaretUpIcon className='h-6 w-6' />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg'>
          {tasks.length === 0 && <Button variant={"ghost"} className='flex items-center justify-center gap-1 p-8 py-12 rounded-none' onClick={() => setShowCreateModal(true)}>
              <p className='text-sm text-neutral-900 dark:text-white'>There are no tasks yet: <span className={cn('bg-clip-text text-transparent', CollectionColors[collection.color as CollectionColor])}>Create one</span></p>
            </Button>}
          {tasks.length > 0 && (
            <>
              <Progress className='rounded-none' value={progress} />
              <div className='p-4 gap-3 flex flex-col'>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className='h-10 px-4 p-0.5 text-xs text-neutral-500 flex justify-between items-center'>
            <p>Created at {collection.createdAt.toLocaleDateString("fr-FR")}</p>
            {isLoading && <div>Deleting...</div>}
            {!isLoading && (
              <div>
                <Button variant={"ghost"} onClick={() => setShowCreateModal(true)}>
                  <PlusIcon className='h-4 w-4' />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"ghost"}>
                      <TrashIcon className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>This actions cannot be undone, this will permanently delete your collection and all tasks inside it.</AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        startTransition(removeCollection)
                      }}>Proceed</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default CollectionCard