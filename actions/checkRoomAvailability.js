'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { DateTime , Duration } from 'luxon'

// convert a date string to luxon datetime object 
function toUtcDateTime(dateString) {
    return DateTime.fromISO(dateString , {
        zone : "utc"
    }).toUTC()
}
// this is the function that checks for overlapping date ranges
function checkOverlap(checkInA , checkOutA , checkInB, checkOutB){
    return checkInA < checkOutB && checkOutA > checkInB
}
async function checkRoomAvailability(roomId , checkIn , checkOut) {
    // const thirtyMinutes = Duration.fromObject({ minutes: 30 });

  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  const checkInDateTime = toUtcDateTime(checkIn)
  const checkOutDateTime = toUtcDateTime(checkOut)

  
  try {
    const { databases } = await createSessionClient(
      sessionCookie.value
    );
    // fetch all bookings for a given room
    const { documents: bookings } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION,
        [Query.equal('room_id', roomId)]
      );
    //   loop through bookings and check overlap
    for (const booking of bookings){
        const bookingCheckInDateTime = toUtcDateTime(booking.check_in)
        const bookingCheckOutDateTime = toUtcDateTime(booking.check_out)

        if(checkOverlap(
            checkInDateTime, checkOutDateTime , 
            bookingCheckInDateTime , bookingCheckOutDateTime
        )){
            return false //overlap found so don't book
        }
    }
    // Didnt find overlap
    return true
  } catch (error) {
    console.log('Failed to check availability', error);
    return {
        error : 'Failed to check availability'
    }
  }
}

export default checkRoomAvailability;