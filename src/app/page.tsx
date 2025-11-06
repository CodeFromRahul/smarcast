"use client";

import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload, Video } from "lucide-react";
import { motion as m } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

function Step({ index, title, desc, done, onClick }: { index: number; title: string; desc: string; done?: boolean; onClick?: () => void }) {
  return (
    <m.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left rounded-xl border border-white/10 px-4 py-3 flex items-center justify-between text-white transition-all duration-200 ${
        done ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <m.div
          initial={false}
          animate={done ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className={`h-6 w-6 grid place-items-center rounded-full text-xs transition-colors duration-200 ${
            done ? "bg-violet-600 text-white" : "bg-white/10 text-white"
          }`}
        >
          {index}
        </m.div>
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-white/60">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-white/50" />
    </m.button>
  );
}

function UploadCard({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick?: () => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast.success("File upload feature coming soon!");
  };

  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`cursor-pointer transition-all duration-200 ${
        isDragging ? "ring-2 ring-violet-500" : ""
      }`}
    >
      <Card className={`bg-black/60 border border-white/10 text-white min-h-[140px] grid place-items-center transition-all duration-200 ${
        isDragging ? "bg-white/10 border-violet-500/50" : "hover:bg-black/70 hover:border-white/20"
      }`}>
        <div className="text-center">
          <m.div
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <Icon className="h-8 w-8 mx-auto text-white/70" />
          </m.div>
          <div className="mt-2 text-sm text-white/60">{label}</div>
        </div>
      </Card>
    </m.div>
  );
}

export default function Dashboard() {
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      toast.info("Stripe integration coming soon!");
    } else if (stepNumber === 2) {
      toast.info("Navigate to AI-Agents page to configure your agents");
    } else if (stepNumber === 3) {
      toast.info("Click 'Create Webinar' button above to start!");
    }
  };

  return (
    <AppShell title="Home">
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-7">
          <m.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-semibold mb-4 text-white"
          >
            Get maximum Conversion from your webinars
          </m.h1>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, staggerChildren: 0.1 }}
            className="space-y-3"
          >
            <Step
              index={1}
              title="Connect Stripe"
              desc="Connect your Stripe account to start accepting payments"
              done
              onClick={() => handleStepClick(1)}
            />
            <Step
              index={2}
              title="Create AI Agent"
              desc="Set up an AI agent to automate your webinar interactions"
              done
              onClick={() => handleStepClick(2)}
            />
            <Step
              index={3}
              title="Create a webinar"
              desc="Set up your first webinar to start collecting leads"
              onClick={() => handleStepClick(3)}
            />
          </m.div>
        </section>
        <section className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-4">
          <UploadCard
            icon={Upload}
            label="Browse or drag a pre-recorded webinar file"
            onClick={() => toast.info("File upload feature coming soon!")}
          />
          <UploadCard
            icon={Video}
            label="Browse or drag a pre-recorded webinar file"
            onClick={() => toast.info("Video upload feature coming soon!")}
          />
        </section>

        <section className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/60 border border-white/10 text-white">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 cursor-pointer transition-colors hover:bg-white/10"
                >
                  <div className="font-medium text-white">John Doe</div>
                  <div className="text-sm text-white/70">Johndoe@gmail.com</div>
                  <div className="mt-2 text-xs text-white/60">New Customer • Tag 2 • Tag 3</div>
                </m.div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-black/60 border border-white/10 text-white">
            <CardHeader>
              <CardTitle>See the list of your current customers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 cursor-pointer transition-colors hover:bg-white/10"
                >
                  <div className="font-medium text-white">John Doe</div>
                  <div className="text-sm text-white/70">Johndoe@gmail.com</div>
                  <div className="mt-2 text-xs">
                    <span className="mr-2 rounded-md bg-white/10 text-white px-2 py-0.5">New</span>
                    <span className="rounded-md bg-white/10 text-white px-2 py-0.5">Hot Lead</span>
                  </div>
                  <div className="mt-1 text-xs text-white/60">Updated At: May 12, 2025</div>
                </m.div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}