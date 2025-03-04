import Link from "next/link";

const Header: React.FC = () => {
    return (
        <header className="w-full fixed top-0 text-white p-0">
            <nav className="flex items-center justify-between flex-wrap bg-slate-800 p-6">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-bold text-xl">Bookishelf</span>
                </div>

                <div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
                    <div className="text-sm sm:flex-grow">
                        <Link
                            href="/"
                            className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4"
                        >
                            Bookishelf
                        </Link>
                        <Link
                            href="/favourites"
                            className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4"
                        >
                            Favourites
                        </Link>
                    </div>
                    
                    <div className="max-w-md mx-auto group">
                        <div className="flex items-center border-b-2 border-slate-200 group-focus-within:border-sky-500 transition-colors">
                        <input 
                            type="text" 
                            placeholder="Type to search..." 
                            className="w-full px-4 py-3 focus:outline-none bg-transparent"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-focus-within:text-sky-500 mr-2 transition-colors">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;