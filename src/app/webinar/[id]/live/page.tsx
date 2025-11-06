"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  StreamVideo,
  StreamVideoClient,
  Call,
  StreamCall,
  LivestreamLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Webinar = {
  id: string;
  name: string;
  streamCallId?: string;
  streamToken?: string;
};

function useWebinar(id: string) {
  const [item, setItem] = useState<Webinar | null>(null);
  useEffect(() => {
    const list = localStorage.getItem("webinars") || "[]";
    const found = JSON.parse(list).find((x: any) => x.id === id);
    setItem(found);
  }, [id]);
  return item;
}

function LivestreamPlayer({ call, isHost }: { call: Call; isHost: boolean }) {
  const { useIsCallLive, useParticipantCount } = useCallStateHooks();
  const isLive = useIsCallLive();
  const participantCount = useParticipantCount();

  return (
    <div className="relative h-full w-full bg-black">
      {isLive ? (
        <>
          <LivestreamLayout showParticipantCount={true} />
          <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            <div className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-white">LIVE</span>
            </div>
            <div className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs text-white">
              {participantCount} {participantCount === 1 ? 'viewer' : 'viewers'}
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto mb-3" />
            <p className="text-white/80">
              {isHost ? 'Click "Go Live" to start broadcasting' : 'Waiting for host to start the webinar...'}
            </p>
            <p className="text-white/50 text-sm mt-1">The stream will begin shortly</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HostControls({ call }: { call: Call }) {
  const { useIsCallLive } = useCallStateHooks();
  const isLive = useIsCallLive();
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleGoLive = async () => {
    setIsStarting(true);
    try {
      await call.goLive();
      toast.success("You are now live!");
    } catch (error) {
      console.error("Failed to go live:", error);
      toast.error("Failed to start livestream");
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopLive = async () => {
    setIsStopping(true);
    try {
      await call.stopLive();
      toast.success("Livestream ended");
    } catch (error) {
      console.error("Failed to stop live:", error);
      toast.error("Failed to stop livestream");
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      {!isLive ? (
        <Button
          onClick={handleGoLive}
          disabled={isStarting}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8"
        >
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            "Go Live"
          )}
        </Button>
      ) : (
        <Button
          onClick={handleStopLive}
          disabled={isStopping}
          size="lg"
          variant="destructive"
          className="px-8"
        >
          {isStopping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Stopping...
            </>
          ) : (
            "Stop Livestream"
          )}
        </Button>
      )}
    </div>
  );
}

export default function WebinarLivePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const webinar = useWebinar(id);
  
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const initializeStream = async () => {
      if (!webinar?.streamCallId) {
        setError("Webinar not found or Stream not configured");
        setIsLoading(false);
        return;
      }

      try {
        const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY;
        if (!apiKey) {
          throw new Error("GetStream API key not configured");
        }

        // Check if user is host (has token stored) or viewer
        const hasToken = !!webinar.streamToken;
        setIsHost(hasToken);

        // Generate unique user ID
        const userId = hasToken 
          ? `host-${webinar.id}-${Date.now()}` 
          : `viewer-${Date.now()}`;
        
        let token = webinar.streamToken;

        // Generate viewer token if needed
        if (!token) {
          const response = await fetch("/api/stream-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || "Failed to generate token");
          }

          const data = await response.json();
          token = data.token;
        }

        if (!token) {
          throw new Error("No token available");
        }

        // Initialize Stream client
        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: userId,
            name: hasToken ? "Host" : `Viewer ${userId.slice(-6)}`,
          },
          token,
        });

        setClient(streamClient);

        // Get or create call
        const streamCall = streamClient.call("livestream", webinar.streamCallId);
        
        // Join the call
        await streamCall.join({ create: hasToken });
        
        setCall(streamCall);
        
        if (hasToken) {
          toast.success("Welcome, Host! Click 'Go Live' to start broadcasting.");
        } else {
          toast.success("Connected to webinar. Waiting for host...");
        }
      } catch (err) {
        console.error("Failed to initialize Stream:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize video");
        toast.error(`Failed to load livestream: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (webinar) {
      initializeStream();
    }

    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [webinar]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
          <p>Loading webinar...</p>
        </div>
      </div>
    );
  }

  if (error || !client || !call) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md px-4">
          <div className="text-red-400 mb-4">
            <p className="font-semibold text-lg mb-2">Failed to Load Webinar</p>
            <p className="text-sm">{error || "Failed to load webinar"}</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="h-screen w-full relative bg-black">
          <LivestreamPlayer call={call} isHost={isHost} />
          {isHost && <HostControls call={call} />}
          
          {/* Back button */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
          >
            Exit
          </Button>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}