"use server";
import { prisma } from "@/lib/prisma";
import { createCollectionSchemaType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs";

export const createCollection = async (form: createCollectionSchemaType) => {
  const user = await currentUser();

  if(!user) {
    throw new Error("You must be logged in to create a collection")
  }

  return await prisma.collection.create({
    data: {
      userId: user.id,
      name: form.name,
      color: form.color
    }
  })
}

export const deleteCollection = async (id: number) => {
  const user = await currentUser();

  if(!user) {
    throw new Error("You must be logged in to delete a collection")
  }

  return await prisma.collection.delete({
    where: {
      userId: user.id,
      id: id
    }
  })
}