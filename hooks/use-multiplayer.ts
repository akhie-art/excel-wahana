"use client";

import { useEffect, useRef } from "react";
import { useAppStore, PeerState } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const COLORS = ["emerald", "indigo", "rose", "amber", "violet", "sky"];

export function useMultiplayer() {
  const { 
    user, 
    role, 
    getCurrentStep, 
    selectedTaskIndex, 
    setPeerState, 
    isConfigured, 
    formulaInput,
    isSuccess,
    taskAnswers,
    progress
  } = useAppStore();
  const step = getCurrentStep();

  // Pick a random color for this browser session client
  const colorRef = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
  // Generate a random client ID to distinguish between different tabs of the same user
  const clientIdRef = useRef(Math.random().toString(36).substring(2, 9));

  // Extract current cell coordinates
  let activeCell: { row: number; col: number } | null = null;
  if (step && step.headers && step.headers.length > 0) {
    if (step.tasks && step.tasks[selectedTaskIndex]) {
      activeCell = step.tasks[selectedTaskIndex].resultCell;
    } else if (step.resultCell) {
      activeCell = step.resultCell;
    }
  }

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || `User_${clientIdRef.current}`;
  const userId = user?.id || `anonymous_${clientIdRef.current}`;

  const currentPayload: PeerState = {
    userId,
    name,
    role,
    activeCell,
    color: colorRef.current,
    stepId: step?.id || "",
    formulaInput: formulaInput || "",
    isSuccess: isSuccess || false,
    taskAnswers: taskAnswers || [],
    completedSteps: progress?.completed_steps || [],
  };

  const payloadRef = useRef(currentPayload);
  payloadRef.current = currentPayload;

  const channelRef = useRef<any>(null);
  const bcRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isConfigured) {
      // 1. Supabase Realtime online synchronization
      const channel = supabase.channel("room:classroom", {
        config: {
          presence: {
            key: clientIdRef.current,
          },
        },
      });
      channelRef.current = channel;

      channel
        .on("presence", { event: "sync" }, () => {
          const presenceState = channel.presenceState();
          Object.keys(presenceState).forEach((key) => {
            if (key === clientIdRef.current) return;
            const presences = presenceState[key] as any[];
            if (presences && presences.length > 0) {
              setPeerState(key, presences[0] as PeerState);
            }
          });
        })
        .on("presence", { event: "join" }, ({ key, newPresences }: { key: string; newPresences: any[] }) => {
          if (key === clientIdRef.current) return;
          if (newPresences && newPresences.length > 0) {
            setPeerState(key, newPresences[0] as PeerState);
          }
        })
        .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
          setPeerState(key, null);
        });

      channel.on("broadcast", { event: "cursor-move" }, (envelope: any) => {
        const { clientId, state } = envelope.payload || {};
        if (!clientId || clientId === clientIdRef.current) return;
        setPeerState(clientId, state);
      });

      channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track(payloadRef.current);
        }
      });

      // Throttle mouse/cell updates to 300ms intervals
      const interval = setInterval(() => {
        channel.send({
          type: "broadcast",
          event: "cursor-move",
          payload: {
            clientId: clientIdRef.current,
            state: payloadRef.current,
          },
        });
      }, 300);

      return () => {
        clearInterval(interval);
        channelRef.current = null;
        channel.unsubscribe();
      };
    } else {
      // 2. Offline Fallback (Local Tab Sync via BroadcastChannel)
      const bc = new BroadcastChannel("excelmaster_multiplayer");
      bcRef.current = bc;

      bc.onmessage = (event) => {
        const { type, clientId, state } = event.data;
        if (clientId === clientIdRef.current) return;

        if (type === "cursor-move") {
          setPeerState(clientId, state);
        } else if (type === "offline") {
          setPeerState(clientId, null);
        } else if (type === "ping") {
          // Reply with current state
          bc.postMessage({
            type: "cursor-move",
            clientId: clientIdRef.current,
            state: payloadRef.current,
          });
        }
      };

      bc.postMessage({
        type: "ping",
        clientId: clientIdRef.current,
      });

      const interval = setInterval(() => {
        bc.postMessage({
          type: "cursor-move",
          clientId: clientIdRef.current,
          state: payloadRef.current,
        });
      }, 300);

      return () => {
        clearInterval(interval);
        bcRef.current = null;
        bc.postMessage({
          type: "offline",
          clientId: clientIdRef.current,
        });
        bc.close();
      };
    }
  }, [step?.id, selectedTaskIndex, role, userId, name, isConfigured, setPeerState]);

  // 3. Instant keystroke / cursor broadcast (does not tear down connections)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isConfigured) {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "cursor-move",
          payload: {
            clientId: clientIdRef.current,
            state: payloadRef.current,
          },
        });
      }
    } else {
      if (bcRef.current) {
        bcRef.current.postMessage({
          type: "cursor-move",
          clientId: clientIdRef.current,
          state: payloadRef.current,
        });
      }
    }
  }, [formulaInput, activeCell?.row, activeCell?.col, isSuccess, JSON.stringify(taskAnswers), isConfigured]);
}
