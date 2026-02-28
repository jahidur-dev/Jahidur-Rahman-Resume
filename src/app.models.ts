
export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  kaggle?: string;
  location: string;
  summary: string;
  currentlyLearning?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills_used: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  details: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  period: string;
  details: string;
}

export interface Project {
  id: string;
  type: string; // Changed from union type to string for dynamic categories
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  repoLink?: string;
  imageUrl?: string;
  // Extended Case Study details
  role?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  // Data specific
  datasetDetails?: string;
  techniquesUsed?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  excerpt: string;
  content: string;
}

export interface SkillSet {
  development: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  data: {
    languages: string[];
    visualization: string[];
    analysis: string[];
  };
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'project' | 'blog';
  parentId?: string;
  published: boolean;
}

export interface AppData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillSet;
  projects: Project[];
  blogs: BlogPost[];
  messages?: Message[];
  categories?: Category[];
  // Deprecated but kept for migration if needed, though we will try to use categories
  projectCategories?: string[]; 
  blogCategories?: string[];
}
