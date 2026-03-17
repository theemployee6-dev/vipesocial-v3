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
    <>
      {/* Footer */}
      <p className="text-sm text-[#3a3a52] text-center font-dm-sans">
        {title}{" "}
        <Link href={href} className="text-[#7c5cfc] font-medium no-underline">
          {titleLink}
        </Link>
      </p>
    </>
  );
};

export default FooterComponent;
