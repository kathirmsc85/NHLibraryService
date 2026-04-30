import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8 mt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Manage Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Neighborhood Library</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A premium, modern dashboard to handle your books, track your members, and streamline the lending process.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Link href="/books" className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Books</h2>
            <p className="text-slate-400">View, add, and manage your library's collection.</p>
          </Link>
          
          <Link href="/members" className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Members</h2>
            <p className="text-slate-400">Keep track of your readers and their contact info.</p>
          </Link>
          
          <Link href="/lending" className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Lending</h2>
            <p className="text-slate-400">Borrow out books and record returns effortlessly.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
