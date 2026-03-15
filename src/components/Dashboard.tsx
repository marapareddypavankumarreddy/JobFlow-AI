import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Application } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Clock, XCircle, ExternalLink, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) return;

    const q = query(
      collection(db, 'users', profile.uid, 'applications'),
      orderBy('appliedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(apps);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile?.uid]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'tailoring': return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-zinc-400" />;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Application Tracking</h1>
        <p className="text-zinc-500 mt-2">Monitor your progress and tailored resumes.</p>
      </header>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900">No applications yet</h3>
            <p className="text-zinc-500 mt-1">Start searching for jobs to automate your career growth.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                  {getStatusIcon(app.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{app.jobTitle || 'Unknown Position'}</h3>
                  <p className="text-sm text-zinc-500">{app.company || 'Unknown Company'}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-zinc-900 capitalize">{app.status}</p>
                  <p className="text-xs text-zinc-500">
                    {app.appliedAt ? formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true }) : 'Pending'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
