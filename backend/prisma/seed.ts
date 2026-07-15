import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_AGENT_EMAIL = "agent@estatecall.com";
const DEMO_PASSWORD = "password123";

async function main() {
  // 1. Create (or reuse) the Supabase auth user for the demo agent
  let authUserId: string;
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existing = existingUsers.users.find((u) => u.email === DEMO_AGENT_EMAIL);

  if (existing) {
    authUserId = existing.id;
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: DEMO_AGENT_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "agent" },
    });
    if (error || !data.user) throw error ?? new Error("Failed to create demo agent auth user");
    authUserId = data.user.id;
  }

  // 2. Create the domain Agent profile linked to that Supabase user
  const agent = await prisma.agent.upsert({
    where: { authUserId },
    update: {},
    create: {
      authUserId,
      email: DEMO_AGENT_EMAIL,
      fullName: "The Blockchain Coders",
      companyName: "EstateCall Demo Agency",
      subscriptionStatus: "ACTIVE",
    },
  });

  const aiAgent = await prisma.aIAgent.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      agentId: agent.id,
      name: "Alexis",
      specialty: "Residential",
      greetingScript:
        "Hello, thank you for calling. I'm Alexis, your AI real estate assistant. I can help you schedule a property viewing, answer questions about our listings, or connect you with one of our agents. How can I assist you today?",
    },
  });

  // 3. Seed the exact listings referenced in the product walkthrough transcript
  await prisma.property.createMany({
    skipDuplicates: true,
    data: [
      {
        agentId: agent.id,
        aiAgentId: aiAgent.id,
        title: "8 Bedrooms High Time by @theblockchaincoders",
        propertyType: "RESIDENTIAL",
        listingType: "SALE",
        status: "AVAILABLE",
        price: 23456,
        priceType: "FIXED",
        bedrooms: 5,
        bathrooms: 3,
        areaSqft: 2345,
        addressLine: "Real Estate Engineer Office, 12345",
        amenities: ["security system", "laundry", "storage", "solar panels", "smart home", "gym", "pet friendly", "air conditioning", "fireplace", "balcony", "garden", "garage"],
      },
      {
        agentId: agent.id,
        aiAgentId: aiAgent.id,
        title: "6 Bedrooms - Commercial by @theblockchaincoders",
        propertyType: "COMMERCIAL",
        listingType: "RENT",
        status: "AVAILABLE",
        price: 50000,
        priceType: "MONTHLY",
        bedrooms: 6,
        bathrooms: 0,
        addressLine: "Marine Engineer Office, Real Estate Are",
      },
      {
        agentId: agent.id,
        aiAgentId: aiAgent.id,
        title: "Townhouse by @theblockchaincoders",
        propertyType: "TOWNHOUSE",
        listingType: "RENT",
        status: "AVAILABLE",
        price: 10000,
        priceType: "MONTHLY",
        bedrooms: 3,
        bathrooms: 2,
        addressLine: "Marine Engineer Office, Real Estate Are",
      },
      {
        agentId: agent.id,
        aiAgentId: aiAgent.id,
        title: "4 Bedroom House by @theblockchaincoders",
        propertyType: "RESIDENTIAL",
        listingType: "RENT",
        status: "AVAILABLE",
        price: 45000,
        priceType: "MONTHLY",
        bedrooms: 5,
        bathrooms: 3,
        areaSqft: 26999,
        addressLine: "12345, @theblockchaincoders, Real Estate Are",
        amenities: ["pool", "garage", "garden", "balcony", "fireplace", "air conditioning"],
      },
    ],
  });

  console.log(`Seed complete. Agent login (Supabase Auth): ${DEMO_AGENT_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
