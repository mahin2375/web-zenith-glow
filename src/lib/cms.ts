import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client: string | null;
  description: string | null;
  technologies: string[] | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  published: boolean;
};

export type YoutubeVideo = {
  id: string;
  title: string;
  channel_name: string;
  youtube_url: string;
  thumbnail: string | null;
  category: string | null;
  featured: boolean;
  display_order: number;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_role: string | null;
  company: string | null;
  avatar: string | null;
  content: string;
  rating: number;
  featured: boolean;
  display_order: number;
};

export function useProjects(filter?: string) {
  return useQuery({
    queryKey: ["projects", filter ?? "all"],
    queryFn: async () => {
      let q = supabase.from("projects").select("*").eq("published", true).order("display_order");
      if (filter && filter !== "all") q = q.eq("category", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) throw error;
      return data as TeamMember[];
    },
  });
}

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_videos")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as YoutubeVideo[];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("featured", true)
        .order("display_order");
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}
