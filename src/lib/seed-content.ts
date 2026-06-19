import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import type { Project, TeamMember, Testimonial, YoutubeVideo } from "./cms";

export const seedProjects: Project[] = [
  {
    id: "s1", title: "Nordic Oak Interiors", slug: "nordic-oak", category: "Shopify",
    client: "Nordic Oak", description: "Custom Shopify Plus build with conversion-first product pages and a +42% lift in mobile checkout.",
    technologies: ["Shopify Plus", "Liquid", "Hydrogen"], cover_image: portfolio1, gallery_images: [],
    live_url: "https://example.com", featured: true, published: true, display_order: 1,
  },
  {
    id: "s2", title: "Chrono Vault", slug: "chrono-vault", category: "Shopify",
    client: "Chrono Vault", description: "Luxury watch boutique migration to Shopify Plus with bespoke storytelling and headless front-end.",
    technologies: ["Shopify", "Next.js", "GSAP"], cover_image: portfolio2, gallery_images: [],
    live_url: null, featured: true, published: true, display_order: 2,
  },
  {
    id: "s3", title: "Botanica Skincare", slug: "botanica", category: "WordPress",
    client: "Botanica", description: "Editorial WordPress with WooCommerce, animated brand storytelling and 98 Lighthouse score.",
    technologies: ["WordPress", "WooCommerce", "ACF"], cover_image: portfolio3, gallery_images: [],
    live_url: null, featured: true, published: true, display_order: 3,
  },
  {
    id: "s4", title: "Orbit SaaS", slug: "orbit", category: "Landing Page",
    client: "Orbit", description: "High-converting SaaS landing page launched in 14 days, driving 3.4x sign-up rate vs. previous site.",
    technologies: ["WordPress", "Headless"], cover_image: portfolio4, gallery_images: [],
    live_url: null, featured: false, published: true, display_order: 4,
  },
];

export const seedTeam: TeamMember[] = [
  { id: "t1", name: "Leo Vance", role: "Founder & Strategy", bio: "15+ years scaling DTC brands.", photo: team1, facebook_url: "#", instagram_url: "#", linkedin_url: "#", display_order: 1, published: true },
  { id: "t2", name: "Sarah Green", role: "Lead Shopify Engineer", bio: "Shopify Plus expert, Liquid wizard.", photo: team2, facebook_url: "#", instagram_url: "#", linkedin_url: "#", display_order: 2, published: true },
  { id: "t3", name: "Marcus Thorne", role: "UI Engineer", bio: "Interface craft and micro-interactions.", photo: team3, facebook_url: "#", instagram_url: "#", linkedin_url: "#", display_order: 3, published: true },
  { id: "t4", name: "Emma Wu", role: "Client Success", bio: "Translates vision into shipped product.", photo: team4, facebook_url: "#", instagram_url: "#", linkedin_url: "#", display_order: 4, published: true },
];

export const seedTestimonials: Testimonial[] = [
  { id: "ts1", client_name: "Sarah Jenkins", client_role: "Founder", company: "Bloom & Co.", avatar: null,
    content: "They didn't just build a site; they engineered a growth machine. Mobile checkout abandonment dropped 60% in month one.",
    rating: 5, featured: true, display_order: 1 },
  { id: "ts2", client_name: "David Chen", client_role: "CEO", company: "AeroWear", avatar: null,
    content: "Conversion rate jumped 40% in the first month. They understand commerce, not just code.", rating: 5, featured: true, display_order: 2 },
  { id: "ts3", client_name: "Maya Okafor", client_role: "Head of Brand", company: "Leaf & Soil", avatar: null,
    content: "Premium polish on every detail. Our site finally feels like the brand we always wanted.", rating: 5, featured: true, display_order: 3 },
];

export const seedVideos: YoutubeVideo[] = [
  { id: "v1", title: "Scaling Shopify Plus for 8-figure Brands", channel_name: "Creative Web Boost", youtube_url: "https://youtube.com/@creativewebboost", thumbnail: portfolio1, category: "Shopify", featured: true, display_order: 1 },
  { id: "v2", title: "WordPress Performance Masterclass", channel_name: "Creative Web Boost", youtube_url: "https://youtube.com/@creativewebboost", thumbnail: portfolio3, category: "WordPress", featured: true, display_order: 2 },
  { id: "v3", title: "Conversion-First Landing Pages", channel_name: "Creative Web Boost", youtube_url: "https://youtube.com/@creativewebboost", thumbnail: portfolio4, category: "CRO", featured: true, display_order: 3 },
];
