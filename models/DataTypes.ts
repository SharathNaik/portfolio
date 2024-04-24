export interface keyable {
  [key: string]: any;
}

export interface map {
  [key: string]: string;
}

export type Data = {
  intro: String;
  picture: string;
  about: string;
  email: string;
  tagline: String[];
  bio: String[];
  journey: keyable[];
  githubUserID: string;
  //repos: string[];
  socials: map;
  resume: string;
  projects: keyable[];
};

export type ProjectCardProps = {
  name?: string;
  description?: string | null;
  rating?: number;
  download_count?: number;
  android_url?: string;
  web_link_url?:string;
  windows_url?:string;
  homepage?: string | URL | undefined;
  language?: string;
  open_issues?: number;
  topics?: string[] | null;
};

export type ProjectDataArr = {
  name?: string;
  description?: string | null;
  rating?: number;
  download_count?: number;
  android_url?: string;
  web_link_url?:string;
  windows_url?:string;
  homepage?: string | URL | undefined;
  language?: string;
  open_issues?: number;
  topics?: string[] | null;
};

export interface AddAnimationClassParameters {
  elements?: HTMLCollectionOf<Element>;
  animate?: number;
}

export interface RemoveAnimationClassParameters {
  elements?: HTMLCollectionOf<Element>;
  index: number;
}

export interface AddAnimationClassReturnType {
  // TODO: fix datatype of setinterval variable
  interval: any;
  index: number[];
}
