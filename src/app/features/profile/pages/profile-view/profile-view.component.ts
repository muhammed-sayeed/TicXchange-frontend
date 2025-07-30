import { Component, OnInit } from '@angular/core';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  phone: string;
  bio: string;
  joinDate: Date;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  stats: {
    projects: number;
    tasks: number;
    achievements: number;
  };
}

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  
  isEditing = false;
  user: UserProfile = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    title: 'Senior Software Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love working with Angular, Node.js, and cloud technologies.',
    joinDate: new Date('2019-03-15'),
    skills: ['Angular', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson',
      github: 'https://github.com/alexjohnson'
    },
    stats: {
      projects: 24,
      tasks: 156,
      achievements: 12
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Load user data from service
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Replace with actual service call
    // this.profileService.getUserProfile().subscribe(user => this.user = user);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    // Save profile logic
    this.isEditing = false;
    console.log('Profile saved:', this.user);
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Reload original data
    this.loadUserProfile();
  }

  uploadAvatar(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSkill(skill: string): void {
    this.user.skills = this.user.skills.filter(s => s !== skill);
  }

  addSkill(skill: string): void {
    if (skill && !this.user.skills.includes(skill)) {
      this.user.skills.push(skill);
    }
  }
}