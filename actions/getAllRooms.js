'use server'

import {createAdminClient} from '@/config/appwrite'
import {redirect} from 'next/navigation'

async function getAllRooms(){
    try {
        const {databases} = await createAdminClient()
        const {documents : rooms} = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE, 
            process.env.NEXT_PUBLIC_APPWRITE_ROOMS_COLLECTION
        )

        // revalidate the cache for this path
        // revalidatePath("/" , 'layout')
        return rooms;
    } catch (error) {
        console.log("failed to get rooms" , error);
        redirect("/error")
    }
}

export default getAllRooms