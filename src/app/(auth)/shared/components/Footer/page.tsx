import Link from "next/link";

const FooterComponent = ({
  title,
  titleLink,
}: {
  title: string;
  titleLink: string;
}) => {
  return (
    <>
      {/* Footer */}
      <p className="text-sm text-[#3a3a52] text-center font-dm-sans">
        {title}{" "}
        <Link
          href="/cadastro"
          className="text-[#7c5cfc] font-medium no-underline"
        >
          {titleLink}
        </Link>
      </p>
    </>
  );
};

export default FooterComponent;
