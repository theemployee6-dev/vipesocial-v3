import Image from "next/image";

const LogoComponent = () => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-6 sm:mb-7 md:mb-8">
        <Image
          src={"/assets/img/logo/logo_novo_roxo.png"}
          width={200}
          height={23}
          alt="logo-site"
        />
      </div>
    </>
  );
};

export default LogoComponent;
