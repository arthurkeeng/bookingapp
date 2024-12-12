import Heading from '@/components/Heading';
import BookedRoomCard from '@/components/BookedRoomCard';
import getMyBookings from '@/actions/getMyBookings';

const Bookings = async () => {
  const bookings = await getMyBookings();

return  <>
  <Heading title='My Bookings' />
  {bookings.length > 0 ? (
   <>
   {
    bookings.map((booking) => <BookedRoomCard  key={booking.$id} booking={booking} />)
   }</>
  ) : (
    <p className='text-gray-600 mt-4'>You have no bookings</p>
  )}
</>
}


export default Bookings


