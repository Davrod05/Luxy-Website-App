interface Props {}

const Header = ({}: Props) => {
  return (
    <div className="bg-black w-full py-4 text-center shadow-lg z-50 top-0 sticky">
      <h1 className="text-white font-medium text-2xl uppercase">
        Luxy Transportation LLC
      </h1>
      <p className="text-white font-light py-0.5">Personal Limousine Service</p>
    </div>
  );
};
export default Header;
