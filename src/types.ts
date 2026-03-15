export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  baseResume?: string;
  preferences?: {
    jobRole: string;
    location: string;
    minSalary: number;
    remoteOnly: boolean;
    experienceLevel: 'intern' | 'entry' | 'mid' | 'senior' | 'lead';
  };
  createdAt: string;
}

export interface JobListing {
  id: string;
  portalId: string;
  externalId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange?: string;
  postedAt: string;
  url: string;
  matchScore?: number;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'tailoring' | 'applied' | 'rejected' | 'interviewing';
  tailoredResume?: string;
  tailoredCoverLetter?: string;
  appliedAt?: string;
  notes?: string;
  jobTitle?: string; // Denormalized for easy display
  company?: string;  // Denormalized for easy display
}
