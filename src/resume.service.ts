
import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppData, Profile, Experience, Education, Certification, SkillSet, Project, BlogPost, Message } from './app.models';

const STORAGE_KEY = 'jahidur_portfolio_data_v4'; 

// Populate this with the FULL data so the site never loads blank
const DEFAULT_DATA: AppData = {
  "profile": {
    "name": "Jahidur Rahman",
    "title": "Manager of Analytics Team | Web Developer & Data Analyst",
    "tagline": "I turn data into insights and ideas into web experiences.",
    "email": "jahidur.dev@gmail.com",
    "phone": "+880 1992 547279",
    "linkedin": "linkedin.com/in/jahidur-dev",
    "github": "jahidur-dev",
    "kaggle": "jahidur-dev",
    "location": "Dhaka, Bangladesh",
    "summary": "Analytical and detail-oriented Data Analytics Professional with 5+ years of progressive experience at Chaldal PLC, growing from Jr. Data Analyst to Manager of Analytics. Expertise in SQL, statistical modeling, Python-based automation, and dashboard development, with a proven ability to transform raw data into actionable insights. Successfully led cross-functional analytics teams, developed demand prediction and purchase recommendation models, and implemented customer segmentation frameworks (RFMPA) to drive revenue growth and operational efficiency. Skilled at collaborating with both technical and non-technical departments to streamline processes, automate reporting, and enhance decision-making across supply chain, telesales, and profitability control.",
    "currentlyLearning": "Advanced Deep Learning with PyTorch & System Design for Scalable Web Apps"
  },
  "experiences": [
    {
      "id": "1",
      "role": "Manager of Analytics Team",
      "company": "Chaldal PLC",
      "period": "Jul 2024 - Present",
      "description": [
        "Deployed the Purchase Recommendation model to predict the purchase amount and high potential ROI product list simulating with multiple funds resistance both for regular sourcing and ASAP (10 minutes) sourcing.",
        "Directed the analytics team, enhancing workflow and insights delivery.",
        "Led demand prediction for Ramadan & Eid, supporting seasonal sales.",
        "Conducted customer analysis for telesales and Premium Care teams to improve conversion."
      ],
      "skills_used": ["Team Leadership", "Predictive Modeling", "Supply Chain Analytics", "Python"]
    },
    {
      "id": "2",
      "role": "Sr Data Analyst",
      "company": "Chaldal PLC",
      "period": "Nov 2021 - Jul 2024",
      "description": [
        "Created reports and dashboards for product analysis, seasonal trends, retailer pricing, cost price analysis, and SKU brand scoring.",
        "Guided Catalog & Profitability Control Room teams, improving workflows and automating repetitive tasks.",
        "Enhanced banner & offer-block tracking, supporting supply chain and billing accuracy.",
        "Conducted vendor scoring, stocking days analysis, abnormal sales tracking, and price change monitoring.",
        "Designed customer segmentation/classification using RFMPA (Recency, Frequency, Monetary, Profit, Avg Basket Size)."
      ],
      "skills_used": ["SQL", "Dashboarding", "RFMPA", "Process Automation"]
    },
    {
      "id": "3",
      "role": "Jr Data Analyst",
      "company": "Chaldal PLC",
      "period": "Jun 2020 - Nov 2021",
      "description": [
        "Designed and maintained dashboards and reports for multiple departments.",
        "Conducted 17 SQL training batches across teams to strengthen company-wide data skills.",
        "Supported corporate, telesales, HR, and customer service teams with data-driven process automation.",
        "Built tools to collect, store, and generate reports for non-technical departments."
      ],
      "skills_used": ["SQL", "Reporting", "Training", "Data Cleaning"]
    },
    {
      "id": "4",
      "role": "Web Developer - Internship",
      "company": "ICT CARE",
      "period": "July 2019 - Jun 2020",
      "description": [
        "Built client websites using HTML, CSS, Bootstrap, JavaScript, PHP, and WordPress.",
        "Customized WordPress themes and implemented responsive design for better UX."
      ],
      "skills_used": ["HTML/CSS", "PHP", "JavaScript", "WordPress"]
    },
  ],
  "education": [
    {
      "id": "1",
      "institution": "Jessore Polytechnic Institute, Jashore",
      "degree": "Diploma in Computer Engineering",
      "period": "Jul 2016 - Jun 2020",
      "details": "Computer Technology | GPA 3.53 Out of 4.00"
    },
    {
      "id": "2",
      "institution": "Naldanga Bhushan Pilot High School, Kaligonj Jhenaidah",
      "degree": "Secondary School Certificate (SSC)",
      "period": "2016",
      "details": "Business Studies | GPA 4.72 Out of 5.00"
    }
  ],
  "certifications": [
    {
      "id": "1",
      "name": "Web Design & Development",
      "issuer": "ICT Care, Jashore",
      "period": "Jan 2019 - Jun 2019",
      "details": "Strong grasp of HTML, CSS, Bootstrap, and JavaScript for web design. Proficient in crafting responsive layouts, ensuring optimal user experience. Expertise in content structuring, styling, and dynamic functionality implementation. PHP, jquery for web development."
    }
  ],
  "skills": {
    "development": {
      "frontend": ["HTML", "CSS", "JavaScript", "Bootstrap", "WordPress"],
      "backend": ["PHP", "MySQL"],
      "tools": ["Git", "VS Code"]
    },
    "data": {
      "languages": ["SQL (Advanced)", "Python (Basic, with automation & analytics)"],
      "visualization": ["Dashboarding & Data Visualization", "Microsoft Office"],
      "analysis": ["Statistical Analysis", "Predictive Modeling & Forecasting", "Customer Segmentation & Classification", "Process Automation & Optimization", "Data-Driven Decision Support"]
    }
  },
  "projects": [
    {
      "id": "p1",
      "title": "Dynamic Purchase Prediction Model",
      "type": "data",
      "description": "A machine learning model designed to predict daily inventory needs for 10-minute delivery hubs.",
      "technologies": ["Python", "Scikit-Learn", "SQL", "Prophet"],
      "link": "#",
      "repoLink": "https://github.com/jahidur-dev/purchase-prediction",
      "imageUrl": "https://picsum.photos/600/400?random=1",
      "role": "Lead Data Scientist",
      "challenge": "The company faced excessive waste (15%) and frequent stockouts due to a static, manual ordering process that failed to account for daily demand fluctuations.",
      "solution": "Developed a time-series forecasting model (Facebook Prophet) incorporating seasonality, holidays, and weather data to automate replenishment orders for hundreds of SKUs.",
      "results": [
        "Reduced perishable waste by 15% within 3 months",
        "Lowered stockout rates by 20%, improving customer satisfaction",
        "Automated 90% of daily ordering, freeing up 20+ hours/week for the supply chain team"
      ],
      "datasetDetails": "Historical sales data (2 years), Weather API data, Holiday calendar",
      "techniquesUsed": ["Time Series Forecasting", "Regression", "Data Cleaning"]
    },
    {
      "id": "p2",
      "title": "RFMPA Customer Segmentation Engine",
      "type": "data",
      "description": "A high-impact customer clustering framework analyzing 1M+ user behaviors to drive hyper-personalized marketing and retention strategies.",
      "technologies": ["SQL", "PowerBI", "Python", "Statistics"],
      "link": "#",
      "imageUrl": "https://picsum.photos/600/400?random=2",
      "role": "Senior Data Analyst",
      "challenge": "Marketing efforts were inefficient due to a 'one-size-fits-all' approach. With 1M+ users treated as a monolith, campaign engagement was low, and high-value churn was going undetected.",
      "solution": "Engineered a comprehensive RFMPA (Recency, Frequency, Monetary, Profitability, Avg Basket) model using SQL and Python. This segmented the user base into actionable clusters such as \"Champions\", \"Hibernating\", and \"Bargain Hunters\", enabling precise targeting.",
      "results": [
        "Achieved a 25% increase in campaign conversion rates via personalized targeting",
        "Reactivated 5,000+ dormant high-value customers, generating significant incremental revenue",
        "Reduced discount spend by 15% by suppressing offers to price-insensitive segments"
      ],
      "datasetDetails": "1M+ Customer Transaction Records",
      "techniquesUsed": ["Clustering (K-Means)", "RFM Analysis", "SQL Window Functions"]
    },
    {
      "id": "p3",
      "title": "Automated Vendor Performance System",
      "type": "data",
      "description": "An automated, data-driven evaluation system transforming procurement by ranking 500+ vendors on real-time operational KPIs.",
      "technologies": ["SQL", "Python", "Airflow", "Data Warehousing"],
      "link": "#",
      "imageUrl": "https://picsum.photos/600/400?random=3",
      "role": "Data Analyst",
      "challenge": "The procurement department lacked visibility into supplier performance, leading to reliance on gut feeling, frequent stockouts, and an inability to negotiate better terms with underperforming vendors.",
      "solution": "Built a robust ETL pipeline (Airflow & SQL) to calculate daily vendor scores based on Fill Rate, Delivery Speed, Price Stability, and Quality. Created live dashboards to flag non-compliant vendors immediately.",
      "results": [
        "Drove overall vendor fill rates from 82% to 94%, ensuring consistent product availability",
        "Empowered the commercial team to negotiate 3% cost savings by leveraging performance data",
        "Reduced manual vendor assessment time by 90%, allowing buyers to focus on strategic sourcing"
      ],
      "datasetDetails": "Vendor Delivery Logs, Quality Check Reports",
      "techniquesUsed": ["ETL Pipeline", "Data Warehousing", "Automated Reporting"]
    },
    {
      "id": "p4",
      "title": "E-Commerce Analytics Dashboard",
      "type": "web",
      "description": "A full-stack analytics dashboard for e-commerce store owners to visualize sales, traffic, and user behavior.",
      "technologies": ["Angular", "Node.js", "Chart.js", "Tailwind CSS"],
      "link": "#",
      "repoLink": "https://github.com/jahidur-dev/ecommerce-dashboard",
      "imageUrl": "https://picsum.photos/600/400?random=4",
      "role": "Full Stack Developer",
      "challenge": "Store owners needed a real-time view of their business metrics without navigating complex database tools.",
      "solution": "Built a responsive dashboard using Angular and Chart.js, fetching data from a Node.js API. Implemented JWT authentication for security.",
      "results": ["Enabled real-time decision making for 50+ store owners."]
    }
  ],
  "blogs": [
    {
      "id": "b1",
      "title": "Why SQL is Still King in the Age of AI",
      "category": "Technical",
      "date": "Nov 15, 2024",
      "readTime": "5 min read",
      "imageUrl": "https://picsum.photos/600/400?random=10",
      "excerpt": "Despite the rise of LLMs and advanced ORMs, raw SQL remains the backbone of high-performance data analytics. Here is why.",
      "content": "In the rapidly evolving landscape of data science, new tools emerge daily. However, Structured Query Language (SQL) has remained a constant force since the 1970s. \n\nWhy? Because data lives in relational databases. \n\nWhile AI can generate queries, understanding the underlying logic of joins, window functions, and CTEs is crucial for optimization. In this post, I explore how modern analysts can leverage SQL alongside AI tools to maximize efficiency rather than replacing it."
    },
    {
      "id": "b2",
      "title": "Optimizing Supply Chains with Predictive Analytics",
      "category": "Case Study",
      "date": "Oct 02, 2024",
      "readTime": "8 min read",
      "imageUrl": "https://picsum.photos/600/400?random=11",
      "excerpt": "A deep dive into how we reduced perishable waste by 15% using time-series forecasting models.",
      "content": "Supply chain management in the grocery sector is a race against time. Perishable goods have a limited shelf life, and overstocking leads to direct financial loss. \n\nWe implemented a Facebook Prophet model to account for seasonality and local holidays. By feeding historical sales data combined with weather APIs, we were able to predict demand with 85% accuracy. This shift from reactive to predictive ordering saved the company significant revenue in Q3."
    },
    {
      "id": "b3",
      "title": "Leading Cross-Functional Data Teams",
      "category": "Leadership",
      "date": "Sep 20, 2024",
      "readTime": "4 min read",
      "imageUrl": "https://picsum.photos/600/400?random=12",
      "excerpt": "Moving from an individual contributor to a manager requires a shift in mindset. Here are my top 3 learnings.",
      "content": "The transition from writing code to managing people who write code is challenging. \n\n1. Delegate, don't dictate: Trust your team to find the solution. \n2. Focus on the \"Why\": Engineers need to know the business impact of their work. \n3. Shield the team: Protect them from shifting priorities so they can focus on deep work.\n\nThese three pillars have helped me build a high-performing analytics unit."
    }
  ]
};
@Injectable({ providedIn: 'root' })
export class ResumeService {
  http = inject(HttpClient);

