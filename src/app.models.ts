export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  summary: string;
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
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  imageUrl?: string;
  // Extended Case Study details
  role?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
}

export interface SkillSet {
  technical: string[];
  analytical: string[];
  soft: string[];
}

export interface AppData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillSet;
  projects: Project[];
}