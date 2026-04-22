import { useState } from "react";
import Header from "./components/Header";
import BookingCard from "./components/BookingCard";
import Results from "./components/Results";
import Contact from "./components/Contact";
import { useRef } from "react";
import { LoadScript } from "@react-google-maps/api";
const LIBRARIES: "places"[] = ["places"];

const App = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [distanceMeters, setDistanceMeters] = useState(0);
  const [duration, setDuration] = useState("0");
  const [price, setPrice] = useState(0);

  const [name, setName] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  const autoScroll = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBooking = () => {
    if (!price || !name) {
      alert(
        "Please estimate trip details and provide your name before booking.",
      );
      return;
    }

    const formatTo12Hour = (time24: string) => {
      if (!time24) return "";
      const [hourString, minuteString] = time24.split(":");
      const hour = parseInt(hourString);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minuteString} ${ampm}`;
    };

    const phoneNumber = "(732)801-3341";
    const message = `Luxy Transportation ride request:
\nProvided Name: ${name}
  
\nPickup: ${pickup}
Destination: ${destination}
  
\nDate: ${date}
Time: ${formatTo12Hour(time)}

\nDistance: ${(distanceMeters * 0.000621371192).toFixed(2) + " Miles"}
Time: ${Math.round(parseInt(duration.replace("s", "")) / 60) + " Minutes"}
Est. Price: ${"$" + price.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `sms:${phoneNumber}?body=${encodedMessage}`;
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <div className="min-h-screen bg-black/95 flex flex-col items-center justify-start">
        <Header></Header>

        <section className="bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(/src/media/mapbg.jpeg)] bg-no-repeat bg-center bg-cover w-full text-center pb-10">
          <h2 className="py-4 text-white font-bold text-xl uppercase text-shadow-sm text-shadow-black">
            Set trip details
          </h2>
          <div className="px-10 flex justify-center">
            <BookingCard
              pickup={pickup}
              setPickup={setPickup}
              destination={destination}
              setDestination={setDestination}
              date={date}
              setDate={setDate}
              distanceMeters={distanceMeters}
              setDistanceMeters={setDistanceMeters}
              duration={duration}
              setDuration={setDuration}
              price={price}
              setPrice={setPrice}
              time={time}
              setTime={setTime}
              autoScroll={autoScroll}
            ></BookingCard>
          </div>
          <div ref={resultRef}></div>
        </section>
        <section>
          <Results
            distanceMeters={distanceMeters}
            duration={duration}
            price={price}
          ></Results>
        </section>
        <section>
          <div className="w-full py-10">
            <img
              src="/src/media/2026-suburban-ck10906-3lz-g6m-trimselector.avif"
              alt="car_img"
              className="h-40"
            />
          </div>
        </section>
        <section className="py-6">
          <Contact
            handleBooking={handleBooking}
            name={name}
            setName={setName}
          ></Contact>
        </section>
      </div>
    </LoadScript>
  );
};

export default App;
