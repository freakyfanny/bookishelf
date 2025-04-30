import Link from "next/link";

const SkipLink: React.FC = () => {
    return (
        <Link className="focus:transform-none absolute left-0 top-0 bg-white z-30 p-5 text-xl transform -translate-x-full focus:translate-x-0 text-black" href="#maincontent">Skip to main content</Link>
    );
};

export default SkipLink;