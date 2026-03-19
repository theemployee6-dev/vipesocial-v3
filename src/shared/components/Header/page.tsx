interface HeaderComponentProps {
  title: string;
  subTitle: string;
}

const HeaderComponent = ({ title, subTitle }: HeaderComponentProps) => {
  return (
    <>
      {/* Heading */}
      <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#e8e8f8] tracking-tight mb-1.5">
        {title}
      </h1>
      <p className="font-dm-sans text-sm text-[#3a3a55] mb-7 font-light">
        {subTitle}
      </p>
    </>
  );
};

export default HeaderComponent;
