'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from '@/actions/checkAuth'
import { revalidatePath } from 'next/cache';
import checkRoomAvailability from '@/actions/checkRoomAvailability'

async function getMyRooms(previousState , formData) {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(
      sessionCookie.value
    );

    // Get user's ID
    const {user} = await checkAuth();
    if(!user) return {error : "You must be logged in to book room"}
    // extract data and time from the form data
    const checkInDate = formData.get("check_in_date")
    const checkInTime = formData.get("check_in_time")
    const checkOutDate = formData.get("check_out_date")
    const checkOutTime = formData.get("check_out_time")
    const roomId = formData.get("room_id")
    // combine date and time to iso 8601 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`

   const isAvailable = await checkRoomAvailability(roomId , checkInDateTime, checkOutDateTime)
   if(!isAvailable){
    return {
      error : "This room is already booked for the selected time"
    }
   }
    const bookingData = {
        check_in : checkInDateTime,
        check_out : checkOutDateTime,
        user_id : user.id, 
        room_id : roomId
    }
    const newBooking = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION,
      ID.unique(),
      bookingData
    )
    revalidatePath('/bookings' , 'layout')

    return {
        success : true
    };
  } catch (error) {
    console.log('Failed to book room', error);
    return {
        error : "Something went wrong booking the room"
    }
}
}

export default getMyRooms;