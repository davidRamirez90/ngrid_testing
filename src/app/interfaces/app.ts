export interface AppStateModel {
  posts: ExtendedPost[];
  currSelected: ExtendedPost;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ExtendedPost {
  userId: number;
  id: number;
  title: string;
  body: string;
  userData: User;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Adress;
  phone: string;
  website: string;
  company: Company;
}

export interface GeoCoords {
  lat: string;
  lng: string;
}

export interface Adress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoCoords;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
