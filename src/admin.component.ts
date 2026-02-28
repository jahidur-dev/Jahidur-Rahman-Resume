
import { Component, signal, inject, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from './resume.service';
import { Experience, Profile, Project, SkillSet, BlogPost, Category } from './app.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] bg-slate-950 text-slate-200 overflow-hidden flex flex-col">
      
      <!-- Top Header -->
      <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-20">
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Toggle -->
          <button (click)="toggleMobileMenu()" class="md:hidden p-1 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <h1 class="font-bold text-lg tracking-tight text-white">Admin Dashboard</h1>
        </div>
        <div class="flex items-center gap-4">
          <button (click)="closeAdmin()" class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span class="hidden sm:inline">Back to Site</span>
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
        <div class="flex-1 flex overflow-hidden relative">
          
          <!-- Sidebar Navigation (Desktop) -->
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

          <!-- Mobile Sidebar Overlay -->
          @if (mobileMenuOpen()) {
            <div class="absolute inset-0 z-40 md:hidden">
              <!-- Backdrop -->
              <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" (click)="toggleMobileMenu()"></div>
              
              <!-- Drawer -->
              <nav class="absolute top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl animate-slide-in-left">
                <div class="p-4 space-y-1 mt-4">
                  @for (tab of tabs; track tab) {
                    <button (click)="setActiveTab(tab); toggleMobileMenu()"
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
            </div>
          }

          <!-- Content Area -->
          <main class="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 scroll-smooth">
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
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Tagline</label>
                          <input [(ngModel)]="localProfile.tagline" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
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
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">LinkedIn URL</label>
                          <input [(ngModel)]="localProfile.linkedin" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">GitHub URL</label>
                          <input [(ngModel)]="localProfile.github" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Kaggle URL</label>
                          <input [(ngModel)]="localProfile.kaggle" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        <div class="w-full group">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Currently Learning</label>
                          <input [(ngModel)]="localProfile.currentlyLearning" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                        </div>
                        
                        <!-- Resume Upload -->
                        <div class="w-full group col-span-1 md:col-span-2 border-t border-slate-800 pt-6 mt-2">
                          <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Update Resume (PDF)</label>
                          <div class="flex items-center gap-4">
                            <input type="file" accept="application/pdf" (change)="onResumeSelected($event)" #fileInput class="hidden">
                            <button (click)="fileInput.click()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Select PDF
                            </button>
                            <span class="text-sm text-slate-400">{{ selectedFileName() || 'No file selected' }}</span>
                            
                            @if (selectedFileBase64()) {
                              <button (click)="uploadResume()" [disabled]="uploadingResume()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 ml-auto">
                                @if (uploadingResume()) {
                                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Uploading...
                                } @else {
                                  Upload Resume
                                }
                              </button>
                            }
                          </div>
                          @if (uploadMessage()) {
                            <p class="text-xs mt-2" [class.text-green-400]="uploadSuccess()" [class.text-red-400]="!uploadSuccess()">{{ uploadMessage() }}</p>
                          }
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
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Type</label>
                                  <select [(ngModel)]="editingProject()!.type" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm appearance-none">
                                    @for (cat of resumeService.projectCategories(); track cat) {
                                      <option [value]="cat">{{ cat }}</option>
                                    }
                                  </select>
                                </div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Role</label><input [(ngModel)]="editingProject()!.role" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Image</label>
                                  <input type="file" (change)="onFileSelected($event, editingProject()!, 'imageUrl')" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-blue-400 hover:file:bg-slate-700 mb-2 cursor-pointer"/>
                                  <input [(ngModel)]="editingProject()!.imageUrl" placeholder="Or Image URL" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Demo Link</label><input [(ngModel)]="editingProject()!.link" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Repo Link</label><input [(ngModel)]="editingProject()!.repoLink" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                
                                <div class="md:col-span-2 group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Technologies (comma separated)</label>
                                  <input [ngModel]="editingProject()!.technologies.join(', ')" (ngModelChange)="updateListString($event, editingProject()!, 'technologies')" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>

                                @if (editingProject()!.type === 'data') {
                                  <div class="md:col-span-2 group">
                                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Dataset Details</label>
                                    <input [(ngModel)]="editingProject()!.datasetDetails" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                  </div>
                                  <div class="md:col-span-2 group">
                                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Techniques Used (comma separated)</label>
                                    <input [ngModel]="editingProject()!.techniquesUsed ? editingProject()!.techniquesUsed!.join(', ') : ''" (ngModelChange)="updateListString($event, editingProject()!, 'techniquesUsed')" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                  </div>
                                }
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
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Category</label>
                                  <select [(ngModel)]="editingBlog()!.category" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm appearance-none">
                                    @for (cat of resumeService.blogCategories(); track cat) {
                                      <option [value]="cat">{{ cat }}</option>
                                    }
                                  </select>
                                </div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Date</label><input [(ngModel)]="editingBlog()!.date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Read Time</label><input [(ngModel)]="editingBlog()!.readTime" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></div>
                                <div class="group">
                                  <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">Image</label>
                                  <input type="file" (change)="onFileSelected($event, editingBlog()!, 'imageUrl')" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-blue-400 hover:file:bg-slate-700 mb-2 cursor-pointer"/>
                                  <input [(ngModel)]="editingBlog()!.imageUrl" placeholder="Or Image URL" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm">
                                </div>
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

              <!-- Categories Tab -->
              @if (activeTab() === 'categories') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Manage Categories</h2>
                    <button (click)="addNewCategory()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700 transition-all">+ Add Category</button>
                  </div>

                  <div class="grid grid-cols-1 gap-4">
                    @for (cat of resumeService.categories(); track cat.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                          <div class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" 
                               [class.bg-blue-900]="cat.type === 'project'" [class.text-blue-400]="cat.type === 'project'"
                               [class.bg-emerald-900]="cat.type === 'blog'" [class.text-emerald-400]="cat.type === 'blog'">
                            {{ cat.type }}
                          </div>
                          <div>
                            <h3 class="font-bold text-white">{{ cat.name }}</h3>
                            <p class="text-xs text-slate-500">/{{ cat.slug }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button (click)="editCategory(cat)" class="text-blue-500 hover:text-blue-400 text-sm font-medium px-3 py-1">Edit</button>
                          <button (click)="resumeService.deleteCategory(cat.id)" class="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-1">Delete</button>
                        </div>
                      </div>
                      
                      <!-- Edit Form -->
                      @if (expandedId() === cat.id && editingCategory()) {
                        <div class="bg-slate-900/50 border-x border-b border-slate-800 p-6 rounded-b-xl mb-4 animate-fade-in-down">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Name</label><input [(ngModel)]="editingCategory()!.name" (input)="generateSlug(editingCategory()!)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm"></div>
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Slug</label><input [(ngModel)]="editingCategory()!.slug" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm"></div>
                              <div class="group"><label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Type</label>
                                <select [(ngModel)]="editingCategory()!.type" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm appearance-none">
                                  <option value="project">Project</option>
                                  <option value="blog">Insight</option>
                                </select>
                              </div>
                              <div class="group">
                                <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Parent Category</label>
                                <select [(ngModel)]="editingCategory()!.parentId" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm appearance-none">
                                  <option [ngValue]="undefined">None</option>
                                  @for (pCat of resumeService.categories(); track pCat.id) {
                                    @if (pCat.id !== editingCategory()!.id && pCat.type === editingCategory()!.type) {
                                      <option [value]="pCat.id">{{ pCat.name }}</option>
                                    }
                                  }
                                </select>
                              </div>
                              <div class="group flex items-center pt-6">
                                <label class="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" [(ngModel)]="editingCategory()!.published" class="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500">
                                  <span class="text-slate-300 text-sm font-medium">Published</span>
                                </label>
                              </div>
                           </div>
                           <div class="flex justify-end gap-3">
                             <button (click)="cancelEdit()" class="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                             <button (click)="saveCategory()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm">Save Category</button>
                           </div>
                        </div>
                      }
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
                    <h3 class="text-xl font-bold text-white">Development Skills</h3>
                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="group mb-4">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-500">Frontend</label>
                        <textarea [(ngModel)]="localSkills.development.frontend" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                      <div class="group mb-4">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-500">Backend</label>
                        <textarea [(ngModel)]="localSkills.development.backend" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                      <div class="group">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-blue-500">Tools</label>
                        <textarea [(ngModel)]="localSkills.development.tools" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <h3 class="text-xl font-bold text-white">Data Skills</h3>
                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div class="group mb-4">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-emerald-500">Languages</label>
                        <textarea [(ngModel)]="localSkills.data.languages" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                      <div class="group mb-4">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-emerald-500">Visualization</label>
                        <textarea [(ngModel)]="localSkills.data.visualization" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                      <div class="group">
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors text-emerald-500">Analysis</label>
                        <textarea [(ngModel)]="localSkills.data.analysis" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600 text-sm"></textarea>
                      </div>
                    </div>

                    <div class="flex justify-end pt-4 border-t border-slate-800">
                       <button (click)="saveSkills()" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95">Update Skills</button>
                    </div>
                  </div>
                </div>
              }
              
              <!-- Messages Tab -->
              @if (activeTab() === 'messages') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">Messages</h2>
                    <div class="text-sm text-slate-400">
                      {{ resumeService.messages().length }} Total
                    </div>
                  </div>

                  <div class="space-y-4">
                    @if (resumeService.messages().length === 0) {
                      <div class="text-center py-12 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                        <p>No messages yet.</p>
                      </div>
                    }

                    @for (msg of resumeService.messages(); track msg.id) {
                      <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 transition-all" 
                           [class.border-l-4]="!msg.read" 
                           [class.border-l-blue-500]="!msg.read"
                           [class.bg-slate-800]="!msg.read">
                        
                        <div class="flex justify-between items-start mb-4">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                              {{ msg.name.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                              <h3 class="font-bold text-white flex items-center gap-2">
                                {{ msg.name }}
                                @if (!msg.read) {
                                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                }
                              </h3>
                              <p class="text-sm text-slate-400">{{ msg.email }}</p>
                              @if (msg.phone) {
                                <p class="text-xs text-slate-500">{{ msg.phone }}</p>
                              }
                            </div>
                          </div>
                          <span class="text-xs text-slate-500">{{ msg.date }}</span>
                        </div>
                        
                        <p class="text-slate-300 text-sm leading-relaxed mb-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                          {{ msg.message }}
                        </p>
                        
                        <div class="flex justify-end gap-3">
                          @if (!msg.read) {
                            <button (click)="resumeService.markMessageAsRead(msg.id)" class="text-blue-400 hover:text-blue-300 text-xs font-bold px-3 py-2 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Mark as Read
                            </button>
                          }
                          <button (click)="resumeService.deleteMessage(msg.id)" class="text-red-500 hover:text-red-400 text-xs font-bold px-3 py-2 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    }
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
  activeTab = signal<'profile' | 'experience' | 'projects' | 'insights' | 'categories' | 'skills' | 'messages' | 'settings'>('profile');
  tabs = ['profile', 'experience', 'projects', 'insights', 'categories', 'skills', 'messages', 'settings'];
  
  // Edit Buffers (Copies of data to edit)
  expandedId = signal<string | null>(null);
  editingExperience = signal<Experience | null>(null);
  editingProject = signal<Project | null>(null);
  editingBlog = signal<BlogPost | null>(null);
  editingCategory = signal<Category | null>(null);
  
  localProfile: Profile = { ...this.resumeService.profile() };
  localSkills = { 
    development: { frontend: '', backend: '', tools: '' },
    data: { languages: '', visualization: '', analysis: '' }
  };

  // Mobile Menu State
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  constructor() {
    effect(() => {
    });
  }

  setActiveTab(tab: any) {
    this.activeTab.set(tab);
    if (tab === 'skills') {
      const s = this.resumeService.skills();
      if (s && s.development) {
        this.localSkills = {
          development: {
            frontend: s.development.frontend.join(', '),
            backend: s.development.backend.join(', '),
            tools: s.development.tools.join(', ')
          },
          data: {
            languages: s.data.languages.join(', '),
            visualization: s.data.visualization.join(', '),
            analysis: s.data.analysis.join(', ')
          }
        };
      }
    }
    this.cancelEdit(); 
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

  // Category Management State
  
  // Resume Upload State
  selectedFileName = signal<string | null>(null);
  selectedFileBase64 = signal<string | null>(null);
  uploadingResume = signal(false);
  uploadMessage = signal<string | null>(null);
  uploadSuccess = signal(false);

  onResumeSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.uploadMessage.set('Please select a PDF file.');
        this.uploadSuccess.set(false);
        return;
      }
      this.selectedFileName.set(file.name);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileBase64.set(e.target.result);
        this.uploadMessage.set(null);
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadResume() {
    const base64 = this.selectedFileBase64();
    if (!base64) return;

    this.uploadingResume.set(true);
    this.uploadMessage.set(null);

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileData: base64 })
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        if (response.status === 404) {
             errorMessage = "Error: The upload endpoint was not found (404). Ensure the backend server is running.";
        } else if (response.status === 413) {
             errorMessage = "Error: File is too large. Maximum size is 10MB.";
        }

        try {
            const errorJson = JSON.parse(text);
            if (errorJson && errorJson.error) {
                errorMessage = `Server Error: ${errorJson.error}`;
            }
        } catch (e) {
            // response was not JSON, use default or status-based message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      this.uploadSuccess.set(true);
      this.uploadMessage.set('Resume uploaded successfully!');
      this.selectedFileName.set(null);
      this.selectedFileBase64.set(null);
      
    } catch (error: any) {
      this.uploadSuccess.set(false);
      this.uploadMessage.set(error.message || 'Failed to upload resume. Please try again.');
      console.error(error);
    } finally {
      this.uploadingResume.set(false);
    }
  }

  addNewCategory() {
    const newCat: Category = {
      id: Date.now().toString(),
      name: 'New Category',
      slug: 'new-category',
      type: 'project',
      published: true
    };
    this.resumeService.addCategory(newCat);
    this.editCategory(newCat);
  }

  editCategory(cat: Category) {
    this.editingCategory.set(JSON.parse(JSON.stringify(cat)));
    this.expandedId.set(cat.id);
  }

  saveCategory() {
    if (this.editingCategory()) {
      this.resumeService.updateCategory(this.editingCategory()!);
      this.cancelEdit();
    }
  }

  generateSlug(cat: Category) {
    cat.slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Image Upload Helper
  onFileSelected(event: any, model: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        model[field] = e.target.result;
      };
      reader.readAsDataURL(file);
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
      type: 'web',
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
      development: {
        frontend: this.localSkills.development.frontend.split(',').map(s=>s.trim()).filter(Boolean),
        backend: this.localSkills.development.backend.split(',').map(s=>s.trim()).filter(Boolean),
        tools: this.localSkills.development.tools.split(',').map(s=>s.trim()).filter(Boolean),
      },
      data: {
        languages: this.localSkills.data.languages.split(',').map(s=>s.trim()).filter(Boolean),
        visualization: this.localSkills.data.visualization.split(',').map(s=>s.trim()).filter(Boolean),
        analysis: this.localSkills.data.analysis.split(',').map(s=>s.trim()).filter(Boolean),
      }
    });
    alert('Skills updated!');
  }

  // --- Helpers ---
  cancelEdit() {
    this.expandedId.set(null);
    this.editingExperience.set(null);
    this.editingProject.set(null);
    this.editingBlog.set(null);
    this.editingCategory.set(null);
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
