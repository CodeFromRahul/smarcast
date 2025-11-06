"use client";

import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Video } from "lucide-react";

function useWebinar(id: string) {
  const [item, setItem] = useState<any>(null);
  useEffect(() => {
    const list = localStorage.getItem("webinars") || "[]";
    const found = JSON.parse(list).find((x: any) => x.id === id);
    setItem(found);
  }, [id]);
  return item;
}

function useCountdown(targetISO: string) {
  const [diff, setDiff] = useState(0);
  const [finished, setFinished] = useState(false);
  
  useEffect(() => {
    if (!targetISO) return;
    const t = new Date(targetISO).getTime();
    const updateDiff = () => {
      const now = Date.now();
      const difference = t - now;
      // Consider finished if time has passed or is within 5 minutes
      const isFinished = difference <= 5 * 60 * 1000; // 5 minutes before or after
      setFinished(isFinished);
      setDiff(Math.max(0, difference));
    };
    updateDiff();
    const i = setInterval(updateDiff, 1000);
    return () => clearInterval(i);
  }, [targetISO]);
  
  const d = Math.floor(diff / (24 * 60 * 60 * 1000));
  const h = Math.floor((diff / (60 * 60 * 1000)) % 24);
  const m = Math.floor((diff / (60 * 1000)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  return { d, h, m, s, finished };
}

export default function WebinarLanding() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const data = useWebinar(id);

  const dateTimeISO = useMemo(() => {
    if (!data) return "";
    const [hh, mm] = (data.time || "12:00").split(":");
    let hour24 = parseInt(hh);
    if (data.period === "PM" && hour24 !== 12) hour24 += 12;
    if (data.period === "AM" && hour24 === 12) hour24 = 0;
    const dateObj = new Date(data.date);
    dateObj.setHours(hour24, parseInt(mm), 0, 0);
    return dateObj.toISOString();
  }, [data]);

  const dateObj = useMemo(() => {
    if (!dateTimeISO) return null;
    const d = new Date(dateTimeISO);
    return isNaN(d.getTime()) ? null : d;
  }, [dateTimeISO]);

  // Check if the webinar date is today
  const isToday = useMemo(() => {
    if (!dateObj) return false;
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  }, [dateObj]);

  const { d, h, m, s, finished } = useCountdown(dateTimeISO);
  
  // Show "Join Stream" if finished OR if it's today (regardless of time)
  const showJoinButton = finished || isToday;

  const handleJoinLivestream = () => {
    if (!data?.streamCallId) {
      toast.error("Livestream not configured for this webinar");
      return;
    }
    router.push(`/webinar/${id}/live`);
  };

  if (!data) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] grid place-items-center bg-black text-white"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        No webinar found
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10 bg-black text-white">
      <div className="text-center max-w-lg">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-medium mb-6"
        >
          {showJoinButton ? "The webinar has started!" : "Seems like you are a little early"}
        </motion.h2>
        
        {!showJoinButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mx-auto grid grid-cols-4 gap-2 max-w-md mb-6"
          >
            {[
              { label: 'Days', val: d },
              { label: 'Hours', val: h },
              { label: 'Minutes', val: m },
              { label: 'Seconds', val: s }
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                className="rounded-md bg-white/5 border border-white/10 p-3 transition-colors"
              >
                <motion.div
                  key={b.val}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-semibold tabular-nums"
                >
                  {b.val.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-xs text-white/60">{b.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="relative mx-auto mb-4 aspect-[16/9] w-full max-w-lg overflow-hidden rounded-xl border border-white/10"
        >
          <Image
            src={data.thumbnail || "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop"}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>

        {showJoinButton && data.streamCallId ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
            className="mb-5"
          >
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-lg"
              onClick={handleJoinLivestream}
            >
              <Video className="mr-2 h-5 w-5" />
              Join Livestream
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="mb-5 bg-violet-600 hover:bg-violet-500"
              onClick={() => toast.success("Reminder set! We'll notify you when the webinar starts.")}
            >
              Get Reminder
            </Button>
          </motion.div>
        )}

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl font-semibold"
        >
          {data.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-1 text-sm text-white/70"
        >
          {data.description}
        </motion.p>
        {dateObj && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-5 flex items-center justify-center gap-2 text-sm"
          >
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              className="rounded-md bg-white/5 border border-white/10 px-3 py-1 transition-colors"
            >
              {dateObj.toLocaleDateString()}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              className="rounded-md bg-white/5 px-3 py-1 border border-white/10 transition-colors"
            >
              {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.div>
          </motion.div>
        )}
        {data.streamCallId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-xs text-white/40"
          >
            ✓ Powered by GetStream
          </motion.div>
        )}
      </div>
    </div>
  );
}