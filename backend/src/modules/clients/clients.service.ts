import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";

export const clientsService = {
  // The dashboard's "Clients" tab: everyone who has ever booked with this agent
  listForAgent(agentId: string) {
    return prisma.client.findMany({
      where: { appointments: { some: { assignedAgentId: agentId } } },
      include: {
        appointments: {
          where: { assignedAgentId: agentId },
          orderBy: { scheduledDate: "desc" },
          include: { property: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(agentId: string, id: string) {
    const client = await prisma.client.findFirst({
      where: { id, appointments: { some: { assignedAgentId: agentId } } },
      include: {
        appointments: { where: { assignedAgentId: agentId }, include: { property: true, payment: true } },
        supportTickets: { where: { agentId } },
      },
    });
    if (!client) throw ApiError.notFound("Client not found");
    return client;
  },
};
