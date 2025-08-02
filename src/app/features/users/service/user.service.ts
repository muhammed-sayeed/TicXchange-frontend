import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService, ApiResponse } from '../../../core/services/base-http.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private baseHttp: BaseHttpService) {}

  // Get all users with pagination
  getUsers(page: number = 1, pageSize: number = 10, search?: string): Observable<UserListResponse> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (search) {
      params += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.baseHttp.get<ApiResponse<UserListResponse>>(`/users${params}`)
      .pipe(map(response => response.data));
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.baseHttp.get<ApiResponse<User>>(`/users/${id}`)
      .pipe(map(response => response.data));
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.baseHttp.post<ApiResponse<User>>('/users', userData)
      .pipe(map(response => response.data));
  }

  // Update user
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.baseHttp.put<ApiResponse<User>>(`/users/${id}`, userData)
      .pipe(map(response => response.data));
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.baseHttp.delete<ApiResponse<void>>(`/users/${id}`)
      .pipe(map(response => response.data));
  }

  // Upload user avatar
  uploadAvatar(userId: string, file: File): Observable<User> {
    return this.baseHttp.uploadFile<ApiResponse<User>>(`/users/${userId}/avatar`, file)
      .pipe(map(response => response.data));
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    return this.baseHttp.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`)
      .pipe(map(response => response.data));
  }
}