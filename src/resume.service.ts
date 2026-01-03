import { Injectable, signal, effect } from '@angular/core';
import { AppData, Profile, Experience, Education, Certification, SkillSet, Project } from './app.models';

const DEFAULT_DATA: AppData = {
  profile: {
    name: 'Jahidur Rahman',
    title: 'Manager of Analytics | Data Science Professional',
    email: 'jahidur.dev@gmail.com',
    phone: '+880 1992 547279',
    linkedin: 'linkedin.com/in/jahidur-dev',
    location: 'Dhaka, Bangladesh',
    summary: 'Analytical and detail-oriented Data Analytics Professional with 5+ years of progressive experience at Chaldal PLC, growing from Jr. Data Analyst to Manager of Analytics. Expertise in SQL, statistical modeling, Python-based automation, and dashboard development. Proven ability to transform raw data into actionable insights that drive revenue growth and operational efficiency.',
  },
  experiences: [
    {
      id: '1',
      role: 'Manager of Analytics Team',
      company: 'Chaldal PLC',
      period: 'Jul 2024 - Present',
      description: [
        'Architected daily purchase recommendation models optimizing inventory for 10-minute delivery promises.',
        'Engineered supply chain prediction models to streamline logistics and reduce waste.',
        'Directed a cross-functional analytics team, implementing agile workflows for faster insight delivery.',
        'Spearheaded demand forecasting for high-traffic seasons (Ramadan & Eid), directly impacting stock availability.',
        'Led customer behavioral analysis for telesales, increasing conversion rates through targeted data support.'
      ],
      skills_used: ['Team Leadership', 'Predictive Modeling', 'Supply Chain Analytics', 'Python']
    },
    {
      id: '2',
      role: 'Sr Data Analyst',
      company: 'Chaldal PLC',
      period: 'Nov 2021 - Jul 2024',
      description: [
        'Developed comprehensive dashboards for product performance, seasonal trends, and retailer pricing strategies.',
        'Automated workflows for Catalog & Profitability Control Room teams, reducing manual reporting hours by 40%.',
        'Enhanced banner & offer-block tracking systems to ensure billing accuracy and supply chain synchronization.',
        'Implemented vendor scoring and abnormal sales tracking algorithms to detect anomalies early.',
        'Designed and deployed the RFMPA (Recency, Frequency, Monetary, Profit, Avg Basket) customer segmentation framework.'
      ],
      skills_used: ['SQL', 'Dashboarding', 'RFMPA', 'Process Automation']
    },
    {
      id: '3',
      role: 'Jr Data Analyst',
      company: 'Chaldal PLC',
      period: 'Jun 2020 - Nov 2021',
      description: [
        'Maintained critical operational dashboards for multiple business units.',
        'Conducted 17+ SQL training batches, upskilling non-technical teams across the company.',
        'Built automated data pipelines to support corporate, HR, and customer service departments.',
        'Created accessible reporting tools for non-technical stakeholders.'
      ],
      skills_used: ['SQL', 'Reporting', 'Training', 'Data Cleaning']
    },
    {
      id: '4',
      role: 'Web Developer - Internship',
      company: 'ICT CARE',
      period: 'July 2019 - Jun 2020',
      description: [
        'Developed responsive client websites using the LAMP stack and WordPress.',
        'Customized themes and optimized frontend performance for better user experience.'
      ],
      skills_used: ['HTML/CSS', 'PHP', 'JavaScript', 'WordPress']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Jessore Polytechnic Institute',
      degree: 'Diploma in Computer Engineering',
      period: '2016 - 2020',
      details: 'GPA 3.53 / 4.00'
    },
    {
      id: '2',
      institution: 'Naldanga Bhushan Pilot High School',
      degree: 'Secondary School Certificate (SSC)',
      period: '2008 - 2016',
      details: 'GPA 4.72 / 5.00 | Business Studies'
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'Web Design & Development',
      issuer: 'ICT Care, Jashore',
      period: 'Jan 2019 - Jun 2019',
      details: 'Comprehensive training in full-stack web technologies including HTML, CSS, Bootstrap, PHP, and JavaScript.'
    }
  ],
  skills: {
    technical: [
      'SQL (Advanced)',
      'Python (Pandas, NumPy)',
      'Data Visualization',
      'Statistical Analysis',
      'PowerBI / Tableau',
      'Excel (Advanced)',
      'HTML / CSS / JS'
    ],
    analytical: [
      'Predictive Modeling',
      'Customer Segmentation',
      'RFM Analysis',
      'Supply Chain Optimization',
      'Forecasting',
      'A/B Testing Concepts'
    ],
    soft: [
      'Team Leadership',
      'Strategic Planning',
      'Stakeholder Management',
      'Technical Mentorship',
      'Cross-functional Communication'
    ]
  },
  projects: [
    {
      id: 'p1',
      title: 'Dynamic Purchase Prediction Model',
      description: 'A machine learning model designed to predict daily inventory needs for 10-minute delivery hubs.',
      technologies: ['Python', 'Scikit-Learn', 'SQL', 'Prophet'],
      link: '#',
      imageUrl: 'https://picsum.photos/600/400?random=1',
      role: 'Lead Data Scientist',
      challenge: 'The company faced excessive waste (15%) and frequent stockouts due to a static, manual ordering process that failed to account for daily demand fluctuations.',
      solution: 'Developed a time-series forecasting model (Facebook Prophet) incorporating seasonality, holidays, and weather data to automate replenishment orders for hundreds of SKUs.',
      results: [
        'Reduced perishable waste by 15% within 3 months',
        'Lowered stockout rates by 20%, improving customer satisfaction',
        'Automated 90% of daily ordering, freeing up 20+ hours/week for the supply chain team'
      ]
    },
    {
      id: 'p2',
      title: 'RFMPA Customer Segmentation',
      description: 'An advanced segmentation framework classifying 1M+ users based on purchasing behavior.',
      technologies: ['SQL', 'PowerBI', 'Statistics'],
      link: '#',
      imageUrl: 'https://picsum.photos/600/400?random=2',
      role: 'Senior Data Analyst',
      challenge: 'Marketing campaigns were generic and had low conversion rates because the customer base of 1M+ users was treated as a monolith.',
      solution: 'Designed and deployed an RFMPA (Recency, Frequency, Monetary, Profit, Average Basket) segmentation framework to cluster users into actionable groups like "Champions", "At-Risk", and "Price Sensitive".',
      results: [
        'Increased email marketing open rates by 25%',
        'Improved campaign ROI by 18% through targeted offers',
        'Identified and reactivated 5,000+ dormant high-value customers'
      ]
    },
    {
      id: 'p3',
      title: 'Automated Vendor Scoring System',
      description: 'A real-time scoring system to evaluate vendor performance based on multiple KPIs.',
      technologies: ['SQL', 'Python', 'Airflow'],
      link: '#',
      imageUrl: 'https://picsum.photos/600/400?random=3',
      role: 'Data Analyst',
      challenge: 'Procurement teams lacked visibility into vendor performance, leading to reliance on underperforming suppliers and inconsistent pricing.',
      solution: 'Built an automated scoring pipeline that graded vendors daily on Fill Rate, Delivery Speed, Price Consistency, and Quality Return Rate.',
      results: [
        'Improved overall vendor fill rate from 82% to 94%',
        'Enabled data-driven negotiation, saving 3% on annual procurement costs',
        'Streamlined the vendor onboarding and offboarding process'
      ]
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class ResumeService {
  profile = signal<Profile>(DEFAULT_DATA.profile);
  experiences = signal<Experience[]>(DEFAULT_DATA.experiences);
  education = signal<Education[]>(DEFAULT_DATA.education);
  certifications = signal<Certification[]>(DEFAULT_DATA.certifications);
  skills = signal<SkillSet>(DEFAULT_DATA.skills);
  projects = signal<Project[]>(DEFAULT_DATA.projects);

  constructor() {
    this.loadFromStorage();
    
    // Auto-save whenever any signal changes
    effect(() => {
      const data: AppData = {
        profile: this.profile(),
        experiences: this.experiences(),
        education: this.education(),
        certifications: this.certifications(),
        skills: this.skills(),
        projects: this.projects()
      };
      try {
        localStorage.setItem('jahidur_portfolio_data', JSON.stringify(data));
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    });
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('jahidur_portfolio_data');
      if (stored) {
        const data = JSON.parse(stored) as AppData;
        this.profile.set(data.profile);
        this.experiences.set(data.experiences || []);
        this.education.set(data.education || []);
        this.certifications.set(data.certifications || []);
        this.skills.set(data.skills || DEFAULT_DATA.skills);
        this.projects.set(data.projects || []);
      }
    } catch (e) {
      console.error('Error loading from localStorage', e);
    }
  }

  // Admin Actions
  updateProfile(newProfile: Profile) {
    this.profile.set(newProfile);
  }

  addExperience(exp: Experience) {
    this.experiences.update(list => [exp, ...list]);
  }

  updateExperience(updated: Experience) {
    this.experiences.update(list => list.map(e => e.id === updated.id ? updated : e));
  }

  deleteExperience(id: string) {
    this.experiences.update(list => list.filter(e => e.id !== id));
  }
  
  // Projects
  addProject(proj: Project) {
    this.projects.update(list => [proj, ...list]);
  }
  
  updateProject(updated: Project) {
    this.projects.update(list => list.map(p => p.id === updated.id ? updated : p));
  }
  
  deleteProject(id: string) {
    this.projects.update(list => list.filter(p => p.id !== id));
  }

  // Skills
  updateSkills(newSkills: SkillSet) {
    this.skills.set(newSkills);
  }

  // Education/Certs (Simplified for brevity, following similar pattern)
  addEducation(edu: Education) {
    this.education.update(list => [edu, ...list]);
  }
  deleteEducation(id: string) {
    this.education.update(list => list.filter(e => e.id !== id));
  }
}