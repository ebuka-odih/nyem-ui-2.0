
import React from 'react';

export interface Vendor {
  name: string;
  avatar: string;
  location: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  bio: string;
  verified: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  images: string[];
  color: string;
  longDescription: string;
  vendor: Vendor;
  distance: string;
  isSuper?: boolean;
}

export interface CityData {
  city: string;
}

export interface CategoryData {
  name: string;
  icon: React.ElementType;
}
