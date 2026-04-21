interface Props {
  distanceMeters: number;
  duration: string;
  price: number;
}

const Results = ({ distanceMeters, duration, price }: Props) => {
  return (
    <section className="flex flex-col py-7 gap-4 text-white items-center">
      <div>
        <h2 className="text-white text-2xl">Trip Overview</h2>
      </div>
      <div className="grid grid-cols-3 md:gap-4 gap-2 px-5">
        <div className="flex flex-col text-center justify-between gap-y-5 bg-black border border-white/30 rounded-2xl md:p-10 p-3 active:border-white transition-all shadow-xl ">
          <p className="text-white/80 uppercase tracking-[0.2em] font-bold text-xs">
            Total Distance
          </p>
          <p className="md:text-3xl text-2xl font-black text-white ">
            {(distanceMeters * 0.000621371192).toFixed(2)} miles
          </p>
        </div>
        <div className="flex flex-col text-center justify-between gap-y-5 bg-black border border-white/30 rounded-2xl md:p-10 p-3 active:border-white transition-all shadow-xl">
          <p className="text-white/80 uppercase tracking-[0.2em] font-bold text-xs">
            Est. Travel Time
          </p>
          <p className="md:text-3xl text-2xl font-black text-white">
            {Math.round(parseInt(duration.replace("s", "")) / 60)} mins
          </p>
        </div>
        <div className="flex flex-col text-center justify-between gap-y-5 bg-black border border-white/30 rounded-2xl md:p-10 p-3 active:border-white transition-all shadow-xl">
          <p className="text-white/80 uppercase tracking-[0.2em] font-bold ">
            Est. Price
          </p>
          <p className="md:text-3xl text-2xl font-black text-white">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Results;
