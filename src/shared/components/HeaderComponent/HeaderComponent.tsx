interface HeaderComponentProps {
  title: string;
  subTitle: string;
}

const HeaderComponent = ({ title, subTitle }: HeaderComponentProps) => {
  return (
    <>
      {/* Heading */}
      <h1 className="font-syne text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1.5">
        {title}
      </h1>
      <p className="font-dm-sans text-sm text-[#e6bcbd] mb-7 font-light">
        {subTitle}
      </p>
    </>
  );
};

export default HeaderComponent;
