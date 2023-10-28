"use server";

import { prisma } from "@/lib/prisma";
import { createTaskSchemaType } from "@/schema/createTask";
import { currentUser } from "@clerk/nextjs";

export const createTask = async (form: createTaskSchemaType) => {
  const user = await currentUser()

  if(!user) {
    throw new Error("You must be logged in to create a collection")
  }

  return await prisma.task.create({
    data: {
      userId: user.id,
      content: form.content,
      expiresAt: form.expiresAt,
      collection: {
        connect: {
          id: form.collectionId
        }
      }
    }
  })
}

export const setTaskDone = async (id: number) => {
  const user = await currentUser()

  if(!user) {
    throw new Error("You must be logged in to create a collection")
  }

  return await prisma.task.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      done: true
    }
  })
}