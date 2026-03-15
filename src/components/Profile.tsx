import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Save, User as UserIcon, FileText, Settings } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [baseResume, setBaseResume] = useState(profile?.baseResume || '');
  const [jobRole, setJobRole] = useState(profile?.preferences?.jobRole || '');
  const [location, setLocation] = useState(profile?.preferences?.location || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile?.uid) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', profile.uid);
      await updateDoc(docRef, {
        baseResume,
        preferences: {
          ...profile.preferences,
          jobRole,
          location,
        }
      });
      await refreshProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Career Profile</h1>
        <p className="text-zinc-500 mt-2">Configure your base resume and job preferences for AI tailoring.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2>Base Resume (Markdown)</h2>
            </div>
            <textarea
              value={baseResume}
              onChange={(e) => setBaseResume(e.target.value)}
              placeholder="Paste your resume here in Markdown or plain text format..."
              className="w-full h-96 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono text-sm"
            />
          </section>

          <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <Settings className="w-5 h-5 text-emerald-600" />
              <h2>Job Preferences</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Target Job Role</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Preferred Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote or New York"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <UserIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">{profile?.displayName}</h3>
              <p className="text-sm text-zinc-500">{profile?.email}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </section>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h4 className="text-amber-800 font-semibold text-sm mb-2">AI Optimization Tip</h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              Providing a detailed base resume in Markdown helps JobFlow AI better understand your achievements and tailor them to specific job descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
