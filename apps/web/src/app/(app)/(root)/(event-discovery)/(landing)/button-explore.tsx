import Link from 'next/link';

export default function ButtonExplore() {
  return (
    <div className="mb-8 w-full flex justify-center">
      <Link
        href={'/explore#searchbox'}
        prefetch={false}
        className="font-medium border border-brand-blue-600 py-2 px-4 text-brand-blue-600 rounded-lg hover:bg-brand-blue-100/60 transition-all duration-300"
      >
        Explore More
      </Link>
    </div>
  );
}
