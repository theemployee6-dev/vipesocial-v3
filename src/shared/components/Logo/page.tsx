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
        "max-w-[clamp(120px,20vw,280px)]", // valor padrão
        className, // permite sobrescrever
      )}
    >
      <Image
        src="/assets/img/logo/logo_novo_roxo.png"
        alt="VipeSocial Logo"
        width={250}
        height={28}
        sizes="20vw"
        className="w-full h-auto"
        priority={priority}
      />
    </div>
  );
};

export default LogoComponent;
