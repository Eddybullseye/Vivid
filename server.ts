import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.set("trust proxy", 1);
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// ==========================================
// 🗄️ MODEL TYPES & IN-MEMORY STATE STORAGE
// ==========================================

export interface UserDB {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  role: 'reader' | 'author' | 'editor' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CategoryDB {
  id: string;
  name: string;
  slug: string;
  description: string;
  manifesto: string;
  icon: string;
  coverImageUrl: string;
  postCount: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface TagDB {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}

export interface CommentDB {
  id: string;
  postId: string;
  userId?: string;
  parentId?: string;
  author: string;
  text: string;
  date: string;
  isApproved: boolean;
  isFlagged: boolean;
  likeCount: number;
  createdAt: string;
}

export interface NewsletterSubscriberDB {
  id: string;
  email: string;
  fullName: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced';
  source: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  tags: string[];
  metadata: any;
  createdAt: string;
}

export interface ReadingListDB {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  isCurated: boolean;
  displayOrder: number;
  posts: string[]; // List of post IDs
  createdAt: string;
}

export interface MediaDB {
  id: string;
  uploadedBy?: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  cloudinaryId?: string;
  width?: number;
  height?: number;
  altText: string;
  caption?: string;
  folder: string;
  createdAt: string;
}

export interface AnalyticsEventDB {
  id: string;
  eventType: string;
  postId?: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  country: string;
  city: string;
  deviceType: string;
  metadata: any;
  createdAt: string;
}

// ------------------------------------------
// Seed Initial Data States
// ------------------------------------------

let localPosts: any[] = [];

let localUsers: UserDB[] = [
  {
    id: "user-admin-1",
    email: "abdulqoyyumraji@gmail.com",
    fullName: "Abdulqoyyum Raji",
    username: "abdul_vivid",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    bio: "Super Administrator and Chief Technology Architect at VIVID Digital Platforms.",
    role: "admin",
    isVerified: true,
    isActive: true,
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
    lastLoginAt: new Date().toISOString()
  },
  {
    id: "user-author-1",
    email: "zara@vivid.blog",
    fullName: "Zara Adebayo",
    username: "zara_vivid",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "Founder & Editorial Voice of VIVID. Exploring minimalist lifestyle, Nigerian food heritage, and modern spatial architecture.",
    role: "editor",
    isVerified: true,
    isActive: true,
    createdAt: new Date("2025-10-01T08:00:00Z").toISOString()
  }
];

let localCategories: CategoryDB[] = [
  {
    id: "cat-mindset",
    name: "Mindset",
    slug: "mindset",
    description: "Intellectual equilibrium and philosophical design.",
    manifesto: "THE VIVID MINDSET MANIFESTO: We write for those who view intentionality as the ultimate luxury...",
    icon: "Sparkles",
    coverImageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    postCount: 15,
    displayOrder: 1,
    isActive: true,
    createdAt: new Date("2025-10-01T08:00:00Z").toISOString()
  },
  {
    id: "cat-style",
    name: "Style",
    slug: "style",
    description: "Sartorial composition and silhouettes.",
    manifesto: "THE STYLE SILHOUETTE COMPOSITION: Rejecting trends, celebrating structural craftsmanship...",
    icon: "Flame",
    coverImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    postCount: 12,
    displayOrder: 2,
    isActive: true,
    createdAt: new Date("2025-10-01T08:00:00Z").toISOString()
  }
];

let localSubscribers: NewsletterSubscriberDB[] = [
  {
    id: "sub-1",
    email: "abdulqoyyumraji@gmail.com",
    fullName: "Abdulqoyyum Raji",
    status: "active",
    source: "Admin Panel",
    confirmedAt: new Date().toISOString(),
    tags: ["vip", "staff"],
    metadata: { browser: "Chrome", OS: "macOS" },
    createdAt: new Date("2026-05-10T11:20:00Z").toISOString()
  },
  {
    id: "sub-2",
    email: "reader.jane@domain.com",
    fullName: "Jane Doe",
    status: "active",
    source: "Homepage Pop-up",
    confirmedAt: new Date("2026-05-15T09:40:00Z").toISOString(),
    tags: ["travel", "design"],
    metadata: { referrer: "https://t.co" },
    createdAt: new Date("2026-05-15T09:30:00Z").toISOString()
  },
  {
    id: "sub-3",
    email: "curious.soul@lifestyle.io",
    fullName: "Damilola Coker",
    status: "pending",
    source: "Footer",
    tags: ["food"],
    metadata: {},
    createdAt: new Date("2026-06-01T15:10:00Z").toISOString()
  }
];

let localReadingLists: ReadingListDB[] = [
  {
    id: "list-1",
    title: "Minimalist Architectural Silhouettes",
    slug: "minimal-silhouettes",
    description: "A spatial curation of pristine concrete facades, high-contrast natural light, and structural purity.",
    isCurated: true,
    displayOrder: 1,
    posts: ["post-1", "post-2"],
    createdAt: new Date("2026-01-01T12:00:00Z").toISOString()
  }
];

let localMedia: MediaDB[] = [
  {
    id: "media-1",
    filename: "minimalist_interior.jpg",
    originalName: "IMG_3092.jpg",
    fileType: "image/jpeg",
    fileSize: 420100,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    altText: "Minimalist concrete layout with raw wooden chair.",
    folder: "headers",
    createdAt: new Date("2026-04-12T14:32:00Z").toISOString()
  }
];

let localAnalyticsEvents: AnalyticsEventDB[] = [
  {
    id: "event-1",
    eventType: "page_view",
    sessionId: "sess-8bc341",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
    referrer: "https://google.com",
    country: "Nigeria",
    city: "Lagos",
    deviceType: "desktop",
    metadata: { path: "/" },
    createdAt: new Date().toISOString()
  }
];

// Flat registry of comments mapping back into memory
const getFlatComments = (): CommentDB[] => {
  const list: CommentDB[] = [];
  localPosts.forEach(post => {
    if (post.comments) {
      post.comments.forEach(c => {
        list.push({
          id: c.id,
          postId: post.id,
          author: c.author,
          text: c.text,
          date: c.date,
          isApproved: true,
          isFlagged: false,
          likeCount: 0,
          createdAt: c.date ? new Date(c.date).toISOString() : new Date().toISOString()
        });
      });
    }
  });
  return list;
};

// ==========================================
// 🔌 SUPABASE DATABASE INGESTION SYSTEM
// ==========================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let db: any = null;

if (
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-supabase-project.supabase.co" && 
  supabaseUrl !== "" &&
  supabaseAnonKey !== "your-anon-key" &&
  supabaseAnonKey !== ""
) {
  try {
    db = createClient(supabaseUrl, supabaseAnonKey);
    console.log("⚡ Supabase integration initialized successfully in v1 engine!");
  } catch (err) {
    console.error("❌ Failed to initialize Supabase client in v1 engine:", err);
  }
} else {
  console.log("ℹ️ Supabase environment variables not defined. Live syncing is simulated in-memory.");
}

async function seedSupabaseIfNeeded() {
  if (!db) return;
  try {
    const { count, error } = await db
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log("🚨 Supabase Table Schema Blueprint Setup Guidance:");
      console.log(`
      create table posts (
        id text primary key,
        title text not null,
        subtitle text not null,
        category text not null,
        author jsonb not null,
        date text not null,
        read_time text not null,
        content jsonb not null,
        quotes jsonb,
        image_url text not null,
        tags jsonb not null,
        likes integer default 0,
        comments jsonb default '[]'::jsonb,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
      `);
      return;
    }

    if (count === 0) {
      console.log("☘️ Supabase DB is bare. Ready for new stories...");
    }
  } catch (err) {
    console.error("Failed auto seeding Supabase DB:", err);
  }
}

if (db) {
  setTimeout(seedSupabaseIfNeeded, 3000);
}

// ==========================================
// 🔍 GEMINI HIGH-END RECOMMENDATIONS API
// ==========================================

app.post("/api/recommendations", async (req, res) => {
  const { currentPost, allPosts } = req.body;

  if (!currentPost || !allPosts || !Array.isArray(allPosts)) {
    return res.status(400).json({ error: "Missing currentPost or allPosts in request body." });
  }

  const candidatePosts = allPosts.filter(p => p.id !== currentPost.id);

  if (candidatePosts.length === 0) {
    return res.json([]);
  }

  const getFallbackRecommendations = () => {
    return candidatePosts
      .map(p => {
        const sharedTags = (p.tags || []).filter((t: string) => (currentPost.tags || []).includes(t)).length;
        const sameCategory = p.category === currentPost.category ? 2 : 0;
        const score = 0.3 + (sharedTags * 0.15) + (sameCategory * 0.1);
        return {
          postId: p.id,
          score: Math.min(0.95, score),
          reason: `A curated exploration addressing similar motifs under the ${p.category} chronicle.`
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      return res.json(getFallbackRecommendations());
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const prompt = `You are a high-end editorial assistant for VIVID, a bold, modern personal lifestyle blog.
Your task is to analyze the current post the user is reading and recommend the top 3 most relevant related articles from the provided list.

Current Article being read:
ID: "${currentPost.id}"
Title: "${currentPost.title}"
Category: "${currentPost.category}"
Tags: ${JSON.stringify(currentPost.tags)}

Other Available Articles:
${candidatePosts.map((p: any) => `- ID: "${p.id}", Title: "${p.title}", Category: "${p.category}", Tags: ${JSON.stringify(p.tags)}`).join('\n')}

Identify the top 3 recommended related articles.
Provide each selected recommendation with a similarity score (0.0 to 1.0) and an elegant, VIVID editorial sentence outlining why it's chosen. Generate output matching the specified array schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              postId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["postId", "score", "reason"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      const recommendations = JSON.parse(text.trim());
      const validRecs = recommendations.filter((r: any) => candidatePosts.some(p => p.id === r.postId));
      if (validRecs.length > 0) {
        return res.json(validRecs);
      }
    }
    res.json(getFallbackRecommendations());
  } catch (error) {
    console.error("Gemini AI API recommendations error:", error);
    res.json(getFallbackRecommendations());
  }
});


// =========================================================================
// 🌐 API V1 DIRECTORY SUITE IMPLEMENTATION
// =========================================================================

// ==========================================
// 1. Authentication Engine: /api/v1/auth
// ==========================================

const getMeProfile = () => {
  return localUsers.find(u => u.email === "abdulqoyyumraji@gmail.com") || localUsers[0];
};

app.post("/api/v1/auth/register", (req, res) => {
  const { email, password, fullName, username } = req.body;
  if (!email || !fullName || !username) {
    return res.status(400).json({ status: "error", message: "Required registration fields are missing" });
  }

  const existing = localUsers.find(u => u.email === email || u.username === username);
  if (existing) {
    return res.status(409).json({ status: "error", message: "Identity credentials already registered" });
  }

  const newUser: UserDB = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    username,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    bio: "Passionate reader and chronicler of VIVID lifestyles.",
    role: "reader",
    isVerified: false,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  localUsers.push(newUser);
  return res.status(201).json({ status: "success", user: newUser, token: "mock_jwt_access_token_v1" });
});

app.post("/api/v1/auth/login", (req, res) => {
  const { email } = req.body;
  const matched = localUsers.find(u => u.email === email) || getMeProfile();
  
  matched.lastLoginAt = new Date().toISOString();
  return res.json({
    status: "success",
    user: matched,
    accessToken: "mock_jwt_access_token_v1",
    refreshToken: "mock_jwt_refresh_token_v1",
    expiresIn: 900 // 15 mins
  });
});

app.post("/api/v1/auth/admin-login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "123456789";
  
  if (password === adminPassword) {
    res.cookie("admin_token", "secure_admin_jwt_123", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: "Authentication failed" });
});

app.post("/api/v1/auth/admin-logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  return res.json({ success: true });
});

app.get("/api/v1/auth/verify-admin", (req, res) => {
  if (req.cookies && req.cookies.admin_token === "secure_admin_jwt_123") {
    return res.json({ isAuthenticated: true });
  }
  return res.status(401).json({ isAuthenticated: false });
});

app.post("/api/v1/auth/login/google", (req, res) => {
  const admin = getMeProfile();
  return res.json({
    status: "success",
    user: admin,
    accessToken: "mock_google_oauth_token_v1"
  });
});

app.post("/api/v1/auth/logout", (req, res) => {
  return res.json({ success: true, message: "Security parameters successfully revoked." });
});

app.post("/api/v1/auth/refresh", (req, res) => {
  return res.json({ accessToken: "fresh_jwt_access_token_v1", expiresIn: 900 });
});

app.post(["/api/v1/auth/forgot-password", "/api/v1/auth/reset-password", "/api/v1/auth/verify-email", "/api/v1/auth/resend-verification"], (req, res) => {
  return res.json({ success: true, message: "Authentication validation cycle executed." });
});

app.get("/api/v1/auth/me", (req, res) => {
  if (req.cookies && req.cookies.admin_token === "secure_admin_jwt_123") {
    return res.json({ isAuthenticated: true, user: getMeProfile() });
  }
  return res.status(401).json({ isAuthenticated: false, error: "Unauthorized" });
});

app.patch("/api/v1/auth/me", (req, res) => {
  const active = getMeProfile();
  const updates = req.body;
  
  Object.keys(updates).forEach(key => {
    if (["fullName", "bio", "avatarUrl", "username"].includes(key)) {
      (active as any)[key] = updates[key];
    }
  });

  return res.json({ status: "success", user: active });
});

app.patch("/api/v1/auth/me/password", (req, res) => {
  return res.json({ success: true, message: "Sartorial credential updated." });
});

app.delete("/api/v1/auth/me", (req, res) => {
  const active = getMeProfile();
  active.isActive = false;
  return res.json({ success: true, message: "Profile successfully scheduled for deletion" });
});


// ==========================================
// 2. Posts Pipeline: /api/v1/posts
// ==========================================

app.get("/api/v1/posts", async (req, res) => {
  const { category, tag, author, page, limit, search } = req.query;
  
  let targetList = [...localPosts];

  // Apply filters
  if (category && category !== "ALL") {
    targetList = targetList.filter(p => p.category.toUpperCase() === String(category).toUpperCase());
  }
  if (tag) {
    targetList = targetList.filter(p => p.tags.some(t => t.toLowerCase() === String(tag).toLowerCase()));
  }
  if (author) {
    targetList = targetList.filter(p => p.author.name.toLowerCase().includes(String(author).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    targetList = targetList.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.subtitle.toLowerCase().includes(q) ||
      p.content.some(para => para.toLowerCase().includes(q))
    );
  }

  // Handle Paginations
  const pageNum = parseInt(String(page || "1"));
  const limitNum = parseInt(String(limit || "20"));
  const offset = (pageNum - 1) * limitNum;
  const paginated = targetList.slice(offset, offset + limitNum);

  return res.json({
    posts: paginated,
    metadata: {
      totalCount: targetList.length,
      page: pageNum,
      totalPages: Math.ceil(targetList.length / limitNum),
      limit: limitNum
    }
  });
});

app.get("/api/v1/posts/featured", (req, res) => {
  return res.json(localPosts.slice(0, 3));
});

app.get("/api/v1/posts/trending", (req, res) => {
  return res.json([...localPosts].sort((a, b) => b.likes - a.likes).slice(0, 5));
});

app.get("/api/v1/posts/latest", (req, res) => {
  return res.json(localPosts.slice(0, 10));
});

app.get("/api/v1/posts/editors-picks", (req, res) => {
  return res.json(localPosts.filter((_, idx) => idx % 6 === 0));
});

app.get("/api/v1/posts/archive", (req, res) => {
  // Aggregate into archival months
  const grouped: Record<string, number> = {};
  localPosts.forEach(p => {
    const month = p.date || "JUNE 2026";
    const parts = month.split(",");
    const key = parts.length > 1 ? parts[0].trim() : month;
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return res.json(grouped);
});

// Single lookup
app.get("/api/v1/posts/:idOrSlug", (req, res) => {
  const param = req.params.idOrSlug;
  const post = localPosts.find(p => p.id === param || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === param);
  if (!post) {
    return res.status(404).json({ error: "Chronicle not found." });
  }
  return res.json(post);
});

app.get("/api/v1/posts/:idOrSlug/related", (req, res) => {
  const param = req.params.idOrSlug;
  const post = localPosts.find(p => p.id === param);
  if (!post) return res.json(localPosts.slice(0, 3));
  
  const related = localPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  return res.json(related);
});

app.get("/api/v1/posts/:idOrSlug/comments", (req, res) => {
  const param = req.params.idOrSlug;
  const post = localPosts.find(p => p.id === param);
  if (!post) return res.status(404).json({ error: "Timeline target omitted" });
  return res.json(post.comments || []);
});

app.post("/api/v1/posts", (req, res) => {
  const newPost = req.body;
  if (!newPost.id) {
    newPost.id = `post-${Date.now()}`;
  }
  localPosts = [newPost, ...localPosts];
  return res.status(201).json(newPost);
});

app.patch("/api/v1/posts/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  localPosts = localPosts.map(p => {
    if (p.id === id) {
      return { ...p, ...updates };
    }
    return p;
  });
  const matched = localPosts.find(p => p.id === id);
  return res.json(matched);
});

app.delete("/api/v1/posts/:id", (req, res) => {
  const { id } = req.params;
  localPosts = localPosts.filter(p => p.id !== id);
  return res.json({ success: true, id });
});

app.post(["/api/v1/posts/:id/publish", "/api/v1/posts/:id/schedule", "/api/v1/posts/:id/archive_doc"], (req, res) => {
  return res.json({ status: "success", message: "Post transition successfully orchestrated" });
});

app.post("/api/v1/posts/:id/like", (req, res) => {
  const { id } = req.params;
  let score = 0;
  localPosts = localPosts.map(p => {
    if (p.id === id) {
      score = p.likes + 1;
      return { ...p, likes: score };
    }
    return p;
  });
  return res.json({ status: "success", likes: score });
});

app.post("/api/v1/posts/:id/bookmark", (req, res) => {
  return res.json({ bookmarked: true, message: "Added successfully to reading list." });
});

app.post("/api/v1/posts/:id/view", (req, res) => {
  // Analytical logging
  localAnalyticsEvents.push({
    id: `ev-${Date.now()}`,
    eventType: "post_view",
    postId: req.params.id,
    sessionId: "sess-implicit",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla",
    referrer: "",
    country: "Nigeria",
    city: "Lagos",
    deviceType: "mobile",
    metadata: {},
    createdAt: new Date().toISOString()
  });
  return res.json({ success: true });
});

app.post("/api/v1/posts/:id/share", (req, res) => {
  return res.json({ success: true });
});


// ==========================================
// 3. Category Manager: /api/v1/categories
// ==========================================

app.get("/api/v1/categories", (req, res) => {
  // Aggregate real dynamic post count mapping
  const mapped = localCategories.map(cat => {
    const matchingCount = localPosts.filter(p => p.category.toLowerCase() === cat.slug).length;
    return { ...cat, postCount: matchingCount };
  });
  return res.json(mapped);
});

app.get("/api/v1/categories/:slug", (req, res) => {
  const cat = localCategories.find(c => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ error: "Category not resolved" });
  return res.json(cat);
});

app.get("/api/v1/categories/:slug/posts", (req, res) => {
  const matching = localPosts.filter(p => p.category.toLowerCase() === req.params.slug.toLowerCase());
  return res.json(matching);
});

app.post("/api/v1/categories", (req, res) => {
  const incoming = req.body;
  const newCat: CategoryDB = {
    id: `cat-${Date.now()}`,
    name: incoming.name,
    slug: incoming.name.toLowerCase().replace(/[^a-z]+/g, "-"),
    description: incoming.description || "Curated collection",
    manifesto: incoming.manifesto || "Living with luxury and depth.",
    icon: incoming.icon || "Sparkles",
    coverImageUrl: incoming.coverImageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    postCount: 0,
    displayOrder: localCategories.length + 1,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  localCategories.push(newCat);
  return res.status(201).json(newCat);
});

app.patch("/api/v1/categories/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  localCategories = localCategories.map(c => c.id === id ? { ...c, ...updates } : c);
  return res.json(localCategories.find(c => c.id === id));
});

app.delete("/api/v1/categories/:id", (req, res) => {
  localCategories = localCategories.filter(c => c.id !== req.params.id);
  return res.json({ success: true });
});


// ==========================================
// 4. Comments Engine: /api/v1/comments
// ==========================================

app.post("/api/v1/comments", (req, res) => {
  const { postId, author, text } = req.body;
  if (!postId || !text) {
    return res.status(400).json({ error: "Missing postId or comment content body." });
  }

  const commentObj = {
    id: `comment-${Date.now()}`,
    author: author || "Curious Reader",
    text,
    date: "JUNE 1, 2026"
  };

  localPosts = localPosts.map(p => {
    if (p.id === postId) {
      return { ...p, comments: [commentObj, ...(p.comments || [])] };
    }
    return p;
  });

  return res.status(201).json(commentObj);
});

app.patch("/api/v1/comments/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  localPosts = localPosts.map(post => {
    if (post.comments) {
      return {
        ...post,
        comments: post.comments.map(c => c.id === id ? { ...c, text } : c)
      };
    }
    return post;
  });

  return res.json({ success: true });
});

app.delete("/api/v1/comments/:id", (req, res) => {
  const { id } = req.params;
  localPosts = localPosts.map(post => {
    if (post.comments) {
      return {
        ...post,
        comments: post.comments.filter(c => c.id !== id)
      };
    }
    return post;
  });
  return res.json({ success: true });
});

app.post(["/api/v1/comments/:id/like", "/api/v1/comments/:id/approve", "/api/v1/comments/:id/flag"], (req, res) => {
  return res.json({ success: true, message: "Comment validation updated." });
});

app.get("/api/v1/comments/pending", (req, res) => {
  return res.json([]);
});


// ==========================================
// 5. Subscription Hub: /api/v1/newsletter
// ==========================================

app.post("/api/v1/newsletter/subscribe", (req, res) => {
  const { email, fullName } = req.body;
  if (!email) return res.status(400).json({ error: "Email parameter required" });

  const existing = localSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({ message: "Already cataloged in membership registry." });
  }

  const newSub: NewsletterSubscriberDB = {
    id: `sub-${Date.now()}`,
    email,
    fullName: fullName || email.split("@")[0],
    status: "active",
    source: "Web Application Footer",
    confirmedAt: new Date().toISOString(),
    tags: ["new-reader"],
    metadata: { agent: req.headers["user-agent"] },
    createdAt: new Date().toISOString()
  };

  localSubscribers.push(newSub);
  return res.json({ status: "success", subscriber: newSub });
});

app.get("/api/v1/newsletter/confirm/:token", (req, res) => {
  return res.send("<h3>Thank you. Your VIVID newsletter subscription has been securely confirmed.</h3>");
});

app.post("/api/v1/newsletter/unsubscribe", (req, res) => {
  const { email } = req.body;
  localSubscribers = localSubscribers.map(s => s.email === email ? { ...s, status: "unsubscribed", unsubscribedAt: new Date().toISOString() } : s);
  return res.json({ success: true });
});

app.get("/api/v1/newsletter/subscribers", (req, res) => {
  return res.json(localSubscribers);
});

app.post("/api/v1/newsletter/send", (req, res) => {
  return res.json({ success: true, message: "Campaign queued safely to email deliverability system." });
});

app.get("/api/v1/newsletter/campaigns", (req, res) => {
  return res.json([
    { id: "camp-1", subject: "The VIVID Tuesday Letter — Minimal Architectural Lines", sentCount: 1621, openRate: "68.2%", clickRate: "12.4%", date: "MAY 26, 2026" }
  ]);
});

app.post("/api/v1/newsletter/campaigns", (req, res) => {
  return res.json({ success: true });
});

app.get("/api/v1/newsletter/stats", (req, res) => {
  return res.json({
    activeCount: localSubscribers.filter(s => s.status === "active").length,
    pendingCount: localSubscribers.filter(s => s.status === "pending").length,
    bounceRate: "1.1%",
    growthRate: "+12.4% MoM"
  });
});


// ==========================================
// 6. Index & Search: /api/v1/search
// ==========================================

app.get("/api/v1/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  if (!q) return res.json({ hits: [] });

  const hits = localPosts.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.subtitle.toLowerCase().includes(q) || 
    p.tags.some(t => t.toLowerCase().includes(q))
  );

  return res.json({ hits, count: hits.length });
});

app.get("/api/v1/search/suggestions", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const options = ["Mindset Living", "Spatial design", "African food heritage", "Brutalist facade", "Minimalist style"];
  const matches = options.filter(opt => opt.toLowerCase().includes(q));
  return res.json(matches);
});

app.get("/api/v1/search/popular", (req, res) => {
  return res.json(["BRUTALISM", "LAGOS CULINARY", "SARTORIAL SILHOUETTE", "MINDFUL LIVING"]);
});


// ==========================================
// 7. Media Registry: /api/v1/media
// ==========================================

app.get("/api/v1/media", (req, res) => {
  return res.json(localMedia);
});

app.post("/api/v1/media/upload", (req, res) => {
  const incoming = req.body;
  const newMedia: MediaDB = {
    id: `med-${Date.now()}`,
    filename: incoming.filename || "upload.jpg",
    originalName: incoming.filename || "IMG_upload.jpg",
    fileType: incoming.fileType || "image/jpeg",
    fileSize: incoming.fileSize || 120400,
    url: incoming.url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    altText: "Custom uploaded media file asset for VIVID",
    folder: "uploads",
    createdAt: new Date().toISOString()
  };
  localMedia.push(newMedia);
  return res.status(201).json(newMedia);
});


// ==========================================
// 8. User Panel: /api/v1/users
// ==========================================

app.get("/api/v1/users", (req, res) => {
  return res.json(localUsers);
});

app.get("/api/v1/users/:username", (req, res) => {
  const matched = localUsers.find(u => u.username === req.params.username);
  if (!matched) return res.status(404).json({ error: "User profile target deleted." });
  return res.json(matched);
});


// ==========================================
// 9. Playlists & Reading Lists: /api/v1/reading-lists
// ==========================================

app.get("/api/v1/reading-lists", (req, res) => {
  return res.json(localReadingLists);
});

app.get("/api/v1/reading-lists/:slug", (req, res) => {
  const list = localReadingLists.find(l => l.slug === req.params.slug);
  if (!list) return res.status(404).json({ error: "Reading collection target omitted." });
  return res.json(list);
});


// ==========================================
// 10. Site Analytics: /api/v1/analytics
// ==========================================

app.get("/api/v1/analytics/overview", (req, res) => {
  return res.json({
    analyticsId: "vivid-site-wide-metrics-2026",
    uniqueViews: 42100,
    pageClicks: 89400,
    engagementDurationSec: 340,
    bounceRate: "42.1%",
    realtimeActiveReaders: 42
  });
});

app.get("/api/v1/analytics/posts", (req, res) => {
  const list = localPosts.map(p => ({
    postId: p.id,
    title: p.title,
    clicks: p.likes * 12 + p.comments.length * 4,
    likesCount: p.likes,
    commentsCount: p.comments.length
  }));
  return res.json(list);
});

app.get("/api/v1/analytics/traffic", (req, res) => {
  return res.json({
    referrers: [
      { name: "Direct", share: "34.5%" },
      { name: "Twitter/X", share: "28.1%" },
      { name: "Google Search", share: "20.4%" },
      { name: "Instagram", share: "12.0%" },
      { name: "Newsletter Link", share: "5.0%" }
    ]
  });
});

app.get("/api/v1/analytics/realtime", (req, res) => {
  return res.json({
    activeUsersCount: 42,
    latestActivePages: ["/", "/posts/minimalist-architecture", "/category/mindset"],
    timestamp: new Date().toISOString()
  });
});


// ==========================================
// 11. Custom Admin Dashboard Controls: /api/v1/admin
// ==========================================

app.get("/api/v1/admin/dashboard", (req, res) => {
  return res.json({
    systemHealth: "Prisintely Active",
    postsCount: localPosts.length,
    usersCount: localUsers.length,
    subscribersCount: localSubscribers.length,
    totalComments: getFlatComments().length
  });
});

app.get("/api/v1/admin/system/health", (req, res) => {
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: '141d 2h 45m',
    database: db ? 'connected_supabase' : 'in_memory_sandbox_integrated',
    redis: 'in_memory_caching_layer_ready',
    algolia: 'reindexed_active',
    queues: {
      email: { waiting: 0, active: 0, failed: 0 },
      media: { waiting: 0, active: 0, failed: 0 }
    },
    memory: {
      used: '124MB',
      total: '512MB'
    },
    version: '2.4.1'
  });
});


// =========================================================================
// 🔄 BACKWARDS COMPATIBILITY FOR LEGACY SYSTEM API ROUTERS
// =========================================================================

app.get("/api/posts", async (req, res) => {
  if (db) {
    try {
      const { data, error } = await db
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return res.json(localPosts);
      }

      if (data && data.length > 0) {
        const mappedPosts = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          category: d.category,
          author: d.author,
          date: d.date,
          readTime: d.read_time,
          content: d.content,
          quotes: d.quotes || [],
          imageUrl: d.image_url,
          tags: d.tags,
          likes: d.likes,
          comments: d.comments || []
        }));
        return res.json(mappedPosts);
      }
    } catch (err) {
      console.error("Database connection failed, fallback to local:", err);
    }
  }
  return res.json(localPosts);
});

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.cookies && req.cookies.admin_token === "secure_admin_jwt_123") {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized admin access." });
};

app.post("/api/posts", requireAdmin, async (req, res) => {
  const newPost = req.body;
  if (!newPost.id) {
    newPost.id = `post-${Date.now()}`;
  }
  localPosts = [newPost, ...localPosts];

  if (db) {
    try {
      await db.from("posts").insert({
        id: newPost.id,
        title: newPost.title,
        subtitle: newPost.subtitle,
        category: newPost.category,
        author: newPost.author,
        date: newPost.date,
        read_time: newPost.readTime,
        content: newPost.content,
        quotes: newPost.quotes || [],
        image_url: newPost.imageUrl,
        tags: newPost.tags,
        likes: newPost.likes || 0,
        comments: newPost.comments || []
      });
    } catch (err) {
      console.error("Supabase insert crash:", err);
    }
  }
  return res.status(201).json(newPost);
});

app.post("/api/posts/:id/like", async (req, res) => {
  const { id } = req.params;
  const { increment } = req.body;

  localPosts = localPosts.map(p => {
    if (p.id === id) {
      return { ...p, likes: Math.max(0, p.likes + (increment || 1)) };
    }
    return p;
  });

  const post = localPosts.find(p => p.id === id);

  if (db && post) {
    try {
      await db.from("posts").update({ likes: post.likes }).eq("id", id);
    } catch (err) {
      console.error("Supabase like counter failure:", err);
    }
  }

  return res.json({ likes: post ? post.likes : 0 });
});

app.post("/api/posts/:id/comment", async (req, res) => {
  const { id } = req.params;
  const comment = req.body;

  localPosts = localPosts.map(p => {
    if (p.id === id) {
      return { ...p, comments: [comment, ...p.comments] };
    }
    return p;
  });

  const post = localPosts.find(p => p.id === id);

  if (db && post) {
    try {
      await db.from("posts").update({ comments: post.comments }).eq("id", id);
    } catch (err) {
      console.error("Supabase comments trigger failure:", err);
    }
  }

  return res.json({ comments: post ? post.comments : [] });
});

app.put("/api/posts/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;

  localPosts = localPosts.map(p => p.id === id ? { ...p, ...updatedPost } : p);

  if (db) {
    try {
      await db.from("posts").update({
        title: updatedPost.title,
        subtitle: updatedPost.subtitle,
        category: updatedPost.category,
        author: updatedPost.author,
        date: updatedPost.date,
        read_time: updatedPost.readTime,
        content: updatedPost.content,
        quotes: updatedPost.quotes || [],
        image_url: updatedPost.imageUrl,
        tags: updatedPost.tags,
        likes: updatedPost.likes,
        comments: updatedPost.comments || []
      }).eq("id", id);
    } catch (err) {
      console.error("Supabase update error:", err);
    }
  }

  return res.json(updatedPost);
});

app.delete("/api/posts/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  localPosts = localPosts.filter(p => p.id !== id);

  if (db) {
    try {
      await db.from("posts").delete().eq("id", id);
    } catch (err) {
      console.error("Supabase delete failure:", err);
    }
  }

  return res.json({ success: true, id });
});

app.post("/api/posts/purge", requireAdmin, async (req, res) => {
  localPosts = [];

  if (db) {
    try {
      await db.from("posts").delete().neq("id", "none_to_match_all");
    } catch (err) {
      console.error("Supabase purge error:", err);
    }
  }

  return res.json({ success: true, count: 0 });
});


// ==========================================
// 🔌 SERVE STATIC FRONTEND VITE INTEGRATION
// ==========================================

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
