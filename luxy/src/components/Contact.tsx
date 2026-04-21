interface Props {
  handleBooking: () => void;
  name: string;
  setName: (value: string) => void;
}

const Contact = ({ handleBooking, name, setName }: Props) => {
  return (
    <div>
      <section className="text-white grid row-auto gap-7 place-items-center">
        <div>
          <h2 className="text-white-500 text-2xl text-center text-shadow-amber-100/20 text-shadow-lg">
            Book your ride below
          </h2>
        </div>
        <div className="grid place-items-center">
          <div>
            <input
              className="text-center bg-gray-600/20 py-4 px-5 w-full md:max-w-300 md:w-90 rounded"
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              required
              spellCheck="false"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <button
            className="w-60  bg-white/80 border border-slate-400/30 rounded-2xl uppercase font-black text-black h-15 text-xl tracking-widest hover:brightness-110 hover:scale-[1.1] active:scale-[0.98] transition-all shadow-lg shadow-black "
            onClick={handleBooking}
          >
            Book with SMS
          </button>
        </div>
        <div className="px-10 text-center">
          <p className="text-white/30">
            This opens your messaging app with your estimate ready to send. Send
            the text to confirm your availability and booking.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
