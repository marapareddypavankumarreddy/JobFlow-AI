import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { geminiService } from '../services/geminiService';
import { JobListing } from '../types';
import { Search, MapPin, DollarSign, Sparkles, Loader2, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const MOCK_JOBS: JobListing[] = [
  {
    id: '1',
    portalId: 'linkedin',
    externalId: 'ext_1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Systems',
    location: 'Remote',
    description: 'We are looking for a React expert with 5+ years of experience. Must know Tailwind CSS and TypeScript.',
    salaryRange: '$140k - $180k',
    postedAt: new Date().toISOString(),
    url: 'https://linkedin.com/jobs/1'
  },
  {
    id: '2',
    portalId: 'indeed',
    externalId: 'ext_2',
    title: 'Full Stack Developer',
    company: 'Innovate AI',
    location: 'New York, NY',
    description: 'Join our AI team to build next-gen automation tools. Node.js, React, and Python experience required.',
    salaryRange: '$130k - $160k',
    postedAt: new Date().toISOString(),
    url: 'https://indeed.com/jobs/2'
  },
  {
    id: '3',
    portalId: 'glassdoor',
    externalId: 'ext_3',
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'Hybrid',
    description: 'Looking for a UI/UX designer who loves clean aesthetics and user-centric design.',
    salaryRange: '$110k - $140k',
    postedAt: new Date().toISOString(),
    url: 'https://glassdoor.com/jobs/3'
  }
];

export const JobSearch: React.FC = () => {
  const { profile } = useAuth();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = async (job: JobListing) => {
    if (!profile?.uid || !profile?.baseResume) {
      alert('Please complete your profile and add a base resume first!');
      return;
    }

    setApplyingId(job.id);
    try {
      // 1. AI Tailoring
      const tailoredResume = await geminiService.tailorResume(profile.baseResume, job.description);
      const tailoredCoverLetter = await geminiService.generateCoverLetter(profile.baseResume, job.description);

      // 2. Save Application to Firestore
      await addDoc(collection(db, 'users', profile.uid, 'applications'), {
        userId: profile.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: 'applied',
        tailoredResume,
        tailoredCoverLetter,
        appliedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });

      setAppliedIds(prev => [...prev, job.id]);
    } catch (error) {
      console.error(error);
      alert('Failed to automate application.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Find Your Next Role</h1>
          <p className="text-zinc-500 mt-2">AI-powered job discovery and 1-click automated applications.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
            />
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {MOCK_JOBS.map((job) => (
          <div key={job.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-emerald-200 transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                    <p className="text-zinc-600 font-medium">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.portalId}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {job.salaryRange}
                  </div>
                </div>

                <p className="text-zinc-600 line-clamp-2 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[160px]">
                {appliedIds.includes(job.id) ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold">
                    <CheckCircle className="w-5 h-5" /> Applied
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job)}
                    disabled={applyingId !== null}
                    className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {applyingId === job.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Tailoring...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Auto-Apply
                      </>
                    )}
                  </button>
                )}
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-bold text-center hover:bg-zinc-50 transition-all"
                >
                  View Original
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
