export interface User {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  followers?: string[];
  following?: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 