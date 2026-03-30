import Link from "next/link";

const FooterComponent = ({
  title,
  titleLink,
  href,
}: {
  title: string;
  titleLink: string;
  href: string;
}) => {
  return (
    <div className="mt-6 text-center">
      {/* Footer */}
      <p className="text-sm text-[#e6bcbd] text-center font-dm-sans">
        {title}{" "}
        <Link href={href} className="text-[#fe2c55] font-medium no-underline">
          {titleLink}
        </Link>
      </p>
    </div>
  );
};

export default FooterComponent;
