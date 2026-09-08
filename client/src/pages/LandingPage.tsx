import { Link } from 'react-router-dom';
import { MessageSquare, Users, BookOpen, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Real-Time Messaging',
    description: 'Instant chat with classmates and teachers, batch-scoped and secure.',
  },
  {
    icon: Users,
    title: 'Batch & Course Groups',
    description: 'Automatically organized by year, course, and department.',
  },
  {
    icon: BookOpen,
    title: 'Academic Materials',
    description: 'Lecture notes, assignments, and resources in one place.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Access Only',
    description: 'Only verified Software Engineering department members can join.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Injibara SE Community</h1>
          <p className="text-xs text-gray-500">Software Engineering Department</p>
        </div>
        <Link
          to="/login"
          className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          The official communication platform
          <br />
          <span className="text-primary-500">for our department</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Replacing scattered Telegram groups with one secure, purpose-built platform for
          students, teachers, and administrators.
        </p>
        <Link
          to="/login"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </main>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left"
          >
            <Icon className="text-primary-500 mb-3" size={28} />
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}