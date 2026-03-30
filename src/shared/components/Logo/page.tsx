import clsx from "clsx";
import Image from "next/image";

interface LogoComponentProps {
  className?: string;
  priority?: boolean;
}

const LogoComponent = ({ className, priority = false }: LogoComponentProps) => {
  return (
    <div
      className={clsx(
        "flex items-center w-full",
        "max-w-[clamp(150px,12vw,240px)]", // valor padrão
        className,
      )}
    >
      <Image
        src="/assets/img/logo/logo_transparent.png"
        alt="VipeSocial Logo"
        loading="eager"
        width={200}
        height={28}
        sizes="20vw"
        className="w-full h-auto"
        priority={priority}
      />
    </div>
  );
};

export default LogoComponent;