  // Initialize with DEFAULT_DATA so the site is never blank
  profile = signal<Profile>(DEFAULT_DATA.profile);
  experiences = signal<Experience[]>(DEFAULT_DATA.experiences);
  education = signal<Education[]>(DEFAULT_DATA.education);
  certifications = signal<Certification[]>(DEFAULT_DATA.certifications);
  skills = signal<SkillSet>(DEFAULT_DATA.skills);
  projects = signal<Project[]>(DEFAULT_DATA.projects);
  blogs = signal<BlogPost[]>(DEFAULT_DATA.blogs);
  messages = signal<Message[]>(DEFAULT_DATA.messages || []);

  constructor() {
    this.loadData();
    
    // Auto-save whenever any signal changes (local storage sync)
    effect(() => {
      const data: AppData = {
        profile: this.profile(),
        experiences: this.experiences(),
        education: this.education(),
        certifications: this.certifications(),
        skills: this.skills(),
        projects: this.projects(),
        blogs: this.blogs(),
        messages: this.messages()
      };
      
      // Guard for non-browser environments
      if (typeof localStorage === 'undefined') return;

      // Only save if we have meaningful data (avoids overwriting storage with empty initial state)
      if (data.profile.name === '') return;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    });
  }

  private loadData() {
    // 1. Try Local Storage first (Edited data takes precedence)
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored) as AppData;
          this.setState(data);
          return;
        }
      } catch (e) {
        console.error('Error loading from localStorage', e);
      }
    }

    // 2. Fallback to JSON Database file
    // Use ./data.json (relative) to handle subdirectory deployments better
    this.http.get<AppData>('./data.json').subscribe({
      next: (data) => {
        this.setState(data);
      },
      error: (err) => {
        console.error('Failed to load data.json, falling back to default data', err);
        // We already have DEFAULT_DATA set in the signals, so no action needed.
      }
    });
  }

  private setState(data: AppData) {
    this.profile.set(data.profile);
    this.experiences.set(data.experiences || []);
    this.education.set(data.education || []);
    this.certifications.set(data.certifications || []);
    
    // Validate skills structure (migration from old format)
    let validSkills = data.skills;
    if (!validSkills || !(validSkills as any).development) {
      validSkills = DEFAULT_DATA.skills;
    }
    this.skills.set(validSkills);
    
    this.projects.set(data.projects || []);
    this.blogs.set(data.blogs || []);
    this.messages.set(data.messages || []);
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

  // Blogs
  addBlog(blog: BlogPost) {
    this.blogs.update(list => [blog, ...list]);
  }

  updateBlog(updated: BlogPost) {
    this.blogs.update(list => list.map(b => b.id === updated.id ? updated : b));
  }

  deleteBlog(id: string) {
    this.blogs.update(list => list.filter(b => b.id !== id));
  }

  // Skills
  updateSkills(newSkills: SkillSet) {
    this.skills.set(newSkills);
  }

  // Education/Certs
  addEducation(edu: Education) {
    this.education.update(list => [edu, ...list]);
  }
  deleteEducation(id: string) {
    this.education.update(list => list.filter(e => e.id !== id));
  }

  // Messages
  addMessage(msg: Message) {
    this.messages.update(list => [msg, ...list]);
  }

  deleteMessage(id: string) {
    this.messages.update(list => list.filter(m => m.id !== id));
  }

  markMessageAsRead(id: string) {
    this.messages.update(list => list.map(m => m.id === id ? { ...m, read: true } : m));
  }
}
