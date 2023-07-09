import { Data } from "../models/DataTypes";
import dataFromJson from "../public/data.json";

export const data: Data = {
  intro: dataFromJson.intro,
  about: dataFromJson.about,
  picture: dataFromJson.picture,
  tagline: dataFromJson.tagline,
  bio: dataFromJson.bio,
  journey: dataFromJson.journey,
  email: dataFromJson.email,
  githubUserID: dataFromJson.githubUserID,
  //repos: dataFromJson.repos,
  socials: dataFromJson.socials,
  resume: dataFromJson.resume,
  projects: dataFromJson.projects
};
