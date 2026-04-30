import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Neighborhood Library Service
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/books" className="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">Books</Link>
                <Link href="/members" className="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">Members</Link>
                <Link href="/lending" className="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">Lending</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
