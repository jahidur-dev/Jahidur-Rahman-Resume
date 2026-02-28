
import { Component, signal, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ResumeService } from './resume.service';
import { AdminComponent } from './admin.component';
import { Project, BlogPost, Message } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  host: {
    '(window:keydown.control.period)': 'onAdminShortcut($event)'
  },
  styles: [`
    :host {
      display: block;
    }
    /* Standard Transitions */
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    .animate-fade-out {
      animation: fadeOut 0.3s ease-in forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    .prose-content {
      white-space: pre-wrap;
    }

    /* THEME ANIMATIONS */
    /* 1. Moving Background Blobs */
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    
    /* 2. Gradient Text Flow */
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-text {
      background-size: 200% auto;
      animation: gradient-x 3s linear infinite;
    }

    /* 3. Gentle Float */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    /* Staggered float delays */
    .delay-0 { animation-delay: 0s; }
    .delay-100 { animation-delay: 1.5s; }
    .delay-200 { animation-delay: 3s; }
    .delay-300 { animation-delay: 4.5s; }

    /* 4. Welcome Screen Animation */
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class AppComponent implements OnInit {
  resumeService = inject(ResumeService);
  
  // Expose signals for template
  profile = this.resumeService.profile;
  experiences = this.resumeService.experiences;
  education = this.resumeService.education;
  certifications = this.resumeService.certifications;
  skills = this.resumeService.skills;
  projects = this.resumeService.projects;
  blogs = this.resumeService.blogs;

  // Computed branding
  firstName = computed(() => this.profile().name.split(' ')[0]);
  initial = computed(() => this.profile().name.charAt(0).toUpperCase());

  currentYear = new Date().getFullYear();
  showAdmin = signal(false);
  
  // Welcome Animation State
  showWelcome = signal(true);
  fadeOutWelcome = signal(false);

  // Counter State
  experienceCount = signal(0);
  
  // Mobile Menu State
  mobileMenuOpen = signal(false);
  closingMenu = signal(false);
  
  // Project Modal State
  // View Mode State
  viewMode = signal<'home' | 'all-projects' | 'all-insights'>('home');

  setViewMode(mode: 'home' | 'all-projects' | 'all-insights') {
    this.viewMode.set(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectedProject = signal<Project | null>(null);

  // Blog State
  selectedBlog = signal<BlogPost | null>(null);
  selectedCategory = signal<string>('All');
  
  blogCategories = computed(() => {
    const cats = this.resumeService.categories()
      .filter(c => c.type === 'blog' && c.published)
      .map(c => c.name);
    return ['All', ...cats];
  });

  filteredBlogs = computed(() => {
    let blogs = this.blogs();
    if (this.selectedCategory() !== 'All') {
      blogs = blogs.filter(b => b.category === this.selectedCategory());
    }
    if (this.viewMode() === 'home') {
      return blogs.slice(0, 6);
    }
    return blogs;
  });

  // Derived stats (Computed to allow animation of specific values)
  stats = computed(() => [
    { label: 'Years Experience', value: `${this.experienceCount()}+`, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Team Leadership', value: 'Manager', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Core Tech', value: 'SQL & Python', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { label: 'Domain', value: 'E-commerce', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' }
  ]);

  // Theme State
  // Forced to dark mode as per request
  
  // Typing Animation State
  typingText = signal('');
  fullText = "I turn data into insights and ideas into web experiences.";
  
  // Project Filtering
  projectType = signal<string>('All');
  
  projectCategories = computed(() => {
    const cats = this.resumeService.categories()
      .filter(c => c.type === 'project' && c.published)
      .map(c => c.name);
    return ['All', ...cats];
  });
  
  filteredProjects = computed(() => {
    let projects = this.projects();
    if (this.projectType() !== 'All') {
      projects = projects.filter(p => p.type === this.projectType());
    }
    if (this.viewMode() === 'home') {
      return projects.slice(0, 6);
    }
    return projects;
  });

  // Contact Form
  fb = inject(FormBuilder);
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    message: ['', Validators.required]
  });
  
  formStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Scroll to Top State
  showScrollTop = signal(false);

  constructor() {
    // Listen for exit event from Admin component
    if (typeof window !== 'undefined') {
      window.addEventListener('closeAdmin', () => {
        this.showAdmin.set(false);
      });
      
      // Force Dark Mode
      document.documentElement.classList.add('dark');

      // Scroll Listener
      window.addEventListener('scroll', () => {
        this.showScrollTop.set(window.scrollY > 300);
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    // Welcome Animation Sequence
    setTimeout(() => {
      this.fadeOutWelcome.set(true);
      
      // Start counting up as the welcome screen fades
      this.animateExperienceCount();
      
      // Start typing animation
      this.startTyping();

      // Remove welcome from DOM after fade completes
      setTimeout(() => {
        this.showWelcome.set(false);
      }, 800); 
    }, 2000); 
  }

  // Theme logic removed as per request
  
  startTyping() {
    let i = 0;
    const type = () => {
      if (i < this.fullText.length) {
        this.typingText.update(t => t + this.fullText.charAt(i));
        i++;
        setTimeout(type, 50); // Typing speed
      }
    };
    type();
  }

  setProjectType(type: string) {
    this.projectType.set(type);
  }

  animateExperienceCount() {
    const target = 5; // Target years of experience
    const duration = 1500; // Animation duration in ms
    const steps = 20; // Number of updates
    const intervalTime = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current++;
      this.experienceCount.set(current);
      
      if (current >= target) {
        clearInterval(timer);
      }
    }, intervalTime);
  }

  onAdminShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.toggleAdmin();
  }

  toggleAdmin() {
    this.showAdmin.update(v => !v);
  }

  toggleMobileMenu() {
    if (this.mobileMenuOpen()) {
      this.closeMobileMenu();
    } else {
      this.mobileMenuOpen.set(true);
      document.body.style.overflow = 'hidden';
    }
  }

  closeMobileMenu() {
    if (this.mobileMenuOpen()) {
      this.closingMenu.set(true);
      setTimeout(() => {
        this.mobileMenuOpen.set(false);
        this.closingMenu.set(false);
        document.body.style.overflow = '';
      }, 300); // Matches fadeOut animation duration
    }
  }

  scrollToSection(sectionId: string) {
    // Close mobile menu if open
    this.closeMobileMenu();

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  openProject(project: Project) {
    this.selectedProject.set(project);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeProject() {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  openBlog(blog: BlogPost) {
    this.selectedBlog.set(blog);
    document.body.style.overflow = 'hidden';
  }

  closeBlog() {
    this.selectedBlog.set(null);
    document.body.style.overflow = '';
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  printResume() {
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Jahidur_Rahman_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  submitMessage() {
    if (this.contactForm.valid) {
      this.formStatus.set('sending');
      
      const val = this.contactForm.value;
      const newMessage: Message = {
        id: Date.now().toString(),
        name: val.name || 'Anonymous',
        email: val.email || 'No Email',
        phone: val.phone || 'No Phone',
        message: val.message || '',
        date: new Date().toLocaleDateString(),
        read: false
      };

      // Simulate network delay
      setTimeout(() => {
        this.resumeService.addMessage(newMessage);
        this.formStatus.set('success');
        this.contactForm.reset();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          this.formStatus.set('idle');
        }, 3000);
      }, 1000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
