'use client';

import WorkersList from '@/components/workers/WorkersList';

export default function TeamPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <WorkersList />
    </div>
  );
}
