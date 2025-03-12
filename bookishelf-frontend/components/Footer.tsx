'use client';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-800 text-white py-10 mt-auto">
            <div className="container mx-auto text-center">
                <div className="py-30">
                    <h1 className="mt-10 text-5xl">Don't be shy. Say hi 👋</h1>
                    <p className="text-2xl text-hairline py-5">Do you have a project or an idea that could use some help? <br />Let's work together</p>
                </div>
                <div className="flex justify-start items-start">
                    <ul className="list-reset flex pt-20 pb-20">
                        <li className="mr-5">
                            <a href="https://github.com/freakyfanny" className="no-underline hover:underline text-white">
                                <h3 className="text-2xl text-bold">Fanny Maras</h3>
                            </a>
                        </li>
                    </ul>

                    <ul className="list-reset flex pt-20 pb-20 ml-auto">
                        <li className="mr-5">
                            <a className="text-grey-darker no-underline hover:text-white" href="https://www.linkedin.com/in/marasfanny/">LinkedIn</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;