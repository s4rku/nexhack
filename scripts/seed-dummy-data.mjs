import { MongoClient } from "mongodb";
import fs from "fs";

// Load .env.local manually if exists
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.log("No .env.local found, using process.env");
}

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexhack";
const dbName = process.env.MONGODB_DB || "nexhack";

console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function seed() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    const db = client.db(dbName);

    const now = new Date().toISOString();

    // 1. Hackathon dummy data
    const dummyHackathon = {
      id: "nexhack-ai-innovate-2026",
      name: "NEXHACK AI Innovation Summit",
      edition: "Special Track 2026",
      tagline: "Building Autonomous Agents & Intelligent Workflows",
      description: "A fast-paced 48-hour global sprint challenging developers to create next-generation autonomous software and open-source generative tools.",
      status: "Upcoming",
      mode: "Hybrid",
      location: "Bengaluru Innovation Hub + Discord Track",
      dateRange: "November 14-16, 2026",
      prizePool: "₹2,50,000 + Cloud Grants",
      registeredCount: 142,
      tags: ["AI & Machine Learning", "Autonomous Agents", "Open Source", "Next.js"],
      bannerGradient: "from-blue-600 via-indigo-600 to-purple-600",
      tracks: [
        {
          title: "Intelligent Agent Workflows",
          desc: "Create self-orchestrating multi-agent systems that automate real developer tasks.",
          icon: "Bot",
        },
        {
          title: "Campus & Student Productivity",
          desc: "Tools designed to enhance learning, hackathon coordination, or collaboration.",
          icon: "GraduationCap",
        },
        {
          title: "Decentralized & Open Web",
          desc: "Open source protocols and developer utility libraries.",
          icon: "Globe",
        },
      ],
      prizes: [
        { place: "Grand Champion (1st)", reward: "₹1,20,000 Cash + Cloud Credits", perks: "Fast-track VC Pitch + Mentorship" },
        { place: "1st Runner Up (2nd)", reward: "₹80,000 Cash", perks: "Developer Swag Kit + Pro Licenses" },
        { place: "Best Student Innovation", reward: "₹50,000 Grant", perks: "Direct Entry to NEXHACK Incubator" },
      ],
      eligibility: "Open to undergraduate, postgraduate students, and early-career builders worldwide.",
      featured: true,
      createdAt: now,
      updatedAt: now,
    };

    // 2. Event Sessions (One for EVERY Category!)
    // Categories: "AI & Machine Learning" | "Web Development" | "Cloud & DevOps" | "Startups & Career"
    const dummyEvents = [
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 3. Registration dummy data
    const dummyRegistration = {
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
      createdAt: now,
    };

    // 4. Campus Inquiry dummy data
    const dummyInquiry = {
      id: "inq-demo-campus-2026",
      institutionName: "National Institute of Engineering & Technology",
      contactName: "Prof. Sunita Deshmukh",
      contactEmail: "head.cse@niet-edu.ac.in",
      city: "Pune, Maharashtra",
      partnershipType: "Host Campus Hackathon",
      expectedStudents: "500+ Engineering Students",
      notes: "Interested in organizing a regional zonal hackathon and AI workshop series with NEXHACK mentors for our 2026-27 tech symposium.",
      status: "Pending",
      createdAt: now,
    };

    // 5. Newsletter dummy data
    const dummyNewsletter = {
      id: "sub-demo-reader-2026",
      email: "dev.community.member@gmail.com",
      source: "Homepage Hero Subscription",
      status: "Subscribed",
      createdAt: now,
    };

    // 6. Admin Log dummy data
    const dummyLog = {
      id: "log-seed-dummy-data",
      action: "Initial Seed Data",
      target: "All Categories (Hackathons, Events, Registrations, Inquiries, Newsletters)",
      timestamp: now,
      performedBy: "NEXHACK System",
    };

    // Upsert Hackathon
    await db.collection("hackathons").updateOne(
      { id: dummyHackathon.id },
      { $set: dummyHackathon },
      { upsert: true }
    );
    console.log("✓ Hackathon dummy data inserted/updated");

    // Upsert Events
    for (const evt of dummyEvents) {
      await db.collection("events").updateOne(
        { id: evt.id },
        { $set: evt },
        { upsert: true }
      );
      console.log(`✓ Event (${evt.category}) dummy data inserted/updated: ${evt.title}`);
    }

    // Upsert Registration
    await db.collection("registrations").updateOne(
      { id: dummyRegistration.id },
      { $set: dummyRegistration },
      { upsert: true }
    );
    console.log("✓ Registration dummy data inserted/updated");

    // Upsert Campus Inquiry
    await db.collection("campus_inquiries").updateOne(
      { id: dummyInquiry.id },
      { $set: dummyInquiry },
      { upsert: true }
    );
    console.log("✓ Campus Inquiry dummy data inserted/updated");

    // Upsert Newsletter
    await db.collection("newsletters").updateOne(
      { email: dummyNewsletter.email },
      { $set: dummyNewsletter },
      { upsert: true }
    );
    console.log("✓ Newsletter subscriber dummy data inserted/updated");

    // Upsert Admin Log
    await db.collection("admin_logs").updateOne(
      { id: dummyLog.id },
      { $set: dummyLog },
      { upsert: true }
    );
    console.log("✓ Admin Log dummy data inserted/updated");

    // Fetch and display counts
    const [hCount, eCount, rCount, iCount, nCount, lCount] = await Promise.all([
      db.collection("hackathons").countDocuments(),
      db.collection("events").countDocuments(),
      db.collection("registrations").countDocuments(),
      db.collection("campus_inquiries").countDocuments(),
      db.collection("newsletters").countDocuments(),
      db.collection("admin_logs").countDocuments(),
    ]);

    console.log("\n--- Database Summary After Seeding ---");
    console.log(`Hackathons count: ${hCount}`);
    console.log(`Events count: ${eCount}`);
    console.log(`Registrations count: ${rCount}`);
    console.log(`Campus Inquiries count: ${iCount}`);
    console.log(`Newsletters count: ${nCount}`);
    console.log(`Admin Logs count: ${lCount}`);
    console.log("---------------------------------------\n");

  } catch (err) {
    console.error("Error during database seed:", err);
  } finally {
    await client.close();
  }
}

seed();
