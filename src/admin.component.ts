
import { Component, signal, inject, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from './resume.service';
import { Experience, Profile, Project, SkillSet, BlogPost } from './app.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] bg-slate-950 text-slate-200 overflow-hidden flex flex-col">
      
      <!-- Top Header -->
      <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <h1 class="font-bold text-lg tracking-tight text-white">Admin Dashboard</h1>
        </div>
        <div class="flex items-center gap-4">
          <button (click)="closeAdmin()" class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Back to Site
          </button>
        </div>
      </header>

      @if (!isAuthenticated()) {
        <!-- Login Screen -->
        <div class="flex-1 flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p class="text-slate-400 text-sm">Please enter your credentials to manage content.</p>
            </div>
            
            <form (submit)="login($event)">
              <div class="mb-6 w-full group">
                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Password</label>
                <div class="relative">
                  <input type="password" [(ngModel)]="passwordInput" name="password" 
                         class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"
                         placeholder="••••••••">
                </div>
                @if (loginError()) {
                  <p class="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Incorrect password.
                  </p>
                }
              </div>
              <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                Login
              </button>
              <p class="text-center text-slate-600 text-xs mt-6">Default password is 'admin'</p>
            </form>
          </div>
        </div>
      } @else {
        <!-- Main Dashboard Layout -->
        <div class="flex-1 flex overflow-hidden">
          
          <!-- Sidebar Navigation -->
          <nav class="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
            <div class="p-4 space-y-1">
              @for (tab of tabs; track tab) {
                <button (click)="setActiveTab(tab)"
                        [class.bg-blue-600]="activeTab() === tab"
                        [class.text-white]="activeTab() === tab"
                        [class.text-slate-400]="activeTab() !== tab"
                        [class.hover:bg-slate-800]="activeTab() !== tab"
                        class="w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3">
                  {{ tab | titlecase }}
                </button>
              }
            </div>
          </nav>

          <!-- Mobile Nav (Top) -->
          <nav class="md:hidden flex overflow-x-auto bg-slate-900 border-b border-slate-800 absolute top-16 left-0 right-0 z-10">
            @for (tab of tabs; track tab) {
              <button (click)="setActiveTab(tab)"
                      [class.border-blue-500]="activeTab() === tab"
                      [class.text-blue-400]="activeTab() === tab"
                      [class.border-transparent]="activeTab() !== tab"
                      class="px-6 py-4 border-b-2 whitespace-nowrap font-medium text-sm transition-colors">
                {{ tab | titlecase }}
              </button>
            }
          </nav>

          <!-- Content Area -->
          <main class="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 pt-20 md:pt-8 scroll-smooth">
            <div class="max-w-4xl mx-auto space-y-8 pb-20">
              
              <!-- Profile Tab -->
              @if (activeTab() === 'profile') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-end">
                    <div>
                      <h2 class="text-2xl font-bold text-white">Profile Information</h2>
                      <p class="text-slate-400 text-sm mt-1">Manage your personal details and summary.</p>
                    </div>
                  </div>

                  <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Full Name</label>
                          <input [(ngModel)]="localProfile.name" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Professional Title</label>
                          <input [(ngModel)]="localProfile.title" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Email Address</label>
                          <input [(ngModel)]="localProfile.email" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Phone Number</label>
                          <input [(ngModel)]="localProfile.phone" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Location</label>
                          <input [(ngModel)]="localProfile.location" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">LinkedIn URL (Plain)</label>
                          <input [(ngModel)]="localProfile.linkedin" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                     </div>

                     <div class="w-full group mb-6">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Professional Summary</label>
                        <textarea [(ngModel)]="localProfile.summary" rows="6" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm font-normal"></textarea>
                     </div>

                     <div class="flex justify-end pt-4 border-t border-slate-800">
                        <button (click)="saveProfile()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Profile</button>
                     </div>
                  </div>
                </div>
              }

              <!-- Experience Tab -->
              @if (activeTab() === 'experience') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Experience</h2>
                    <button (click)="addNewExperience()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700 transition-all">
                      + Add Position
                    </button>
                  </div>

                  <div class="space-y-4">
                    @for (exp of resumeService.experiences(); track exp.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden" [class.ring-2]="expandedId() === exp.id" [class.ring-blue-600]="expandedId() === exp.id">
                        
                        <!-- List Item -->
                        @if (expandedId() !== exp.id) {
                          <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50" (click)="editExperience(exp)">
                            <div class="flex items-center gap-4">
                               <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">{{ exp.company.substring(0,2) | uppercase }}</div>
                               <div>
                                 <h3 class="font-bold text-white">{{ exp.role }}</h3>
                                 <p class="text-sm text-blue-400">{{ exp.company }}</p>
                               </div>
                            </div>
                            <button class="text-blue-500 hover:text-blue-400 text-sm font-medium px-3 py-1">Edit</button>
                          </div>
                        }

                        <!-- Edit Form -->
                        @if (expandedId() === exp.id && editingExperience()) {
                          <div class="p-6 bg-slate-900/50 animate-fade-in-down">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Role</label><input [(ngModel)]="editingExperience()!.role" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Company</label><input [(ngModel)]="editingExperience()!.company" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Period</label><input [(ngModel)]="editingExperience()!.period" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Skills Used (comma separated)</label>
                                <input [ngModel]="editingExperience()!.skills_used.join(', ')" (ngModelChange)="updateListString($event, editingExperience()!, 'skills_used')" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                              </div>
                            </div>
                            
                            <div class="group mb-6">
                              <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Achievements (One per line)</label>
                              <textarea [ngModel]="editingExperience()!.description.join('\n')" (ngModelChange)="updateListLines($event, editingExperience()!, 'description')" rows="5" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm font-mono"></textarea>
                            </div>

                            <div class="flex items-center justify-between pt-4 border-t border-slate-800">
                               <button (click)="resumeService.deleteExperience(exp.id)" class="text-red-500 hover:text-red-400 text-sm font-bold px-3 py-2">Delete Position</button>
                               <div class="flex gap-3">
                                 <button (click)="cancelEdit()" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                 <button (click)="saveExperience()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Position</button>
                               </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Projects Tab -->
              @if (activeTab() === 'projects') {
                <div class="space-y-6 animate-fade-in">
                   <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Projects</h2>
                    <button (click)="addNewProject()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700 transition-all">+ Add Project</button>
                  </div>

                  <div class="grid grid-cols-1 gap-6">
                    @for (proj of resumeService.projects(); track proj.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden" [class.ring-2]="expandedId() === proj.id" [class.ring-blue-600]="expandedId() === proj.id">
                         
                         <!-- List Item -->
                         @if (expandedId() !== proj.id) {
                           <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50" (click)="editProject(proj)">
                             <div class="flex items-center gap-4">
                               <div class="w-16 h-10 rounded bg-slate-800 overflow-hidden border border-slate-700">
                                 @if (proj.imageUrl) { <img [src]="proj.imageUrl" class="w-full h-full object-cover opacity-75"> }
                               </div>
                               <div>
                                 <h3 class="font-bold text-white">{{ proj.title }}</h3>
                                 <p class="text-xs text-slate-500">{{ proj.role }}</p>
                               </div>
                             </div>
                             <button class="text-blue-500 hover:text-blue-400 text-sm font-medium px-3 py-1">Edit</button>
                           </div>
                         }

                         <!-- Edit Form -->
                         @if (expandedId() === proj.id && editingProject()) {
                           <div class="p-6 bg-slate-900/50 animate-fade-in-down">
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Title</label><input [(ngModel)]="editingProject()!.title" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Role</label><input [(ngModel)]="editingProject()!.role" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Image URL</label><input [(ngModel)]="editingProject()!.imageUrl" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Link</label><input [(ngModel)]="editingProject()!.link" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="md:col-span-2 group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Technologies (comma separated)</label>
                                  <input [ngModel]="editingProject()!.technologies.join(', ')" (ngModelChange)="updateListString($event, editingProject()!, 'technologies')" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
                              </div>

                              <div class="space-y-6 mb-6">
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Short Description</label><textarea [(ngModel)]="editingProject()!.description" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea></div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-red-400">Challenge</label><textarea [(ngModel)]="editingProject()!.challenge" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea></div>
                                  <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-400">Solution</label><textarea [(ngModel)]="editingProject()!.solution" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea></div>
                                </div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-emerald-400">Outcomes (One per line)</label>
                                  <textarea [ngModel]="editingProject()!.results ? editingProject()!.results!.join('\n') : ''" (ngModelChange)="updateListLines($event, editingProject()!, 'results')" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm font-mono"></textarea>
                                </div>
                              </div>

                              <div class="flex items-center justify-between pt-4 border-t border-slate-800">
                                 <button (click)="resumeService.deleteProject(proj.id)" class="text-red-500 hover:text-red-400 text-sm font-bold px-3 py-2">Delete Project</button>
                                 <div class="flex gap-3">
                                   <button (click)="cancelEdit()" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                   <button (click)="saveProject()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Project</button>
                                 </div>
                              </div>
                           </div>
                         }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Insights (Blog) Tab -->
              @if (activeTab() === 'insights') {
                <div class="space-y-6 animate-fade-in">
                   <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Insights & Articles</h2>
                    <button (click)="addNewBlog()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700 transition-all">+ Add Insight</button>
                  </div>

                  <div class="grid grid-cols-1 gap-6">
                    @for (blog of resumeService.blogs(); track blog.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden" [class.ring-2]="expandedId() === blog.id" [class.ring-blue-600]="expandedId() === blog.id">
                         
                         <!-- List Item -->
                         @if (expandedId() !== blog.id) {
                           <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50" (click)="editBlog(blog)">
                             <div class="flex items-center gap-4">
                               <div class="w-16 h-10 rounded bg-slate-800 overflow-hidden border border-slate-700">
                                 @if (blog.imageUrl) { <img [src]="blog.imageUrl" class="w-full h-full object-cover opacity-75"> }
                               </div>
                               <div>
                                 <h3 class="font-bold text-white">{{ blog.title }}</h3>
                                 <p class="text-xs text-slate-500">{{ blog.date }}</p>
                               </div>
                             </div>
                             <button class="text-blue-500 hover:text-blue-400 text-sm font-medium px-3 py-1">Edit</button>
                           </div>
                         }

                         <!-- Edit Form -->
                         @if (expandedId() === blog.id && editingBlog()) {
                           <div class="p-6 bg-slate-900/50 animate-fade-in-down">
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div class="md:col-span-2 group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Title</label><input [(ngModel)]="editingBlog()!.title" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Category</label><input [(ngModel)]="editingBlog()!.category" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Date</label><input [(ngModel)]="editingBlog()!.date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Read Time</label><input [(ngModel)]="editingBlog()!.readTime" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Image URL</label><input [(ngModel)]="editingBlog()!.imageUrl" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                              </div>

                              <div class="space-y-6 mb-6">
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Excerpt</label><textarea [(ngModel)]="editingBlog()!.excerpt" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea></div>
                                
                                <!-- Rich Text Editor -->
                                <div class="group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-400">Content (HTML Supported)</label>
                                  <div class="flex flex-col border border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                      <!-- Toolbar -->
                                      <div class="flex items-center gap-1 bg-slate-900 border-b border-slate-800 p-2 select-none">
                                         <span class="text-xs font-bold text-slate-500 uppercase mr-2 ml-1">Format</span>
                                         <button type="button" (click)="insertFormat(blogContent, 'b')" class="p-1.5 min-w-[32px] rounded hover:bg-slate-800 text-slate-300 font-bold text-sm transition-colors" title="Bold">B</button>
                                         <button type="button" (click)="insertFormat(blogContent, 'i')" class="p-1.5 min-w-[32px] rounded hover:bg-slate-800 text-slate-300 italic text-sm transition-colors" title="Italic">I</button>
                                         <div class="w-px h-4 bg-slate-700 mx-1"></div>
                                         <button type="button" (click)="insertFormat(blogContent, 'h3')" class="p-1.5 min-w-[32px] rounded hover:bg-slate-800 text-slate-300 font-bold text-sm transition-colors" title="Heading 3">H3</button>
                                         <button type="button" (click)="insertFormat(blogContent, 'p')" class="p-1.5 min-w-[32px] rounded hover:bg-slate-800 text-slate-300 text-sm transition-colors" title="Paragraph">P</button>
                                         <div class="w-px h-4 bg-slate-700 mx-1"></div>
                                         <button type="button" (click)="insertFormat(blogContent, 'ul')" class="p-1.5 min-w-[32px] rounded hover:bg-slate-800 text-slate-300 text-sm flex items-center justify-center gap-1 transition-colors" title="List">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                         </button>
                                      </div>
                                      <!-- Editor -->
                                      <textarea #blogContent 
                                                [(ngModel)]="editingBlog()!.content" 
                                                rows="16" 
                                                class="w-full bg-slate-950 p-4 text-white focus:outline-none text-sm font-mono resize-y placeholder-slate-600 leading-relaxed"
                                                placeholder="Write your HTML content here..."></textarea>
                                  </div>
                                  <div class="flex justify-between mt-2 px-1">
                                    <p class="text-xs text-slate-500">Use the toolbar to insert tags. Valid HTML allowed.</p>
                                  </div>
                                </div>
                              </div>

                              <div class="flex items-center justify-between pt-4 border-t border-slate-800">
                                 <button (click)="resumeService.deleteBlog(blog.id)" class="text-red-500 hover:text-red-400 text-sm font-bold px-3 py-2">Delete Insight</button>
                                 <div class="flex gap-3">
                                   <button (click)="cancelEdit()" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                   <button (click)="saveBlog()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Insight</button>
                                 </div>
                              </div>
                           </div>
                         }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Skills Tab -->
              @if (activeTab() === 'skills') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Skills</h2>
                  </div>

                  <div class="space-y-6">
                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="group">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-500">Technical Skills (comma separated)</label>
                        <textarea [(ngModel)]="localSkills.technical" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="group">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-indigo-500">Analytical Skills (comma separated)</label>
                        <textarea [(ngModel)]="localSkills.analytical" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="group">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-purple-500">Soft Skills (comma separated)</label>
                        <textarea [(ngModel)]="localSkills.soft" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>
                    
                    <div class="flex justify-end pt-4 border-t border-slate-800">
                       <button (click)="saveSkills()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Skills</button>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Settings Tab -->
              @if (activeTab() === 'settings') {
                <div class="space-y-6 animate-fade-in">
                  <h2 class="text-2xl font-bold text-white">Admin Settings</h2>
                  <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 max-w-lg">
                    <h3 class="text-white font-bold mb-6">Change Password</h3>
                    <div class="space-y-4">
                      <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Current Password</label><input type="password" [(ngModel)]="currentPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                      <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">New Password</label><input type="password" [(ngModel)]="newPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                       <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Confirm New Password</label><input type="password" [(ngModel)]="confirmPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                      @if (passMsg) {
                        <div [class.text-red-400]="passError" [class.text-emerald-400]="!passError" class="text-sm font-medium mt-2">{{ passMsg }}</div>
                      }
                      <button (click)="changePassword()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95 w-full mt-4">Update Password</button>
                    </div>
                  </div>
                </div>
              }

            </div>
          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 0.2s ease-out forwards;
    }
  `]
})
export class AdminComponent {
  resumeService = inject(ResumeService);
  
  isAuthenticated = signal(false);
  loginError = signal(false);
  passwordInput = '';
  
  // Renamed 'blog' to 'insights'
  activeTab = signal<'profile' | 'experience' | 'projects' | 'insights' | 'skills' | 'settings'>('profile');
  tabs = ['profile', 'experience', 'projects', 'insights', 'skills', 'settings'];
  
  // Edit Buffers (Copies of data to edit)
  expandedId = signal<string | null>(null);
  editingExperience = signal<Experience | null>(null);
  editingProject = signal<Project | null>(null);
  editingBlog = signal<BlogPost | null>(null);
  
  localProfile: Profile = { ...this.resumeService.profile() };
  localSkills = { technical: '', analytical: '', soft: '' };

  constructor() {
    effect(() => {
      // Keep local profile somewhat in sync if external changes happen, 
      // but primarily it's a buffer.
      // Note: We avoid overwriting user edits here.
    });
  }

  setActiveTab(tab: any) {
    this.activeTab.set(tab);
    if (tab === 'skills') {
      const s = this.resumeService.skills();
      this.localSkills = {
        technical: s.technical.join(', '),
        analytical: s.analytical.join(', '),
        soft: s.soft.join(', ')
      };
    }
    this.cancelEdit(); // Reset any open edits
  }

  closeAdmin() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('closeAdmin'));
    }
  }

  login(e: Event) {
    e.preventDefault();
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_password') : null;
    const validPass = stored || 'admin';
    if (this.passwordInput === validPass) {
      this.isAuthenticated.set(true);
      this.loginError.set(false);
      this.localProfile = JSON.parse(JSON.stringify(this.resumeService.profile()));
    } else {
      this.loginError.set(true);
    }
  }

  // --- CRUD Actions ---

  // Profile
  saveProfile() {
    this.resumeService.updateProfile(this.localProfile);
    alert('Profile updated successfully!');
  }

  // Experience
  addNewExperience() {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: 'New Role',
      company: 'Company Name',
      period: 'Period',
      description: ['New achievement'],
      skills_used: []
    };
    this.resumeService.addExperience(newExp);
    // Immediately open for editing
    this.editExperience(newExp);
  }

  editExperience(exp: Experience) {
    this.editingExperience.set(JSON.parse(JSON.stringify(exp))); // Deep copy
    this.expandedId.set(exp.id);
  }

  saveExperience() {
    if (this.editingExperience()) {
      this.resumeService.updateExperience(this.editingExperience()!);
      this.cancelEdit();
    }
  }

  // Projects
  addNewProject() {
    const newProj: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project summary...',
      technologies: [],
      imageUrl: '',
      results: []
    };
    this.resumeService.addProject(newProj);
    this.editProject(newProj);
  }

  editProject(proj: Project) {
    this.editingProject.set(JSON.parse(JSON.stringify(proj)));
    this.expandedId.set(proj.id);
  }

  saveProject() {
    if (this.editingProject()) {
      this.resumeService.updateProject(this.editingProject()!);
      this.cancelEdit();
    }
  }

  // Blog
  addNewBlog() {
    const newBlog: BlogPost = {
      id: Date.now().toString(),
      title: 'New Insight',
      category: 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      excerpt: 'Brief summary...',
      content: '<p>Write your content here...</p>'
    };
    this.resumeService.addBlog(newBlog);
    this.editBlog(newBlog);
  }

  editBlog(blog: BlogPost) {
    this.editingBlog.set(JSON.parse(JSON.stringify(blog)));
    this.expandedId.set(blog.id);
  }

  saveBlog() {
    if (this.editingBlog()) {
      this.resumeService.updateBlog(this.editingBlog()!);
      this.cancelEdit();
    }
  }
  
  // Rich Text Editor Helpers
  insertFormat(textArea: HTMLTextAreaElement, format: string) {
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;
    const selected = text.substring(start, end);
    let replacement = '';

    switch(format) {
      case 'b': replacement = `<b>${selected || 'bold'}</b>`; break;
      case 'i': replacement = `<i>${selected || 'italic'}</i>`; break;
      case 'h3': replacement = `\n<h3>${selected || 'Header'}</h3>\n`; break;
      case 'p': replacement = `\n<p>${selected || 'Paragraph'}</p>\n`; break;
      case 'ul': replacement = `\n<ul>\n  <li>${selected || 'Item'}</li>\n</ul>\n`; break;
    }
    
    // Insert text
    textArea.setRangeText(replacement, start, end, 'select');
    // Manually trigger input event to update ngModel
    textArea.dispatchEvent(new Event('input'));
  }

  // Skills
  saveSkills() {
    this.resumeService.updateSkills({
      technical: this.localSkills.technical.split(',').map(s=>s.trim()).filter(Boolean),
      analytical: this.localSkills.analytical.split(',').map(s=>s.trim()).filter(Boolean),
      soft: this.localSkills.soft.split(',').map(s=>s.trim()).filter(Boolean),
    });
    alert('Skills updated!');
  }

  // --- Helpers ---
  cancelEdit() {
    this.expandedId.set(null);
    this.editingExperience.set(null);
    this.editingProject.set(null);
    this.editingBlog.set(null);
  }

  updateListString(text: string, obj: any, field: string) {
    obj[field] = text.split(',').map(s => s.trim()).filter(s => s !== '');
  }

  updateListLines(text: string, obj: any, field: string) {
    obj[field] = text.split('\n').filter(s => s.trim() !== '');
  }

  // Password
  currentPass = ''; newPass = ''; confirmPass = ''; passMsg = ''; passError = false;
  changePassword() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_password') : null;
    const validPass = stored || 'admin';
    this.passMsg = '';
    
    if (this.currentPass !== validPass) { this.passMsg = 'Current password incorrect'; this.passError = true; return; }
    if (this.newPass !== this.confirmPass) { this.passMsg = 'New passwords do not match'; this.passError = true; return; }
    if (!this.newPass) { this.passMsg = 'Password cannot be empty'; this.passError = true; return; }
    
    if (typeof localStorage !== 'undefined') localStorage.setItem('portfolio_password', this.newPass);
    this.passMsg = 'Password updated successfully';
    this.passError = false;
    this.currentPass = ''; this.newPass = ''; this.confirmPass = '';
  }
}
