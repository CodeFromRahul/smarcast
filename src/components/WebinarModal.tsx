"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, Copy, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion as m } from "framer-motion";
import { createWebinarAction } from "@/app/actions/webinar";
import { toast } from "sonner";

export type Webinar = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  period: "AM" | "PM";
  ctaLabel?: string;
  tags?: string;
  ctaType?: "book" | "buy";
  product?: string;
  thumbnail?: string;
  streamCallId?: string;
  streamToken?: string;
};

function saveWebinar(w: Webinar) {
  const list = (typeof window !== "undefined" && localStorage.getItem("webinars")) || "[]";
  const arr: Webinar[] = JSON.parse(list);
  const next = [w, ...arr];
  localStorage.setItem("webinars", JSON.stringify(next));
}

export function WebinarModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Webinar>({
    id: "",
    name: "",
    description: "",
    date: "",
    time: "12:00",
    period: "AM",
    ctaLabel: "",
    tags: "",
    ctaType: "buy",
    product: "",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
  });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setLoading(false);
      setError(null);
      setData((d) => ({ ...d, id: "", name: "", description: "", date: "", time: "12:00", period: "AM", ctaLabel: "", tags: "", product: "" }));
    }
  }, [open]);

  const canNext1 = useMemo(() => data.name.trim() && data.description.trim() && data.date && data.time, [data]);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      const id = crypto.randomUUID();
      const webinarId = `webinar-${Date.now()}`;
      const userId = `user-${Date.now()}`; // In production, use actual authenticated user ID

      // Combine date and time for starts_at
      let startsAt: string | undefined;
      if (data.date && data.time) {
        const [hours, minutes] = data.time.split(':');
        let hour = parseInt(hours);
        if (data.period === 'PM' && hour !== 12) hour += 12;
        if (data.period === 'AM' && hour === 12) hour = 0;
        const dateTime = new Date(data.date);
        dateTime.setHours(hour, parseInt(minutes), 0, 0);
        startsAt = dateTime.toISOString();
      }

      // Create webinar via Stream API
      const result = await createWebinarAction({
        webinarId,
        title: data.name,
        description: data.description,
        userId,
        startsAt,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create webinar');
        toast.error(result.error || 'Failed to create webinar');
        setLoading(false);
        return;
      }

      // Save to localStorage with Stream data
      const record: Webinar = {
        ...data,
        id,
        streamCallId: result.callId,
        streamToken: result.token,
      };
      
      saveWebinar(record);
      setData(record);
      
      toast.success('Webinar created successfully!');
      setStep(4);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    const url = `${location.origin}/webinar/${data.id || "preview"}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black/90 backdrop-blur-md border-white/10 text-white">
        <AnimatePresence mode="wait">
          {step !== 4 ? (
            <m.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle>
                  {step === 1 && "Basic Information"}
                  {step === 2 && "CTA"}
                  {step === 3 && "Additional information"}
                </DialogTitle>
                <p className="text-sm text-white/60">
                  {step === 1 && "Please fill out the standard info needed for your webinar"}
                  {step === 2 && "Please provide the end-point for your customers through your webinar"}
                  {step === 3 && "Please fill out additional options if necessary"}
                </p>
              </DialogHeader>

              {error && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </m.div>
              )}

              {step === 1 && (
                <div className="grid gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label>Webinar name</Label>
                    <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Prodigies University" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Tell customers what your webinar is about" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Webinar Date</Label>
                      <Input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Webinar Time</Label>
                      <div className="flex gap-2">
                        <Input type="time" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} className="flex-1" />
                        <Select value={data.period} onValueChange={(v: "AM" | "PM") => setData({ ...data, period: v })}>
                          <SelectTrigger className="w-28"><SelectValue placeholder="AM" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Upload File</Label>
                    <Input type="url" placeholder="Optional thumbnail URL" value={data.thumbnail}
                      onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
                    />
                    <p className="text-xs text-white/50">Uploading a video makes this webinar pre-recorded. Using a URL will simply display a thumbnail.</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    </m.div>
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button disabled={!canNext1} onClick={() => setStep(2)}>Next</Button>
                    </m.div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label>CTA Label</Label>
                    <Input value={data.ctaLabel} placeholder="Grab this limited time discount!" onChange={(e) => setData({ ...data, ctaLabel: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <Input value={data.tags} placeholder="PU" onChange={(e) => setData({ ...data, tags: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>CTA Type</Label>
                    <div className="flex gap-2">
                      <m.div whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button className="w-full" variant={data.ctaType === "book" ? "default" : "secondary"} onClick={() => setData({ ...data, ctaType: "book" })}>Book a Call</Button>
                      </m.div>
                      <m.div whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button className="w-full" variant={data.ctaType === "buy" ? "default" : "secondary"} onClick={() => setData({ ...data, ctaType: "buy" })}>Buy Now</Button>
                      </m.div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Attach a Product</Label>
                    <Select value={data.product || undefined} onValueChange={(v) => setData({ ...data, product: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai-agent-basic">AI Agent Basic</SelectItem>
                        <SelectItem value="ai-agent-pro">AI Agent Pro</SelectItem>
                        <SelectItem value="consultation-60">Consultation 60m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between pt-2">
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    </m.div>
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => setStep(3)}>Next</Button>
                    </m.div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label>Preview Image URL</Label>
                    <Input value={data.thumbnail} onChange={(e) => setData({ ...data, thumbnail: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="flex justify-between pt-2">
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                    </m.div>
                    <m.div whileTap={{ scale: 0.98 }}>
                      <Button onClick={handleCreate} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create'
                        )}
                      </Button>
                    </m.div>
                  </div>
                </div>
              )}
            </m.div>
          ) : (
            <m.div
              key="success"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="py-8 text-center"
            >
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-500" />
              </m.div>
              <h3 className="text-xl font-medium">Your webinar has been created</h3>
              <p className="mt-1 text-sm text-white/60">You can share the link with your viewers for them to join</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="rounded-md bg-white/5 px-3 py-2 text-sm break-all">{typeof window !== "undefined" ? `${location.origin}/webinar/${data.id}` : ""}</div>
                <m.div whileTap={{ scale: 0.96 }}>
                  <Button size="icon" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/10" onClick={copyLink}><Copy className="h-4 w-4" /></Button>
                </m.div>
              </div>
              {data.streamCallId && (
                <div className="mt-3 text-xs text-white/50">
                  Stream Call ID: {data.streamCallId}
                </div>
              )}
              <div className="mt-6 flex justify-center gap-2">
                <m.div whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => {
                    router.push(`/webinar/${data.id}`);
                    onOpenChange(false);
                  }}>Preview Webinar</Button>
                </m.div>
                <m.div whileTap={{ scale: 0.98 }}>
                  <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/10" onClick={() => { setStep(1); setError(null); }}>Create Another Webinar</Button>
                </m.div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}