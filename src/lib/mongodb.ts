import { MongoClient, Db } from "mongodb";
import { HACKATHONS_DATA, ALL_EVENTS_DATA } from "@/data/nexhackData";
import {
  DbHackathon,
  DbEventSession,
  DbRegistration,
  DbCampusInquiry,
  DbNewsletter,
  DbAdminLog,
  DbAdminOtp,
} from "./dbTypes";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexhack";
const dbName = process.env.MONGODB_DB || "nexhack";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isConnected = false;

// In-memory fallback stores for high resilience
const inMemoryStore = {
  hackathons: [
    {
      id: "nexhack-3",
      slug: "nexhack-3-0",
      name: "NEXHACK 3.0",
      edition: "Flagship Edition",
      tagline: "The Future Starts Here",
      description:
        "The premier student hackathon bringing together passionate developers, designers, and innovators to solve pressing challenges in modern technology.",
      status: "Upcoming",
      mode: "Hybrid",
      location: "Bengaluru + Online Track",
      dateRange: "Announcing Soon (Late 2026)",
      prizePool: "Cash Grants & Perks",
      registeredCount: 0,
      tags: ["AI & ML", "Web3", "Full Stack", "Open Innovation"],
      bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
      tracks: [
        {
          title: "Artificial Intelligence & Automation",
          desc: "Build AI agents, machine learning workflows, and practical automated tooling.",
          icon: "Bot",
        },
        {
          title: "Web & Mobile Experiences",
          desc: "Create responsive, accessible, high-performance applications that solve student and campus needs.",
          icon: "Smartphone",
        },
        {
          title: "Open Innovation",
          desc: "Propose and prototype your own original product or software solution.",
          icon: "Lightbulb",
        },
      ],
      prizes: [
        { place: "Top Team", reward: "Prize Pool & Trophy", perks: "Mentorship & Incubation Support" },
        { place: "Track Winners", reward: "Category Awards", perks: "Developer Merchandise & Certificates" },
      ],
      eligibility: "Open to all verified high school and college students.",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as unknown as DbHackathon[],
  events: [
    {
      id: "evt-ai-ml-agents",
      title: "Hands-on: Engineering Multi-Agent Systems with Modern LLMs",
      category: "AI & Machine Learning",
      speaker: {
        name: "Dr. Aakash Sharma",
        role: "Lead AI Researcher",
        company: "Nexus AI Labs",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: "October 18, 2026",
      time: "6:30 PM IST",
      duration: "75 mins",
      mode: "Virtual Workshop",
      seatsLeft: 84,
      level: "Intermediate",
      highlights: [
        "Architecting LangGraph & multi-agent loops",
        "Structured JSON outputs and deterministic tool calling",
        "Deploying production-grade inference APIs",
      ],
      isCallForSpeakers: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "evt-webdev-fullstack",
      title: "Building Production Web Apps with Next.js 16 & Server Components",
      category: "Web Development",
      speaker: {
        name: "Rhea Sen",
        role: "Staff Frontend Architect",
        company: "Veloce Technologies",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: "October 24, 2026",
      time: "5:00 PM IST",
      duration: "90 mins",
      mode: "Virtual Workshop",
      seatsLeft: 110,
      level: "Beginner",
      highlights: [
        "Streaming SSR and Suspense boundaries in action",
        "Zero-runtime Tailwind CSS v4 patterns",
        "Full-stack CRUD with MongoDB Atlas",
      ],
      isCallForSpeakers: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "evt-cloud-devops",
      title: "Zero-Downtime Deployment & Kubernetes Clusters for Microservices",
      category: "Cloud & DevOps",
      speaker: {
        name: "Vikram Malhotra",
        role: "DevOps & Cloud Specialist",
        company: "CloudScale Infra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: "November 02, 2026",
      time: "7:00 PM IST",
      duration: "60 mins",
      mode: "Live Stream",
      seatsLeft: 65,
      level: "Advanced",
      highlights: [
        "Docker container security and image optimization",
        "Automated GitHub Actions CI/CD pipelines",
        "Real-time logging, metrics & Grafana monitoring",
      ],
      isCallForSpeakers: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "evt-startup-career",
      title: "From College Project to Funded Startup: The Technical Founder Playbook",
      category: "Startups & Career",
      speaker: {
        name: "Aditi Rao",
        role: "Founder & YC Alum",
        company: "LaunchStack Studio",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: "November 09, 2026",
      time: "6:00 PM IST",
      duration: "60 mins",
      mode: "Campus Keynote",
      seatsLeft: 150,
      level: "Beginner",
      highlights: [
        "Validating hacker problems into viable SaaS ideas",
        "Building effective MVPs in 14 days",
        "Cracking remote engineering and founder fellowships",
      ],
      isCallForSpeakers: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as DbEventSession[],
  registrations: [
    {
      id: "reg-demo-student-2026",
      fullName: "Arjun Verma",
      email: "arjun.verma@student.edu",
      phone: "+91 98765 43210",
      collegeOrSchool: "Indian Institute of Information Technology (IIIT)",
      degreeOrGrade: "B.Tech Computer Science (3rd Year)",
      eventOrHackathon: "NEXHACK AI Innovation Summit",
      role: "Hacker / Participant",
      teamName: "NeuralSquad",
      githubUrl: "https://github.com/arjunverma-dev",
      linkedinUrl: "https://linkedin.com/in/arjun-verma-coder",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    },
  ] as DbRegistration[],
  inquiries: [
    {
      id: "inq-demo-campus-2026",
      institutionName: "National Institute of Engineering & Technology",
      contactName: "Prof. Sunita Deshmukh",
      contactEmail: "head.cse@niet-edu.ac.in",
      city: "Pune, Maharashtra",
      partnershipType: "Host Campus Hackathon",
      expectedStudents: "500+ Engineering Students",
      notes: "Interested in organizing a regional zonal hackathon and AI workshop series with NEXHACK mentors for our 2026-27 tech symposium.",
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  ] as DbCampusInquiry[],
  newsletters: [
    {
      id: "sub-demo-reader-2026",
      email: "dev.community.member@gmail.com",
      source: "Homepage Hero Subscription",
      status: "Subscribed",
      createdAt: new Date().toISOString(),
    },
  ] as DbNewsletter[],
  logs: [
    {
      id: "log-seed-dummy-data",
      action: "Initial Seed Data",
      target: "All Categories (Hackathons, Events, Registrations, Inquiries, Newsletters)",
      timestamp: new Date().toISOString(),
      performedBy: "NEXHACK System",
    },
  ] as DbAdminLog[],
  otps: [] as DbAdminOtp[],
};

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null; isUsingMongo: boolean }> {
  if (cachedClient && cachedDb && isConnected) {
    return { client: cachedClient, db: cachedDb, isUsingMongo: true };
  }

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    isConnected = true;

    // Ensure collections exist without injecting any dummy records
    await seedMongoIfEmpty(db);

    return { client, db, isUsingMongo: true };
  } catch {
    // If MongoDB is not actively running locally yet, fallback seamlessly to inMemoryStore
    return { client: null, db: null, isUsingMongo: false };
  }
}

async function seedMongoIfEmpty(db: Db) {
  try {
    // Only seed the primary NEXHACK 3.0 hackathon if hackathons collection is completely empty
    const hackathonsCount = await db.collection("hackathons").countDocuments();
    if (hackathonsCount === 0 && inMemoryStore.hackathons.length > 0) {
      await db.collection("hackathons").insertMany(inMemoryStore.hackathons as any[]);
    }
    // No dummy registrations, inquiries, newsletters or mock events are seeded.
    // Real data will come strictly from user and admin actions.
  } catch (err) {
    console.error("MongoDB init notice:", err);
  }
}

// -------------------------------------------------------------
// Unified Data Access API
// Seamlessly delegates to real MongoDB when available, or inMemoryStore
// -------------------------------------------------------------

export const dbService = {
  // 1. STATS
  async getDashboardStats() {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const [hackathons, events, registrations, inquiries, newsletters] = await Promise.all([
        db.collection("hackathons").countDocuments(),
        db.collection("events").countDocuments(),
        db.collection("registrations").countDocuments(),
        db.collection("campus_inquiries").countDocuments(),
        db.collection("newsletters").countDocuments(),
      ]);
      return {
        hackathons,
        events,
        registrations,
        inquiries,
        newsletters,
        isUsingMongo: true,
      };
    }
    return {
      hackathons: inMemoryStore.hackathons.length,
      events: inMemoryStore.events.length,
      registrations: inMemoryStore.registrations.length,
      inquiries: inMemoryStore.inquiries.length,
      newsletters: inMemoryStore.newsletters.length,
      isUsingMongo: false,
    };
  },

  // 2. HACKATHONS
  async getHackathons(): Promise<DbHackathon[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("hackathons").find({}).sort({ createdAt: -1 }).toArray();
      return list as unknown as DbHackathon[];
    }
    return [...inMemoryStore.hackathons];
  },

  async addHackathon(hackathon: Partial<DbHackathon>): Promise<DbHackathon> {
    const newDoc: DbHackathon = {
      id: `nexhack-${Date.now()}`,
      name: hackathon.name || "New Hackathon",
      edition: hackathon.edition || "Campus Edition",
      tagline: hackathon.tagline || "Innovate & Build",
      description: hackathon.description || "",
      status: hackathon.status || "Upcoming",
      mode: hackathon.mode || "Hybrid",
      location: hackathon.location || "Online",
      dateRange: hackathon.dateRange || "Coming Soon",
      prizePool: hackathon.prizePool || "Grants & Swag",
      registeredCount: 0,
      tags: hackathon.tags || ["AI", "Web Dev"],
      bannerGradient: hackathon.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500",
      tracks: hackathon.tracks || [{ title: "Open Track", desc: "Build whatever you want", icon: "Lightbulb" }],
      prizes: hackathon.prizes || [{ place: "Winner", reward: "Prize Grant", perks: "Winner Certificate" }],
      eligibility: hackathon.eligibility || "Open to all students",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("hackathons").insertOne(newDoc as any);
    } else {
      inMemoryStore.hackathons.unshift(newDoc);
    }
    await this.logAction("Created Hackathon", newDoc.name, "Admin");
    return newDoc;
  },

  async updateHackathon(id: string, updates: Partial<DbHackathon>): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("hackathons").updateOne(
        { id },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      await this.logAction("Updated Hackathon", id, "Admin");
      return res.matchedCount > 0;
    }
    const idx = inMemoryStore.hackathons.findIndex((h) => h.id === id);
    if (idx !== -1) {
      inMemoryStore.hackathons[idx] = {
        ...inMemoryStore.hackathons[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await this.logAction("Updated Hackathon", id, "Admin");
      return true;
    }
    return false;
  },

  async deleteHackathon(id: string): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("hackathons").deleteOne({ id });
      await this.logAction("Deleted Hackathon", id, "Admin");
      return res.deletedCount > 0;
    }
    const idx = inMemoryStore.hackathons.findIndex((h) => h.id === id);
    if (idx !== -1) {
      inMemoryStore.hackathons.splice(idx, 1);
      await this.logAction("Deleted Hackathon", id, "Admin");
      return true;
    }
    return false;
  },

  // 3. EVENTS / WORKSHOPS
  async getEvents(): Promise<DbEventSession[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("events").find({}).sort({ createdAt: -1 }).toArray();
      return list as unknown as DbEventSession[];
    }
    return [...inMemoryStore.events];
  },

  async addEvent(event: Partial<DbEventSession>): Promise<DbEventSession> {
    const newDoc: DbEventSession = {
      id: `evt-${Date.now()}`,
      title: event.title || "New Workshop",
      category: event.category || "Web Development",
      speaker: event.speaker || {
        name: "NEXHACK Mentor",
        role: "Technical Lead",
        company: "NEXHACK Community",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: event.date || "Upcoming Weekend",
      time: event.time || "6:00 PM IST",
      duration: event.duration || "60 mins",
      mode: event.mode || "Virtual Workshop",
      seatsLeft: event.seatsLeft || 100,
      level: event.level || "Beginner",
      highlights: event.highlights || ["Interactive code-along", "Working project deployment"],
      isCallForSpeakers: event.isCallForSpeakers || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("events").insertOne(newDoc as any);
    } else {
      inMemoryStore.events.unshift(newDoc);
    }
    await this.logAction("Created Event", newDoc.title, "Admin");
    return newDoc;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("events").deleteOne({ id });
      await this.logAction("Deleted Event", id, "Admin");
      return res.deletedCount > 0;
    }
    const idx = inMemoryStore.events.findIndex((e) => e.id === id);
    if (idx !== -1) {
      inMemoryStore.events.splice(idx, 1);
      await this.logAction("Deleted Event", id, "Admin");
      return true;
    }
    return false;
  },

  // 4. REGISTRATIONS
  async getRegistrations(): Promise<DbRegistration[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("registrations").find({}).sort({ createdAt: -1 }).toArray();
      return list as unknown as DbRegistration[];
    }
    return [...inMemoryStore.registrations];
  },

  async addRegistration(reg: Partial<DbRegistration>): Promise<DbRegistration> {
    const newDoc: DbRegistration = {
      id: `reg-${Date.now()}`,
      fullName: reg.fullName || "Student Coder",
      email: reg.email || "",
      phone: reg.phone || "",
      collegeOrSchool: reg.collegeOrSchool || "College",
      degreeOrGrade: reg.degreeOrGrade || "",
      eventOrHackathon: reg.eventOrHackathon || "General Community",
      role: reg.role || "Hacker / Participant",
      teamName: reg.teamName || "Solo",
      githubUrl: reg.githubUrl || "",
      linkedinUrl: reg.linkedinUrl || "",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("registrations").insertOne(newDoc as any);
    } else {
      inMemoryStore.registrations.unshift(newDoc);
    }
    await this.logAction("New Registration", `${newDoc.fullName} (${newDoc.eventOrHackathon})`, "Public");
    return newDoc;
  },

  async updateRegistrationStatus(id: string, status: DbRegistration["status"]): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("registrations").updateOne({ id }, { $set: { status } });
      await this.logAction("Updated Registration Status", `${id} -> ${status}`, "Admin");
      return res.matchedCount > 0;
    }
    const item = inMemoryStore.registrations.find((r) => r.id === id);
    if (item) {
      item.status = status;
      await this.logAction("Updated Registration Status", `${id} -> ${status}`, "Admin");
      return true;
    }
    return false;
  },

  async deleteRegistration(id: string): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("registrations").deleteOne({ id });
      await this.logAction("Deleted Registration", id, "Admin");
      const idx = inMemoryStore.registrations.findIndex((r) => r.id === id);
      if (idx !== -1) inMemoryStore.registrations.splice(idx, 1);
      return res.deletedCount > 0;
    }
    const idx = inMemoryStore.registrations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      inMemoryStore.registrations.splice(idx, 1);
      await this.logAction("Deleted Registration", id, "Admin");
      return true;
    }
    return false;
  },

  // 5. CAMPUS PARTNER INQUIRIES
  async getInquiries(): Promise<DbCampusInquiry[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("campus_inquiries").find({}).sort({ createdAt: -1 }).toArray();
      return list as unknown as DbCampusInquiry[];
    }
    return [...inMemoryStore.inquiries];
  },

  async addInquiry(inquiry: Partial<DbCampusInquiry>): Promise<DbCampusInquiry> {
    const newDoc: DbCampusInquiry = {
      id: `inq-${Date.now()}`,
      institutionName: inquiry.institutionName || "",
      contactName: inquiry.contactName || "",
      contactEmail: inquiry.contactEmail || "",
      city: inquiry.city || "",
      partnershipType: inquiry.partnershipType || "Host Campus Hackathon",
      expectedStudents: inquiry.expectedStudents || "200-500 students",
      notes: inquiry.notes || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("campus_inquiries").insertOne(newDoc as any);
    } else {
      inMemoryStore.inquiries.unshift(newDoc);
    }
    await this.logAction("New Campus Inquiry", newDoc.institutionName, "Public");
    return newDoc;
  },

  async updateInquiryStatus(id: string, status: DbCampusInquiry["status"]): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("campus_inquiries").updateOne({ id }, { $set: { status } });
      await this.logAction("Updated Inquiry Status", `${id} -> ${status}`, "Admin");
      return res.matchedCount > 0;
    }
    const item = inMemoryStore.inquiries.find((i) => i.id === id);
    if (item) {
      item.status = status;
      await this.logAction("Updated Inquiry Status", `${id} -> ${status}`, "Admin");
      return true;
    }
    return false;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("campus_inquiries").deleteOne({ id });
      await this.logAction("Deleted Campus Inquiry", id, "Admin");
      const idx = inMemoryStore.inquiries.findIndex((i) => i.id === id);
      if (idx !== -1) inMemoryStore.inquiries.splice(idx, 1);
      return res.deletedCount > 0;
    }
    const idx = inMemoryStore.inquiries.findIndex((i) => i.id === id);
    if (idx !== -1) {
      inMemoryStore.inquiries.splice(idx, 1);
      await this.logAction("Deleted Campus Inquiry", id, "Admin");
      return true;
    }
    return false;
  },

  // 6. NEWSLETTERS
  async getNewsletters(): Promise<DbNewsletter[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("newsletters").find({}).sort({ createdAt: -1 }).toArray();
      return list as unknown as DbNewsletter[];
    }
    return [...inMemoryStore.newsletters];
  },

  async addNewsletter(email: string, source: string = "Website"): Promise<DbNewsletter> {
    const newDoc: DbNewsletter = {
      id: `sub-${Date.now()}`,
      email,
      source,
      status: "Subscribed",
      createdAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("newsletters").updateOne(
        { email },
        { $setOnInsert: newDoc },
        { upsert: true }
      );
    } else {
      const exists = inMemoryStore.newsletters.find((n) => n.email === email);
      if (!exists) inMemoryStore.newsletters.unshift(newDoc);
    }
    await this.logAction("New Newsletter Subscriber", email, "Public");
    return newDoc;
  },

  async deleteNewsletter(id: string): Promise<boolean> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const res = await db.collection("newsletters").deleteOne({ $or: [{ id }, { email: id }] });
      await this.logAction("Deleted Newsletter Subscriber", id, "Admin");
      const idx = inMemoryStore.newsletters.findIndex((n) => n.id === id || n.email === id);
      if (idx !== -1) inMemoryStore.newsletters.splice(idx, 1);
      return res.deletedCount > 0;
    }
    const idx = inMemoryStore.newsletters.findIndex((n) => n.id === id || n.email === id);
    if (idx !== -1) {
      inMemoryStore.newsletters.splice(idx, 1);
      await this.logAction("Deleted Newsletter Subscriber", id, "Admin");
      return true;
    }
    return false;
  },

  // 7. AUDIT LOGS
  async getLogs(): Promise<DbAdminLog[]> {
    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      const list = await db.collection("admin_logs").find({}).sort({ timestamp: -1 }).limit(50).toArray();
      return list as unknown as DbAdminLog[];
    }
    return inMemoryStore.logs.slice(0, 50);
  },

  async logAction(action: string, target: string, performedBy: string = "Admin") {
    const logDoc: DbAdminLog = {
      id: `log-${Date.now()}`,
      action,
      target,
      timestamp: new Date().toISOString(),
      performedBy,
    };
    try {
      const { db, isUsingMongo } = await connectToDatabase();
      if (isUsingMongo && db) {
        await db.collection("admin_logs").insertOne(logDoc as any);
      } else {
        inMemoryStore.logs.unshift(logDoc);
      }
    } catch {
      inMemoryStore.logs.unshift(logDoc);
    }
  },

  // 8. ADMIN OTP AUTHENTICATION
  async saveOtp(email: string, otp: string, expiresInMinutes: number = 10): Promise<void> {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    const otpDoc: DbAdminOtp = {
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      expiresAt,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    const { db, isUsingMongo } = await connectToDatabase();
    if (isUsingMongo && db) {
      await db.collection("admin_otps").updateOne(
        { email: otpDoc.email },
        { $set: otpDoc },
        { upsert: true }
      );
    } else {
      const idx = inMemoryStore.otps.findIndex((o) => o.email === otpDoc.email);
      if (idx !== -1) {
        inMemoryStore.otps[idx] = otpDoc;
      } else {
        inMemoryStore.otps.push(otpDoc);
      }
    }
  },

  async verifyOtp(
    email: string,
    enteredOtp: string
  ): Promise<{ success: boolean; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = enteredOtp.trim();

    let record: DbAdminOtp | null = null;
    const { db, isUsingMongo } = await connectToDatabase();

    if (isUsingMongo && db) {
      const doc = await db.collection("admin_otps").findOne({ email: normalizedEmail });
      record = doc as unknown as DbAdminOtp | null;
    } else {
      record = inMemoryStore.otps.find((o) => o.email === normalizedEmail) || null;
    }

    if (!record) {
      return { success: false, error: "No verification code found. Please request a new OTP." };
    }

    if (Date.now() > record.expiresAt) {
      return { success: false, error: "Verification code has expired. Please request a new code." };
    }

    if (record.otp !== cleanOtp) {
      return { success: false, error: "Invalid verification code. Please check and try again." };
    }

    // Mark as used or remove
    if (isUsingMongo && db) {
      await db.collection("admin_otps").deleteOne({ email: normalizedEmail });
    } else {
      const idx = inMemoryStore.otps.findIndex((o) => o.email === normalizedEmail);
      if (idx !== -1) inMemoryStore.otps.splice(idx, 1);
    }

    await this.logAction("Admin Logged In via Email OTP", normalizedEmail, "Admin");

    return { success: true };
  },
};
