import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Welcome</h2>
        <p><Link className="link" href="/auth">Go to Auth</Link></p>
      </div>
    </div>
  );
}
