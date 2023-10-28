import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import CreateCollectionBtn from './CreateCollectionBtn'
import CollectionCard from './CollectionCard'

const CollectionList = async () => {
  const user = await currentUser()
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true
    },
    where: {
      userId: user?.id
    }
  })

  if(collections.length === 0) {
    return (
      <div className='flex flex-col gap-5'>
        <Alert>
          <AlertTitle>There are no collection yet !</AlertTitle>
          <AlertDescription>Create a collection to get started</AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    )
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className='flex flex-col gap-4 mt-6'>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  )
}

export default CollectionList