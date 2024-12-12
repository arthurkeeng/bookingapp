'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import {revalidatePath} from 'next/cache'



async function deleteRoom(roomId) {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value
    );

    // Get user's ID
    const user = await account.get();
    const userId = user.$id;

    // Fetch users rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_ROOMS_COLLECTION,
      [Query.equal('user_id', userId)]
    );
    //  find room to delete
    const roomsToDelete = rooms.find(room=> room.$id === roomId)
    if(roomsToDelete) {
        databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_ROOMS_COLLECTION,
             roomsToDelete.$id

        )
        // revalidate all rooms
        revalidatePath("/rooms/my" , 'layout')
        revalidatePath('/' , 'layout')
        return {
            success : true
        };
    }
    else{
        return {
            error : "Room not found"
        }
    }
} catch (error) {
    console.log('Failed to get user rooms', error);
    return {
        error : "Room not found"
    }
  }
}

export default deleteRoom;