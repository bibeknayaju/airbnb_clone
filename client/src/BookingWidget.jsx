import { useState, useEffect, useContext } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberofGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      phone,
      name,
      numberofGuests,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      {" "}
      <div className="bg-white shadow-md p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: ${place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="border py-4 px-4 ">
              <label>Check in:</label>
              <input
                value={checkIn}
                onChange={(en) => setCheckIn(en.target.value)}
                type="date"
              />
            </div>

            <div className="border py-4 px-4 border-l ">
              <label>Check out:</label>
              <input
                value={checkOut}
                onChange={(en) => setCheckOut(en.target.value)}
                type="date"
              />
            </div>
          </div>
        </div>
        <div className="border py-4 px-4 border-t ">
          <label>Number of guests</label>
          <input
            type="number"
            value={numberofGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        <div>
          {numberOfNights > 0 && (
            <div className="border py-4 px-4 border-t ">
              <label>Your full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />

              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="+977 9800000000"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          )}
        </div>

        <button onClick={bookThisPlace} className="primary mt-4">
          Book this now{" "}
          {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
        </button>
      </div>
    </>
  );
}
