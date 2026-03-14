
import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AppData, Profile, Experience, Education, Certification, SkillSet, Project, BlogPost, Message, Category } from './app.models';

// Populate this with the FULL data so the site never loads blank
const DEFAULT_DATA: AppData = {
  "profile": {
    "name": "Jahidur Rahman",
    "title": "Analytics Manager | Expert in BI Tools, Excel, SQL & Python",
    "tagline": "Proactive and results-driven Business Intelligence Analyst",
    "email": "jahidur.dev@gmail.com",
    "phone": "+880 1992 547279",
    "linkedin": "linkedin.com/in/jahidur-dev",
    "github": "jahidur-dev",
    "kaggle": "jahidur-dev",
    "location": "Dhaka, Bangladesh",
    "summary": "Proactive and results-driven Business Intelligence Analyst with 5 + years of experience in data analytics, BI solutions, and cross-functional decision support. Skilled at transforming complex datasets into actionable insights that drive strategic and operational improvements. Proficient in SQL, Excel, and Python for building scalable dashboards, ETL pipelines, and automation solutions. Experienced in leading data system implementations, including enterprise-wide rollouts of Tally and other financial platforms, enhancing reporting accuracy and business visibility. Recognized for bridging technical and business functions, optimizing data processes, and delivering impactful insights to stakeholders. Strong leadership, problem-solving, and data storytelling skills with a focus on enabling data-driven business growth and operational excellence.",
    "currentlyLearning": "Advanced Deep Learning with PyTorch & System Design for Scalable Web Apps"
  },
  "experiences": [
    {
      "id": "1",
      "role": "Analytics Manager",
      "company": "Chaldal PLC",
      "period": "Jul 2024 - Present",
      "description": [
        "Implemented 45 dashboards across Superset, Excel, and Spreadsheets.",
        "Reduced operational costs by 20% through statistical KPI insights and team collaboration.",
        "Contributed to R&D of PK AI Assistant by delivering agent performance metrics and graphical solutions.",
        "Led financial data integrity initiatives by overseeing Tally ERP systems, establishing cross-server data reconciliation protocols that synchronized live operations with accounting records to ensure 100% reporting reliability.",
        "Implemented a Snowflake data model, reducing processing time by 50% and improving data accuracy.",
        "Mentored 60+ Jr Analysts in Python, SQL, and BI tools, enhancing team performance.",
        "Introduced real-time warehouse profitability dashboards and helped to close 7 high loss-making warehouses.",
        "Implemented fraud detection model using Python, SQL, and advanced Excel, reduced fraud case by 85%."
      ],
      "skills_used": [
        "Superset",
        "Excel",
        "Python",
        "SQL",
        "Snowflake",
        "Tally ERP"
      ]
    },
    {
      "id": "2",
      "role": "Sr. Data Analyst",
      "company": "Chaldal PLC",
      "period": "Nov 2021 - Jul 2024",
      "description": [
        "Architected Snowflake-based ETL pipelines powering Operations analytics and reporting.",
        "Developed comprehensive dashboards for product performance, seasonal trends, and retailer pricing strategies.",
        "Implemented scheduled reporting for Ops and management via SSRS, integrated with our database.",
        "Automated workflows for Pricing, Catalog, Profitability Control Room, & Analytic teams, reducing manual reporting hours by 40%.",
        "Enhanced banner & offer-block tracking systems to ensure billing accuracy and supply chain synchronization.",
        "Implemented vendor scoring and abnormal sales tracking algorithms to detect anomalies early, reduced fraud case by 20%.",
        "Designed and deployed the RFMPA (Recency, Frequency, Monetary, Profit, Avg Basket) customer segmentation for enhance the customer targeting and convering ratio by 65%"
      ],
      "skills_used": [
        "Snowflake",
        "ETL",
        "SSRS",
        "SQL",
        "Python",
        "RFMPA"
      ]
    },
    {
      "id": "3",
      "role": "Jr Data Analyst",
      "company": "Chaldal PLC",
      "period": "Jun 2020 - Nov 2021",
      "description": [
        "Maintained critical operational dashboards for multiple business units like Ops, Marketing, Supply Chain, more",
        "Conducted 17+ SQL training batches, upskilling non-technical teams across the company.",
        "Built automated data pipelines to support corporate, HR, and customer service departments.",
        "Created accessible reporting tools for non-technical stakeholders."
      ],
      "skills_used": [
        "SQL",
        "Reporting",
        "Training",
        "Data Pipelines"
      ]
    },
    {
      "id": "4",
      "role": "Web Developer - Internship",
      "company": "ICT CARE",
      "period": "July 2019 - Jun 2020",
      "description": [
        "Developed responsive client websites using the LAMP stack and WordPress.",
        "Customized themes and optimized frontend performance for better user experience."
      ],
      "skills_used": [
        "HTML/CSS",
        "PHP",
        "JavaScript",
        "WordPress"
      ]
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "Northern University of Business and Technology",
      "degree": "Bachelor of Science in Computer Engineering",
      "period": "2025 - Present",
      "details": "Khulna, Bangladesh"
    },
    {
      "id": "2",
      "institution": "Jessore Polytechnic Institute",
      "degree": "Diploma in Computer Engineering",
      "period": "2016 - 2020",
      "details": "Jashore, Bangladesh"
    },
    {
      "id": "3",
      "institution": "Naldanga Bhushan Pilot High School",
      "degree": "Secondary School Certificate (Business Studies)",
      "period": "2011 - 2016",
      "details": "Kaligonj Jhenaidah, Bangladesh"
    }
  ],
  "certifications": [
    {
      "id": "1",
      "name": "Web Design & Development",
      "issuer": "ICT Care, Jashore",
      "period": "",
      "details": "Comprehensive training in full-stack web technologies including HTML, CSS, Bootstrap, PHP, and JavaScript."
    }
  ],
  "skills": {
    "development": {
      "frontend": [
        "JavaScript",
        "HTML",
        "CSS",
        "jQuery",
        "Wordpress"
      ],
      "backend": [
        "PHP",
        "Node.js"
      ],
      "tools": [
        "Git",
        "VS Code"
      ]
    },
    "data": {
      "languages": [
        "T-SQL",
        "Python",
        "Azure KQL",
        "My SQL",
        "Json Parse"
      ],
      "visualization": [
        "Superset",
        "Data Visualization",
        "Google Spreadsheet",
        "MS Excel"
      ],
      "analysis": [
        "Snowflake",
        "Tally ERP",
        "Prediction & Projection",
        "Statistics",
        "Database Management"
      ]
    }
  },
  "projects": [
    {
      "id": "p1",
      "title": "Leadership & Strategy",
      "type": "Leadership",
      "description": "Led Analytics, Pricing, Monitoring, and Ops Control teams. Built the Profitability Control Team and improved operations. Developed Warehouse Profitability Report for P&L analysis. Enhanced Access Control Lists and data security protocols.",
      "technologies": [
        "Leadership",
        "Strategy",
        "Operations"
      ],
      "link": "#",
      "repoLink": "",
      "imageUrl": "https://picsum.photos/600/400?random=1",
      "role": "Analytics Manager",
      "challenge": "Needed to optimize operations and profitability across multiple teams and warehouses.",
      "solution": "Built dedicated control teams and developed comprehensive profitability reports.",
      "results": [
        "Improved operations across Pricing, Monitoring, and Ops Control",
        "Enhanced data security protocols"
      ],
      "datasetDetails": "",
      "techniquesUsed": [
        "Team Building",
        "P&L Analysis"
      ]
    },
    {
      "id": "p2",
      "title": "Process & System Improvements",
      "type": "Data Analytics",
      "description": "Implemented Tally accounting system across the organization. Built ETL processes using Snowflake. Created Concentration Score Model for better inventory management. Automated financial insights through new accounting software.",
      "technologies": [
        "Tally ERP",
        "Snowflake",
        "ETL"
      ],
      "link": "#",
      "repoLink": "",
      "imageUrl": "https://picsum.photos/600/400?random=2",
      "role": "Data Analyst",
      "challenge": "Manual financial and inventory processes were inefficient and error-prone.",
      "solution": "Implemented enterprise-wide Tally system and automated ETL pipelines via Snowflake.",
      "results": [
        "Automated financial insights",
        "Improved inventory management via Concentration Score Model"
      ],
      "datasetDetails": "",
      "techniquesUsed": [
        "ETL",
        "System Implementation"
      ]
    },
    {
      "id": "p3",
      "title": "Training & Mentorship",
      "type": "Leadership",
      "description": "Trained 70 team members on SQL & Excel. Conducted SQL exams to manage server access. Trained 12 team members on Analytics with Python. Trained 7 members on Web Development with raw PHP.",
      "technologies": [
        "SQL",
        "Excel",
        "Python",
        "PHP"
      ],
      "link": "#",
      "repoLink": "",
      "imageUrl": "https://picsum.photos/600/400?random=3",
      "role": "Mentor",
      "challenge": "Non-technical teams lacked data skills to perform their roles efficiently.",
      "solution": "Developed and conducted comprehensive training programs across the company.",
      "results": [
        "Upskilled 80+ employees in data and web technologies",
        "Streamlined server access management"
      ],
      "datasetDetails": "",
      "techniquesUsed": [
        "Training",
        "Mentorship"
      ]
    },
    {
      "id": "p4",
      "title": "Data & Decision Support",
      "type": "Data Analytics",
      "description": "Integrated cross-team insights into strategic planning. Developed fraud detection systems. Verified pricing through local market analysis and improved margin by 3%. Developed a demand prediction model to minimize overstock and optimize cost management.",
      "technologies": [
        "Python",
        "SQL",
        "Predictive Modeling"
      ],
      "link": "#",
      "repoLink": "",
      "imageUrl": "https://picsum.photos/600/400?random=4",
      "role": "Data Analyst",
      "challenge": "Needed to reduce fraud, optimize pricing, and minimize overstock.",
      "solution": "Built fraud detection and demand prediction models, and conducted local market pricing analysis.",
      "results": [
        "Improved margin by 3%",
        "Minimized overstock and optimized cost management",
        "Reduced fraud cases significantly"
      ],
      "datasetDetails": "",
      "techniquesUsed": [
        "Fraud Detection",
        "Demand Prediction",
        "Market Analysis"
      ]
    }
  ],
  "blogs": [
    {
      "id": "b1",
      "title": "The Evolution of Data Analytics in E-Commerce",
      "category": "Data Analytics",
      "date": "2024-01-15",
      "readTime": "5 min read",
      "imageUrl": "https://picsum.photos/800/400?random=11",
      "excerpt": "Exploring how modern data stacks like Snowflake and Superset are transforming the way e-commerce businesses make decisions.",
      "content": "Data analytics has moved from static reporting to real-time, predictive insights. In the fast-paced e-commerce sector, the ability to instantly track inventory, monitor profitability, and understand customer behavior is no longer a luxury—it's a necessity. By leveraging cloud data warehouses like Snowflake and open-source visualization tools like Apache Superset, organizations can democratize data access, empowering non-technical teams to make data-driven decisions on the fly."
    },
    {
      "id": "b2",
      "title": "Building Effective ETL Pipelines with Python",
      "category": "Technical",
      "date": "2023-11-22",
      "readTime": "8 min read",
      "imageUrl": "https://picsum.photos/800/400?random=12",
      "excerpt": "A deep dive into constructing robust, scalable ETL pipelines using Python and SQL to ensure data integrity.",
      "content": "Extract, Transform, Load (ETL) pipelines are the backbone of any data-driven organization. When building these pipelines, Python offers unparalleled flexibility. Using libraries like Pandas and SQLAlchemy, analysts can extract data from disparate sources, clean and transform it to meet business logic, and load it into a centralized warehouse. The key to a successful ETL pipeline lies in robust error handling, comprehensive logging, and ensuring data quality at every step of the process."
    },
    {
      "id": "b3",
      "title": "Mastering RFMPA for Customer Segmentation",
      "category": "Case Study",
      "date": "2023-09-10",
      "readTime": "6 min read",
      "imageUrl": "https://picsum.photos/800/400?random=13",
      "excerpt": "How extending the traditional RFM model to include Profitability and Average Basket size can supercharge your marketing ROI.",
      "content": "Traditional RFM (Recency, Frequency, Monetary) analysis is a powerful tool for customer segmentation. However, in low-margin industries like grocery delivery, it's crucial to factor in Profitability and Average Basket size (RFMPA). By clustering customers based on these five dimensions, marketing teams can tailor their campaigns more effectively, targeting high-value segments with personalized offers while optimizing acquisition costs for lower-tier segments."
    },
    {
      "id": "b4",
      "title": "Bridging the Gap Between Tech and Business",
      "category": "Leadership",
      "date": "2023-06-05",
      "readTime": "4 min read",
      "imageUrl": "https://picsum.photos/800/400?random=14",
      "excerpt": "Strategies for effectively communicating complex data insights to non-technical stakeholders and driving organizational change.",
      "content": "As a data professional, your analysis is only as good as your ability to communicate it. Bridging the gap between technical complexity and business strategy requires empathy, clear storytelling, and a focus on actionable outcomes. Instead of presenting raw numbers or complex models, focus on the 'so what?'—how does this data impact the bottom line, and what specific actions should the business take as a result?"
    },
    {
      "id": "b5",
      "title": "Detecting Fraud with Statistical Modeling",
      "category": "Data Analytics",
      "date": "2023-03-18",
      "readTime": "7 min read",
      "imageUrl": "https://picsum.photos/800/400?random=15",
      "excerpt": "An overview of how statistical models and anomaly detection algorithms can safeguard your business against fraudulent transactions.",
      "content": "Fraud detection is a constant cat-and-mouse game. By implementing statistical models that analyze historical transaction data, businesses can identify abnormal patterns and flag potential fraud in real-time. Techniques such as vendor scoring, standard deviation analysis on pricing, and tracking unusual purchase frequencies are highly effective in mitigating risk and protecting revenue."
    },
    {
      "id": "b6",
      "title": "Optimizing Web Performance for Better UX",
      "category": "Web Development",
      "date": "2022-12-01",
      "readTime": "5 min read",
      "imageUrl": "https://picsum.photos/800/400?random=16",
      "excerpt": "Key frontend optimization techniques to improve page load speeds, enhance user experience, and boost SEO rankings.",
      "content": "In today's digital landscape, a slow website can severely impact user retention and conversion rates. Optimizing frontend performance involves a combination of techniques: minifying CSS and JavaScript, leveraging browser caching, optimizing images, and reducing server response times. By prioritizing these optimizations, developers can create fast, responsive web applications that delight users and rank higher in search engine results."
    }
  ],
  "messages": [],
  "categories": [
    {
      "id": "c1",
      "name": "Web Development",
      "slug": "web-development",
      "type": "project",
      "published": true
    },
    {
      "id": "c2",
      "name": "Data Analytics",
      "slug": "data-analytics",
      "type": "project",
      "published": true
    },
    {
      "id": "c5",
      "name": "Leadership",
      "slug": "leadership",
      "type": "project",
      "published": true
    },
    {
      "id": "c3",
      "name": "Technical",
      "slug": "technical",
      "type": "blog",
      "published": true
    },
    {
      "id": "c4",
      "name": "Case Study",
      "slug": "case-study",
      "type": "blog",
      "published": true
    }
  ],
  "AdminPassword": "admin" // Default password
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
  categories = signal<Category[]>(DEFAULT_DATA.categories || []);
  adminPassword = signal<string>(DEFAULT_DATA.AdminPassword || 'admin');

  // Computed signals for backward compatibility
  projectCategories = computed(() => this.categories().filter(c => c.type === 'project').map(c => c.name));
  blogCategories = computed(() => this.categories().filter(c => c.type === 'blog').map(c => c.name));

  private saveTimeout: any;

  constructor() {
    this.loadData();
    
    // Auto-save whenever any signal changes (sync to server)
    effect(() => {
      const data: AppData = {
        profile: this.profile(),
        experiences: this.experiences(),
        education: this.education(),
        certifications: this.certifications(),
        skills: this.skills(),
        projects: this.projects(),
        blogs: this.blogs(),
        messages: this.messages(),
        categories: this.categories(),
        AdminPassword: this.adminPassword()
      };
      
      // Guard for non-browser environments or empty initial state
      if (typeof window === 'undefined' || data.profile.name === '') return;

      // Debounce save (wait for 1s of silence before saving)
      if (this.saveTimeout) clearTimeout(this.saveTimeout);
      
      this.saveTimeout = setTimeout(() => {
        this.http.post('/api/data', data).pipe(
          retry({ count: 3, delay: 1000 }),
          catchError(err => {
            console.error('Error saving data to server', err);
            return throwError(() => err);
          })
        ).subscribe({
          next: () => console.log('Data saved successfully'),
          error: (err) => console.error('Final error saving data', err)
        });
      }, 1000);
    });
  }

  private loadData() {
    // 1. Try to load from Server API first (Source of Truth)
    this.http.get<AppData>('/api/data').subscribe({
      next: (data) => {
        this.setState(data);
      },
      error: (err) => {
        console.error('Failed to load data from API, falling back to static file', err);
        // 2. Fallback to static JSON file if API fails
        this.http.get<AppData>('./data.json').subscribe({
          next: (data) => this.setState(data),
          error: (e) => console.error('Failed to load static data.json', e)
        });
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
    // Check for both AdminPassword (new) and adminPassword (old)
    this.adminPassword.set(data.AdminPassword || (data as any).adminPassword || 'admin');
    
    // Handle categories migration
    if (data.categories) {
      this.categories.set(data.categories);
    } else {
      // Migrate old string arrays to Category objects if needed
      const cats: Category[] = [];
      if (data.projectCategories) {
        data.projectCategories.forEach((name, i) => {
          cats.push({ id: `pc-${i}`, name, slug: name.toLowerCase().replace(/ /g, '-'), type: 'project', published: true });
        });
      } else {
        DEFAULT_DATA.categories?.filter(c => c.type === 'project').forEach(c => cats.push(c));
      }

      if (data.blogCategories) {
        data.blogCategories.forEach((name, i) => {
          cats.push({ id: `bc-${i}`, name, slug: name.toLowerCase().replace(/ /g, '-'), type: 'blog', published: true });
        });
      } else {
        DEFAULT_DATA.categories?.filter(c => c.type === 'blog').forEach(c => cats.push(c));
      }
      this.categories.set(cats);
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

  // Categories Management
  addCategory(category: Category) {
    this.categories.update(list => [...list, category]);
  }

  updateCategory(updated: Category) {
    this.categories.update(list => list.map(c => c.id === updated.id ? updated : c));
  }

  deleteCategory(id: string) {
    this.categories.update(list => list.filter(c => c.id !== id));
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

  updateAdminPassword(newPassword: string) {
    this.adminPassword.set(newPassword);
  }
}
