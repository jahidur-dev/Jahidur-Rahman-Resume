import { Component, signal, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from './resume.service';
import { AdminComponent } from './admin.component';
import { Project } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AdminComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
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

  currentYear = new Date().getFullYear();
  showAdmin = signal(false);
  
  // Project Modal State
  selectedProject = signal<Project | null>(null);

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

  scrollToSection(sectionId: string) {
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
}