import { useState, useEffect } from "react";
import PhotoUploader from "../PhotoUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlaces(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // update place
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlaces}>
          {preInput(
            "Title",
            " Title for your place, should be nice and chachy"
          )}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of the new place"
          />

          {preInput("Address", "Address for this place, should be nice")}

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter the address of the new place"
          />

          {preInput("Photos", "Better=best")}

          <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          {preInput("Description", "Description of the the place")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {preInput(
            "Perks",
            "Select all the perks you need for the your place"
          )}

          <div className="grid mt-2 grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>

          {preInput(
            "Extra Info",
            "More extra information about the rules of the house etc."
          )}
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />

          {preInput(
            "Check in and out time, Max Guest",
            " add check in and out time, remeber to have some time window for cleaning the room between guest"
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                type="text"
                placeholder="14:00"
              />
            </div>

            <div>
              <h3>Check out time</h3>
              <input
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                type="text"
                placeholder="14:00"
              />
            </div>

            <div>
              <h3>Max number of guest</h3>
              <input
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                type="number"
              />
            </div>

            <div>
              <h3>Price Per night</h3>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div>
          </div>
          <button className="primary my-4">Save</button>
        </form>
      </div>
    </>
  );
}
