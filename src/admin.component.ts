import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from './resume.service';
import { Experience, Profile, Project, SkillSet } from './app.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-95 z-[100] overflow-y-auto">
      <div class="min-h-screen p-4 md:p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 max-w-5xl mx-auto">
          <h1 class="text-3xl font-bold text-white flex items-center gap-2">
            <span class="bg-blue-600 text-white px-3 py-1 rounded text-lg">ADMIN</span>
            Dashboard
          </h1>
          <button (click)="closeAdmin()" class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
            Exit to Site
          </button>
        </div>

        @if (!isAuthenticated()) {
          <!-- Login Screen -->
          <div class="max-w-md mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl mt-20">
            <h2 class="text-xl font-bold text-white mb-6">Login to Edit Portfolio</h2>
            <form (submit)="login($event)">
              <div class="mb-6">
                <label class="block text-slate-400 text-sm font-bold mb-2">Password</label>
                <input type="password" [(ngModel)]="passwordInput" name="password" 
                       class="w-full bg-slate-900 border border-slate-600 rounded px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                       placeholder="Enter password (default: admin)">
                @if (loginError()) {
                  <p class="text-red-500 text-sm mt-2">Incorrect password.</p>
                }
              </div>
              <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors">
                Login
              </button>
            </form>
          </div>
        } @else {
          <!-- Main Dashboard -->
          <div class="max-w-5xl mx-auto bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
            <!-- Tabs -->
            <div class="flex border-b border-slate-700 overflow-x-auto">
              @for (tab of tabs; track tab) {
                <button (click)="activeTab.set(tab)"
                        [class.bg-slate-700]="activeTab() === tab"
                        [class.text-blue-400]="activeTab() === tab"
                        [class.text-slate-400]="activeTab() !== tab"
                        class="px-6 py-4 font-medium hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap">
                  {{ tab | titlecase }}
                </button>
              }
            </div>

            <div class="p-6 md:p-8">
              <!-- Profile Tab -->
              @if (activeTab() === 'profile') {
                <div class="space-y-6">
                  <h3 class="text-xl font-bold text-white mb-4">Edit Profile</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">Full Name</label>
                      <input [(ngModel)]="localProfile.name" class="admin-input">
                    </div>
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">Title / Headline</label>
                      <input [(ngModel)]="localProfile.title" class="admin-input">
                    </div>
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">Email</label>
                      <input [(ngModel)]="localProfile.email" class="admin-input">
                    </div>
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">Phone</label>
                      <input [(ngModel)]="localProfile.phone" class="admin-input">
                    </div>
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">Location</label>
                      <input [(ngModel)]="localProfile.location" class="admin-input">
                    </div>
                    <div>
                      <label class="block text-slate-400 text-xs uppercase mb-1">LinkedIn (No https://)</label>
                      <input [(ngModel)]="localProfile.linkedin" class="admin-input">
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-slate-400 text-xs uppercase mb-1">Summary</label>
                      <textarea [(ngModel)]="localProfile.summary" rows="4" class="admin-input"></textarea>
                    </div>
                  </div>
                  <button (click)="saveProfile()" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold">Save Profile</button>
                </div>
              }

              <!-- Experience Tab -->
              @if (activeTab() === 'experience') {
                <div class="space-y-8">
                  <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">Experience List</h3>
                    <button (click)="addNewExperience()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                      + Add New
                    </button>
                  </div>

                  @for (exp of resumeService.experiences(); track exp.id) {
                    <div class="bg-slate-900 p-6 rounded-lg border border-slate-700 relative group">
                      <button (click)="resumeService.deleteExperience(exp.id)" class="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity">Delete</button>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input [(ngModel)]="exp.role" class="admin-input font-bold text-lg" placeholder="Role">
                        <input [(ngModel)]="exp.company" class="admin-input text-blue-400" placeholder="Company">
                        <input [(ngModel)]="exp.period" class="admin-input text-sm" placeholder="Period">
                        <input [ngModel]="exp.skills_used.join(', ')" (ngModelChange)="updateExpSkills(exp, $event)" class="admin-input text-sm" placeholder="Skills (comma separated)">
                      </div>
                      
                      <div class="space-y-2">
                        <label class="block text-slate-500 text-xs">Bullet Points (One per line)</label>
                        <textarea [ngModel]="exp.description.join('\n')" (ngModelChange)="updateExpDesc(exp, $event)" rows="4" class="admin-input font-mono text-sm"></textarea>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Projects Tab -->
              @if (activeTab() === 'projects') {
                <div class="space-y-8">
                   <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">Projects</h3>
                    <button (click)="addNewProject()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                      + Add New
                    </button>
                  </div>

                  @for (proj of resumeService.projects(); track proj.id) {
                    <div class="bg-slate-900 p-6 rounded-lg border border-slate-700 relative group">
                      <button (click)="resumeService.deleteProject(proj.id)" class="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity">Delete</button>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input [(ngModel)]="proj.title" class="admin-input font-bold text-lg" placeholder="Project Title">
                        <input [(ngModel)]="proj.link" class="admin-input text-blue-400" placeholder="Link URL">
                        <input [(ngModel)]="proj.imageUrl" class="admin-input text-sm" placeholder="Image URL">
                        <input [ngModel]="proj.technologies.join(', ')" (ngModelChange)="updateProjTech(proj, $event)" class="admin-input text-sm" placeholder="Tech Stack (comma separated)">
                        <input [(ngModel)]="proj.role" class="admin-input text-sm" placeholder="My Role (e.g. Lead Analyst)">
                      </div>
                      
                      <div class="space-y-4">
                         <div>
                            <label class="block text-slate-400 text-xs uppercase mb-1">Short Description</label>
                            <textarea [(ngModel)]="proj.description" rows="2" class="admin-input text-sm" placeholder="Summary for card..."></textarea>
                         </div>
                         
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label class="block text-slate-400 text-xs uppercase mb-1">Challenge</label>
                               <textarea [(ngModel)]="proj.challenge" rows="4" class="admin-input text-sm" placeholder="The problem..."></textarea>
                            </div>
                             <div>
                               <label class="block text-slate-400 text-xs uppercase mb-1">Solution</label>
                               <textarea [(ngModel)]="proj.solution" rows="4" class="admin-input text-sm" placeholder="The approach..."></textarea>
                            </div>
                         </div>

                         <div>
                            <label class="block text-slate-400 text-xs uppercase mb-1">Key Results (One per line)</label>
                            <textarea [ngModel]="proj.results ? proj.results.join('\n') : ''" 
                                      (ngModelChange)="updateProjResults(proj, $event)" 
                                      rows="4" class="admin-input text-sm" placeholder="- Result 1\n- Result 2"></textarea>
                         </div>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Skills Tab -->
              @if (activeTab() === 'skills') {
                <div class="space-y-6">
                  <h3 class="text-xl font-bold text-white">Edit Skills</h3>
                  
                  <div>
                    <label class="block text-blue-400 font-bold mb-2">Technical Skills (Comma separated)</label>
                    <textarea [ngModel]="resumeService.skills().technical.join(', ')" 
                              (ngModelChange)="updateSkillCategory('technical', $event)"
                              rows="3" class="admin-input"></textarea>
                  </div>

                  <div>
                    <label class="block text-indigo-400 font-bold mb-2">Analytical Skills</label>
                    <textarea [ngModel]="resumeService.skills().analytical.join(', ')" 
                              (ngModelChange)="updateSkillCategory('analytical', $event)"
                              rows="3" class="admin-input"></textarea>
                  </div>

                  <div>
                    <label class="block text-purple-400 font-bold mb-2">Soft Skills</label>
                    <textarea [ngModel]="resumeService.skills().soft.join(', ')" 
                              (ngModelChange)="updateSkillCategory('soft', $event)"
                              rows="3" class="admin-input"></textarea>
                  </div>
                </div>
              }

            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-input {
      @apply w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors;
    }
  `]
})
export class AdminComponent {
  resumeService = inject(ResumeService);
  
  isAuthenticated = signal(false);
  loginError = signal(false);
  passwordInput = '';
  
  activeTab = signal<'profile' | 'experience' | 'projects' | 'skills' | 'education'>('profile');
  tabs = ['profile', 'experience', 'projects', 'skills'];

  localProfile: Profile = { ...this.resumeService.profile() };

  closeAdmin() {
    const event = new CustomEvent('closeAdmin');
    window.dispatchEvent(event);
  }

  login(e: Event) {
    e.preventDefault();
    if (this.passwordInput === 'admin') {
      this.isAuthenticated.set(true);
      this.loginError.set(false);
      this.localProfile = { ...this.resumeService.profile() };
    } else {
      this.loginError.set(true);
    }
  }

  saveProfile() {
    this.resumeService.updateProfile(this.localProfile);
    alert('Profile saved!');
  }

  updateExpDesc(exp: Experience, text: string) {
    const newDesc = text.split('\n').filter(line => line.trim() !== '');
    const updated = { ...exp, description: newDesc };
    this.resumeService.updateExperience(updated);
  }

  updateExpSkills(exp: Experience, text: string) {
    const newSkills = text.split(',').map(s => s.trim()).filter(s => s !== '');
    const updated = { ...exp, skills_used: newSkills };
    this.resumeService.updateExperience(updated);
  }

  addNewExperience() {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: 'New Role',
      company: 'Company Name',
      period: '2024 - Present',
      description: ['New achievement'],
      skills_used: ['Skill 1']
    };
    this.resumeService.addExperience(newExp);
  }

  updateProjTech(proj: Project, text: string) {
    const newTech = text.split(',').map(s => s.trim()).filter(s => s !== '');
    const updated = { ...proj, technologies: newTech };
    this.resumeService.updateProject(updated);
  }

  updateProjResults(proj: Project, text: string) {
    const newResults = text.split('\n').filter(line => line.trim() !== '');
    const updated = { ...proj, results: newResults };
    this.resumeService.updateProject(updated);
  }

  addNewProject() {
    const newProj: Project = {
      id: Date.now().toString(),
      title: 'New Data Project',
      description: 'Description of the project...',
      technologies: ['SQL', 'Python'],
      imageUrl: 'https://picsum.photos/600/400',
      results: []
    };
    this.resumeService.addProject(newProj);
  }

  updateSkillCategory(category: keyof SkillSet, text: string) {
    const list = text.split(',').map(s => s.trim()).filter(s => s !== '');
    const currentSkills = this.resumeService.skills();
    const newSkills = { ...currentSkills, [category]: list };
    this.resumeService.updateSkills(newSkills);
  }
}