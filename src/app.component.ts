
import { Component, signal, ChangeDetectionStrategy, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from './resume.service';
import { AdminComponent } from './admin.component';
import { Project, BlogPost } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AdminComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styles: [`
    :host {
      display: block;
    }
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
  `]
})
export class AppComponent {
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
  
  // Mobile Menu State
  mobileMenuOpen = signal(false);
  
  // Project Modal State
  selectedProject = signal<Project | null>(null);

  // Blog State
  selectedBlog = signal<BlogPost | null>(null);
  selectedCategory = signal<string>('All');
  
  blogCategories = computed(() => {
    const allCats = this.blogs().map(b => b.category).filter(Boolean);
    const unique = Array.from(new Set(allCats)).sort();
    return ['All', ...unique];
  });

  filteredBlogs = computed(() => {
    if (this.selectedCategory() === 'All') {
      return this.blogs();
    }
    return this.blogs().filter(b => b.category === this.selectedCategory());
  });

  // Derived stats
  stats = signal([
    { label: 'Years Experience', value: '5+', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Team Leadership', value: 'Manager', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Core Tech', value: 'SQL & Python', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { label: 'Domain', value: 'E-commerce', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' }
  ]);

  constructor() {
    // Listen for exit event from Admin component
    if (typeof window !== 'undefined') {
      window.addEventListener('closeAdmin', () => {
        this.showAdmin.set(false);
      });
    }
  }

  // Keyboard shortcut to toggle admin: Ctrl + .
  @HostListener('window:keydown.control.period', ['$event'])
  onAdminShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.toggleAdmin();
  }

  toggleAdmin() {
    this.showAdmin.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  scrollToSection(sectionId: string) {
    // Close mobile menu if open
    this.closeMobileMenu();

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
}
