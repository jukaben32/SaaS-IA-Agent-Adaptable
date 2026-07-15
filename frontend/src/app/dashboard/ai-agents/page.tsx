"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AIAgent } from "@/types";
import { Bot, Plus, X } from "lucide-react";

export default function AIAgentsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [greeting, setGreeting] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["ai-agents"],
    queryFn: () => api.get<AIAgent[]>("/ai-agents"),
  });

  const create = useMutation({
    mutationFn: () =>
      api.post<AIAgent>("/ai-agents", {
        name,
        specialty: specialty || undefined,
        greetingScript: greeting || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agents"] });
      setShowForm(false);
      setName("");
      setSpecialty("");
      setGreeting("");
    },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => api.put(`/ai-agents/${id}`, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai-agents"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-accent text-sm font-medium mb-1">AI Agents</p>
          <h1 className="font-display text-3xl text-ink">Who answers your calls</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New agent"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="card p-6 mb-6 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alexis" />
            </div>
            <div>
              <label className="label">Specialty</label>
              <input className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Residential" />
            </div>
          </div>
          <div>
            <label className="label">Greeting script</label>
            <textarea
              className="input min-h-24"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Hello, thank you for calling..."
            />
          </div>
          <button type="submit" disabled={create.isPending} className="btn-primary">
            Save agent
          </button>
        </form>
      )}

      {isLoading && <p className="text-sm text-muted">Loading agents…</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {data?.map((agent) => (
          <div key={agent.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-forest text-sand flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-medium text-ink">{agent.name}</p>
                  <p className="text-xs text-muted">{agent.specialty ?? "General"}</p>
                </div>
              </div>
              <button
                onClick={() => toggleActive.mutate({ id: agent.id, active: !agent.active })}
                className={`badge ${agent.active ? "bg-accent/10 text-accent-dark" : "bg-line text-muted"}`}
              >
                {agent.active ? "Active" : "Inactive"}
              </button>
            </div>
            <p className="text-sm text-muted line-clamp-2">{agent.greetingScript}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
