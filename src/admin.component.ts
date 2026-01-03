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
    <div class="fixed inset-0 z-[100] bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans">
      
      <!-- Top Header -->
      <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <h1 class="font-bold text-lg tracking-tight text-white">Admin Dashboard</h1>
        </div>
        <div class="flex items-center gap-4">
           @if (isAuthenticated()) {
             <span class="text-xs text-slate-500 hidden sm:block">Changes save automatically</span>
           }
          <button (click)="closeAdmin()" class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Preview Site
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
                         class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600"
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
              <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-blue-900/20">
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
                <button (click)="activeTab.set(tab)"
                        [class.bg-blue-600]="activeTab() === tab"
                        [class.text-white]="activeTab() === tab"
                        [class.text-slate-400]="activeTab() !== tab"
                        [class.hover:bg-slate-800]="activeTab() !== tab"
                        class="w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3">
                  <!-- Icons based on tab -->
                  @switch (tab) {
                    @case ('profile') {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    }
                    @case ('experience') {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    }
                    @case ('projects') {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    }
                    @case ('skills') {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    }
                    @case ('settings') {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                  }
                  {{ tab | titlecase }}
                </button>
              }
            </div>
            
            <div class="mt-auto p-4 border-t border-slate-800">
              <div class="text-xs text-slate-500 text-center">
                Portfolio Admin v1.1
              </div>
            </div>
          </nav>

          <!-- Mobile Nav (Top) -->
          <nav class="md:hidden flex overflow-x-auto bg-slate-900 border-b border-slate-800 absolute top-16 left-0 right-0 z-10">
            @for (tab of tabs; track tab) {
              <button (click)="activeTab.set(tab)"
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
                    <button (click)="saveProfile()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all">
                      Save Changes
                    </button>
                  </div>

                  <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
                     <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.627-1.008 2.228a1 1 0 00.518 1.688l.68.172c2.933.742 5.093 3.42 5.093 6.55A3.003 3.003 0 0113.824 19H10.176a3.003 3.003 0 01-3.009-3.362 7.002 7.002 0 015.093-6.55l.68-.172a1 1 0 00.518-1.688A2.96 2.96 0 0110 6z" /></svg>
                       Contact Details
                     </h3>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
                    <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                       About Summary
                     </h3>
                    <div class="w-full group">
                      <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Professional Summary</label>
                      <textarea [(ngModel)]="localProfile.summary" rows="6" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all placeholder-slate-600 text-sm leading-relaxed"></textarea>
                      <p class="text-xs text-slate-500 mt-2 text-right">Visible in the "About" section.</p>
                    </div>
                  </div>
                </div>
              }

              <!-- Experience Tab -->
              @if (activeTab() === 'experience') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-center">
                    <div>
                      <h2 class="text-2xl font-bold text-white">Experience</h2>
                      <p class="text-slate-400 text-sm mt-1">Manage your work history.</p>
                    </div>
                    <button (click)="addNewExperience()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                      Add Position
                    </button>
                  </div>

                  <div class="space-y-4">
                    @for (exp of resumeService.experiences(); track exp.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-200"
                           [class.ring-2]="expandedId() === exp.id" [class.ring-blue-600]="expandedId() === exp.id">
                        
                        <!-- Header (Click to expand) -->
                        <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors select-none"
                             (click)="toggleExpand(exp.id)">
                          <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                               {{ exp.company.substring(0,2) | uppercase }}
                             </div>
                             <div>
                               <h3 class="font-bold text-white">{{ exp.role }}</h3>
                               <p class="text-sm text-blue-400">{{ exp.company }} &bull; <span class="text-slate-500">{{ exp.period }}</span></p>
                             </div>
                          </div>
                          <div class="flex items-center gap-2">
                             @if (expandedId() === exp.id) {
                               <button (click)="resumeService.deleteExperience(exp.id); $event.stopPropagation()" class="text-red-500 hover:bg-red-900/30 p-2 rounded transition-colors mr-2" title="Delete">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                             }
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 transform transition-transform" [class.rotate-180]="expandedId() === exp.id" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                             </svg>
                          </div>
                        </div>

                        <!-- Expanded Form -->
                        @if (expandedId() === exp.id) {
                          <div class="p-6 border-t border-slate-800 bg-slate-900/50 animate-fade-in-down">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div class="w-full group">
                                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Role Title</label>
                                <input [(ngModel)]="exp.role" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                              </div>
                              <div class="w-full group">
                                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Company</label>
                                <input [(ngModel)]="exp.company" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                              </div>
                              <div class="w-full group">
                                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Time Period</label>
                                <input [(ngModel)]="exp.period" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm" placeholder="e.g. Jan 2020 - Present">
                              </div>
                              <div class="w-full group">
                                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Skills Used</label>
                                <input [ngModel]="exp.skills_used.join(', ')" (ngModelChange)="updateExpSkills(exp, $event)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm" placeholder="Comma separated">
                              </div>
                            </div>
                            
                            <div class="w-full group">
                              <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Key Achievements (One per line)</label>
                              <textarea [ngModel]="exp.description.join('\n')" (ngModelChange)="updateExpDesc(exp, $event)" rows="5" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm font-mono leading-relaxed"></textarea>
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
                    <div>
                      <h2 class="text-2xl font-bold text-white">Projects</h2>
                      <p class="text-slate-400 text-sm mt-1">Showcase your case studies.</p>
                    </div>
                    <button (click)="addNewProject()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                      Add Project
                    </button>
                  </div>

                  <div class="grid grid-cols-1 gap-6">
                    @for (proj of resumeService.projects(); track proj.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-200"
                           [class.ring-2]="expandedId() === proj.id" [class.ring-blue-600]="expandedId() === proj.id">
                        
                        <!-- Header -->
                         <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors select-none"
                             (click)="toggleExpand(proj.id)">
                           <div class="flex items-center gap-4">
                             <div class="w-16 h-10 rounded bg-slate-800 overflow-hidden border border-slate-700 relative">
                               @if (proj.imageUrl) {
                                 <img [src]="proj.imageUrl" class="w-full h-full object-cover opacity-75">
                               } @else {
                                 <div class="w-full h-full flex items-center justify-center text-xs text-slate-500">No Img</div>
                               }
                             </div>
                             <div>
                               <h3 class="font-bold text-white">{{ proj.title }}</h3>
                               <p class="text-xs text-slate-500 truncate max-w-[200px]">{{ proj.technologies.join(', ') }}</p>
                             </div>
                           </div>
                           <div class="flex items-center gap-2">
                             @if (expandedId() === proj.id) {
                               <button (click)="resumeService.deleteProject(proj.id); $event.stopPropagation()" class="text-red-500 hover:bg-red-900/30 p-2 rounded transition-colors mr-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                             }
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 transform transition-transform" [class.rotate-180]="expandedId() === proj.id" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                             </svg>
                           </div>
                         </div>

                         <!-- Content -->
                         @if (expandedId() === proj.id) {
                           <div class="p-6 border-t border-slate-800 bg-slate-900/50 animate-fade-in-down">
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div class="w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Project Title</label>
                                  <input [(ngModel)]="proj.title" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
                                <div class="w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Role</label>
                                  <input [(ngModel)]="proj.role" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm" placeholder="e.g. Lead Analyst">
                                </div>
                                <div class="w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Image URL</label>
                                  <input [(ngModel)]="proj.imageUrl" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
                                <div class="w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Link URL</label>
                                  <input [(ngModel)]="proj.link" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
                                <div class="col-span-1 md:col-span-2 w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Tech Stack</label>
                                  <input [ngModel]="proj.technologies.join(', ')" (ngModelChange)="updateProjTech(proj, $event)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm" placeholder="SQL, Python, PowerBI...">
                                </div>
                              </div>

                              <div class="space-y-6">
                                <div class="w-full group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Short Description (Card)</label>
                                  <textarea [(ngModel)]="proj.description" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div class="w-full group">
                                    <label class="block text-red-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-red-300 transition-colors">The Challenge</label>
                                    <textarea [(ngModel)]="proj.challenge" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                                  </div>
                                  <div class="w-full group">
                                    <label class="block text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-300 transition-colors">The Solution</label>
                                    <textarea [(ngModel)]="proj.solution" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                                  </div>
                                </div>

                                <div class="w-full group">
                                  <label class="block text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-emerald-300 transition-colors">Key Outcomes (One per line)</label>
                                  <textarea [ngModel]="proj.results ? proj.results.join('\n') : ''" 
                                            (ngModelChange)="updateProjResults(proj, $event)" 
                                            rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder-slate-600 text-sm font-mono"></textarea>
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
                  <div>
                    <h2 class="text-2xl font-bold text-white">Skills & Expertise</h2>
                    <p class="text-slate-400 text-sm mt-1">Update your technical keywords.</p>
                  </div>

                  <div class="grid grid-cols-1 gap-6">
                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="w-full group">
                        <label class="block text-blue-500 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Technical Skills</label>
                        <p class="text-xs text-slate-500 mb-2">Core hard skills (e.g. SQL, Python).</p>
                        <textarea [ngModel]="resumeService.skills().technical.join(', ')" 
                                  (ngModelChange)="updateSkillCategory('technical', $event)"
                                  rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="w-full group">
                        <label class="block text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Analytical Skills</label>
                        <p class="text-xs text-slate-500 mb-2">Methodologies & Concepts (e.g. Forecasting).</p>
                        <textarea [ngModel]="resumeService.skills().analytical.join(', ')" 
                                  (ngModelChange)="updateSkillCategory('analytical', $event)"
                                  rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="w-full group">
                        <label class="block text-purple-500 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Soft Skills</label>
                        <p class="text-xs text-slate-500 mb-2">Leadership & Management.</p>
                        <textarea [ngModel]="resumeService.skills().soft.join(', ')" 
                                  (ngModelChange)="updateSkillCategory('soft', $event)"
                                  rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Settings Tab -->
              @if (activeTab() === 'settings') {
                <div class="space-y-6 animate-fade-in">
                  <div>
                    <h2 class="text-2xl font-bold text-white">Admin Settings</h2>
                    <p class="text-slate-400 text-sm mt-1">Security and configuration.</p>
                  </div>

                  <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 max-w-lg">
                    <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                       Change Password
                    </h3>
                    
                    <div class="space-y-4">
                      <div class="w-full group">
                         <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Current Password</label>
                         <input type="password" [(ngModel)]="currentPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                      </div>
                      <div class="w-full group">
                         <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">New Password</label>
                         <input type="password" [(ngModel)]="newPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                      </div>
                       <div class="w-full group">
                         <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Confirm New Password</label>
                         <input type="password" [(ngModel)]="confirmPass" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                      </div>
                      
                      @if (passMsg) {
                        <div [class.text-red-400]="passError" [class.text-emerald-400]="!passError" class="text-sm font-medium flex items-center gap-2 mt-2">
                           @if (passError) {
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                           } @else {
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                           }
                           {{ passMsg }}
                        </div>
                      }

                      <button (click)="changePassword()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-900/20 mt-2">Update Password</button>
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
    /* Animations */
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
  
  activeTab = signal<'profile' | 'experience' | 'projects' | 'skills' | 'settings'>('profile');
  tabs = ['profile', 'experience', 'projects', 'skills', 'settings'];
  
  expandedId = signal<string | null>(null);

  localProfile: Profile = { ...this.resumeService.profile() };

  closeAdmin() {
    const event = new CustomEvent('closeAdmin');
    window.dispatchEvent(event);
  }

  login(e: Event) {
    e.preventDefault();
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_password') : null;
    const validPass = stored || 'admin';

    if (this.passwordInput === validPass) {
      this.isAuthenticated.set(true);
      this.loginError.set(false);
      this.localProfile = { ...this.resumeService.profile() };
    } else {
      this.loginError.set(true);
    }
  }

  saveProfile() {
    this.resumeService.updateProfile(this.localProfile);
    // Visual feedback could be added here
  }

  // Password Management
  currentPass = '';
  newPass = '';
  confirmPass = '';
  passMsg = '';
  passError = false;

  changePassword() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_password') : null;
    const validPass = stored || 'admin';
    
    this.passMsg = '';
    
    if (this.currentPass !== validPass) {
       this.passMsg = 'Current password incorrect';
       this.passError = true;
       return;
    }
    if (this.newPass !== this.confirmPass) {
       this.passMsg = 'New passwords do not match';
       this.passError = true;
       return;
    }
    if (!this.newPass) {
       this.passMsg = 'Password cannot be empty';
       this.passError = true;
       return;
    }
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('portfolio_password', this.newPass);
    }
    
    this.passMsg = 'Password updated successfully';
    this.passError = false;
    this.currentPass = '';
    this.newPass = '';
    this.confirmPass = '';
  }

  toggleExpand(id: string) {
    if (this.expandedId() === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
    }
  }

  // --- Helpers ---

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
      period: 'Period',
      description: ['New achievement'],
      skills_used: []
    };
    this.resumeService.addExperience(newExp);
    this.expandedId.set(newExp.id); // Auto expand new item
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
      title: 'New Project',
      description: 'Project summary...',
      technologies: [],
      imageUrl: '',
      results: []
    };
    this.resumeService.addProject(newProj);
    this.expandedId.set(newProj.id); // Auto expand
  }

  updateSkillCategory(category: keyof SkillSet, text: string) {
    const list = text.split(',').map(s => s.trim()).filter(s => s !== '');
    const currentSkills = this.resumeService.skills();
    const newSkills = { ...currentSkills, [category]: list };
    this.resumeService.updateSkills(newSkills);
  }
}