"use client";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion as m } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const assistants = ["Test AI", "Jenny", "Real Assistant", "Test PU Assistant", "Morgan", "Riley"];

export default function AgentsPage() {
  const [selectedAssistant, setSelectedAssistant] = useState("Test AI");

  return (
    <AppShell title="Ai-Agents">
      <div className="grid grid-cols-12 gap-6 text-white">
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-3"
          >
            <m.div whileTap={{ scale: 0.98 }} className="w-full">
              <Button 
                variant="secondary" 
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                onClick={() => toast.success("Create Assistant feature coming soon!")}
              >
                + Create Assistant
              </Button>
            </m.div>
          </m.div>
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Input placeholder="Search Assistants" className="mb-3 bg-white/5 border-white/10 placeholder:text-white/40 text-white focus:border-violet-500/50 transition-colors" />
          </m.div>
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-md border border-white/10 divide-y divide-white/10 overflow-hidden"
          >
            {assistants.map((a, i) => (
              <m.button
                key={a}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAssistant(a)}
                className={`w-full text-left px-3 py-3 transition-colors ${
                  selectedAssistant === a ? "bg-white/10 text-violet-300" : ""
                }`}
              >
                {a}
              </m.button>
            ))}
          </m.div>
        </aside>
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-black/60 border border-white/10 text-white">
              <CardHeader>
                <CardTitle>Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid gap-2"
                >
                  <Label>First Message</Label>
                  <Input className="bg-white/5 border-white/10 placeholder:text-white/40 text-white focus:border-violet-500/50 transition-colors" defaultValue="Hi there, this is Test AI from customer support. How can I help you today?" />
                </m.div>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="grid gap-2"
                >
                  <Label>System Prompt</Label>
                  <Textarea className="h-60 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500/50 transition-colors" defaultValue={`# Lead Qualification & Nurturing Agent Prompt\n\n## Identity & Purpose\nYou are Morgan, a business development voice assistant...`}></Textarea>
                </m.div>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="grid gap-2">
                    <Label>Provider</Label>
                    <Select defaultValue="openai">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Provider" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">openai</SelectItem>
                        <SelectItem value="anthropic">anthropic</SelectItem>
                        <SelectItem value="groq">groq</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Model</Label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Model" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                        <SelectItem value="sonnet-3.5">sonnet-3.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </m.div>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex justify-end"
                >
                  <m.div whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="bg-violet-600 hover:bg-violet-500"
                      onClick={() => toast.success("Assistant updated successfully!")}
                    >
                      Update Assistant
                    </Button>
                  </m.div>
                </m.div>
              </CardContent>
            </Card>
          </m.div>
        </section>
      </div>
    </AppShell>
  );
}