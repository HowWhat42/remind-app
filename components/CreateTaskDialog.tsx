"use client";
import { Collection } from '@prisma/client';
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { createTaskSchema, createTaskSchemaType } from '@/schema/createTask';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { createTask } from '@/actions/task';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  collection: Collection;
}

const CreateTaskDialog = ({ open, setOpen, collection }: Props) => {
  const form = useForm<createTaskSchemaType>({
    defaultValues: {
      collectionId: collection.id
    },
    resolver: zodResolver(createTaskSchema)
  })
  const router = useRouter()

  const openChangeWrapper = (value: boolean) => {
    form.reset()
    setOpen(value)
  }

  const onSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data)
      toast({
        title: 'Success',
        description: 'Task created successfully'
      })
      openChangeWrapper(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex gap-2'>Add task to collection: <span className={cn('p-[1px] bg-clip-text text-transparent', CollectionColors[collection.color as CollectionColor])}>{collection.name}</span></DialogTitle>
          <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className='space-y-4 flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder='Task content here' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>
                    <FormDescription>When does this task expires ?</FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn(
                            'justify-start text-left font-normal w-full',
                            !field.value && "text-muted-foreground"
                            )}>
                            <CalendarIcon className='h-4 w-4' />
                            {field.value && format(field.value, 'PPP')}
                            {!field.value && <span>No expiration</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button 
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className={cn('w-full dark:text-white', CollectionColors[collection.color as CollectionColor])}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTaskDialog