import clsx from "clsx";
import Image from "next/image"; // ou clsx, se preferir

interface LogoComponentProps {
  className?: string; // para controlar o tamanho do container externamente
  priority?: boolean; // opcional, para controlar prioridade de carregamento
}

const LogoComponent = ({ className, priority = false }: LogoComponentProps) => {
  return (
    <div
      className={clsx(
        "flex items-center w-full max-w-[200] sm:max-w-[180] md:max-w-[200] lg:max-w-[240]",
        className,
      )}
    >
      <Image
        src="/assets/img/logo/logo_novo_roxo.png"
        alt="VipeSocial Logo"
        width={250}
        height={28}
        sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 250px"
        className="w-full h-auto"
        priority={priority}
      />
    </div>
  );
};

export default LogoComponent;
