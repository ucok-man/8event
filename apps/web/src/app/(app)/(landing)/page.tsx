import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <Link href={'/dashboard/overview'}>Go To Dashboard</Link>
      LandingPage
    </div>
  );
}
