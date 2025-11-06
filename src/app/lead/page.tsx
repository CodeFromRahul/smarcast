"use client";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion as m } from "framer-motion";

const leads = [
  { name: "Perrin", email: "prodigiestesting@gmail.com", phone: "", tags: ["PU"] },
];

export default function LeadPage() {
  return (
    <AppShell title="Lead">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white/90">The home to all your customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md"
              >
                <Input placeholder="Search customer..." className="bg-white/5 border-white/10 placeholder:text-white/40 text-white focus:border-violet-500/50 transition-colors" />
              </m.div>
            </div>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-4 text-sm text-white/60 px-2 py-2 border-b border-white/10"
            > 
              <div>Name</div><div>Email</div><div>Phone</div><div>Tags</div>
            </m.div>
            {leads.map((l, i) => (
              <m.div
                key={l.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.01, x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="grid grid-cols-4 px-2 py-3 border-b border-white/5 rounded-lg cursor-pointer transition-colors"
              >
                <div className="font-medium">{l.name}</div>
                <div className="text-white/80">{l.email}</div>
                <div className="text-white/80">{l.phone || "-"}</div>
                <div>
                  {l.tags.map((tag) => (
                    <m.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="inline-block rounded-md bg-violet-600/20 text-violet-300 px-2 py-0.5 text-sm border border-violet-500/30"
                    >
                      {tag}
                    </m.span>
                  ))}
                </div>
              </m.div>
            ))}
          </CardContent>
        </Card>
      </m.div>
    </AppShell>
  );
}