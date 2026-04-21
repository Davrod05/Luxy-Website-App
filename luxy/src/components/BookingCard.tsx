import { Autocomplete } from "@react-google-maps/api";
import { useState } from "react";

interface Props {
  pickup: string;
  setPickup: (value: string) => void;

  destination: string;
  setDestination: (value: string) => void;

  date: string;
  setDate: (value: string) => void;

  distanceMeters: number;
  setDistanceMeters: (value: number) => void;

  duration: string;
  setDuration: (value: string) => void;

  price: number;
  setPrice: (value: number) => void;

  autoScroll: () => void;
}

const BookingCard = ({
  pickup,
  setPickup,
  destination,
  setDestination,
  date,
  setDate,
  setDistanceMeters,
  setDuration,
  setPrice,
  autoScroll,
}: Props) => {
  const [pickAutocomplete, setPickAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [destAutocomplete, setDestAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (pickAutocomplete != null) {
      const place = pickAutocomplete.getPlace();
      const address = place.formatted_address;
      setPickup(address ?? "");
    }
    if (destAutocomplete != null) {
      const place = destAutocomplete.getPlace();
      const address = place.formatted_address;
      setDestination(address ?? "");
    }
  };

  const calculateResult = async () => {
    const url = "https://routes.googleapis.com/directions/v2:computeRoutes";
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const requestBody = {
      origin: { address: pickup },
      destination: { address: destination },
      travelMode: "DRIVE",
      extraComputations: ["TOLLS"],
      routeModifiers: {
        vehicleInfo: { emissionType: "GASOLINE" },
        tollPasses: ["US_NJ_EZPASSNJ", "US_NY_EZPASSNY"],
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.travelAdvisory.tollInfo",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      const route = data.routes[0];
      const distanceMeters = route.distanceMeters;

      const tollData = route.travelAdvisory?.tollInfo?.estimatedPrice?.[0];
      const tollBase = tollData?.units || 0;
      const tollNanos = tollData?.nanos || 0;

      const totalTolls = Number(tollBase) + tollNanos / 1000000000;

      const duration = route.duration;

      setDistanceMeters(distanceMeters);
      setDuration(duration);

      processPricing(distanceMeters, totalTolls);

      autoScroll();
    } catch (error) {
      alert("Please select valid locations from the dropdown menu.");
    }
  };

  const processPricing = (distanceMeters: number, totalTolls: number) => {
    let price = 10 + (distanceMeters / 1609) * 3 + totalTolls;
    if (price < 15) {
      price = 15;
    }
    setPrice(price);
  };

  return (
    <>
      <div className="backdrop-blur-md border border-white/70 rounded-2xl p-8 shadow-2xl min-h-100 flex flex-col justify-evenly gap-4 max-w-300 md:min-w-200 min-w-90">
        {/*TOP ROW: Location*/}
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 gap-1 md:gap-9">
          {/*Group 1: Pickup*/}
          <div className="flex flex-col space-y-3">
            <label className="text-white text-xs uppercase tracking-widest font-bold ml-1">
              Pickup Location
            </label>
            <Autocomplete
              onPlaceChanged={onPlaceChanged}
              onLoad={(instance) => setPickAutocomplete(instance)}
            >
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                type="text"
                placeholder="Where from?"
                className="bg-black/30 border border-white/30 p-4 rounded-xl text-white outline-none focus:border-white transition-all placeholder:text-white/30 w-full"
              />
            </Autocomplete>
          </div>
          {/*Group 2: Destination*/}
          <div className="flex flex-col space-y-3">
            <label className="text-white text-xs uppercase tracking-widest font-bold ml-1">
              Destination
            </label>
            <Autocomplete
              onPlaceChanged={onPlaceChanged}
              onLoad={(instance) => setDestAutocomplete(instance)}
            >
              <input
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
                type="text"
                placeholder="Where to?"
                className="bg-black/30 border border-white/30 p-4 rounded-xl text-white outline-none focus:border-white transition-all placeholder:text-white/30 w-full"
              />
            </Autocomplete>
          </div>
        </div>
        {/*BOTTOM ROW: Date & Action*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9 items-end">
          {/*Group 3: Date*/}
          <div className="flex flex-col space-y-3 items-center">
            <label className="text-white text-xs uppercase tracking-widest font-bold ml-1">
              Departure Date
            </label>
            <input
              value={date}
              type="date"
              onChange={(e) => {
                setDate(e.target.value);
                e.target.classList.toggle("has-value", !!e.target.value);
              }}
              className="bg-black/30 border border-white/30 p-4 rounded-xl outline-none w-74 md:w-full focus:border-white transition-all scheme-dark text-white/30 [&.has-value]:text-white [&::-webkit-calendar-picker-indicator]:opacity-30"
            />
          </div>
          {/* The Button */}
          <button
            className="bg-gray-300 text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-white-300/10 hover:scale-105"
            onClick={() => {
              if (!pickup || !destination || !date) {
                alert("Please select both locations and a date");
                return;
              } else {
                calculateResult();
              }
            }}
          >
            Get Estimate
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingCard;
