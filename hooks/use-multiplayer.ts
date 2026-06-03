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
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear any existing peer states if the user is a student (non-instructor)
    if (role !== "instruktur") {
      const storeState = useAppStore.getState();
      Object.keys(storeState.peerStates).forEach((key) => {
        storeState.setPeerState(key, null);
      });
    }

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

      // Only listen to other peer updates if we are an instructor
      if (role === "instruktur") {
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
      }

      channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          isSubscribedRef.current = true;
          await channel.track(payloadRef.current);
        } else {
          isSubscribedRef.current = false;
        }
      });

      // Throttle mouse/cell updates to 300ms intervals
      const interval = setInterval(() => {
        if (channelRef.current && isSubscribedRef.current) {
          channel.send({
            type: "broadcast",
            event: "cursor-move",
            payload: {
              clientId: clientIdRef.current,
              state: payloadRef.current,
            },
          });
        }
      }, 300);

      return () => {
        clearInterval(interval);
        channelRef.current = null;
        isSubscribedRef.current = false;
        channel.unsubscribe();
      };
    } else {
      // 2. Offline Fallback (Local Tab Sync via BroadcastChannel)
      const bc = new BroadcastChannel("excelwahana_multiplayer");
      bcRef.current = bc;

      bc.onmessage = (event) => {
        const { type, clientId, state } = event.data;
        if (clientId === clientIdRef.current) return;

        // Instructors listen to all updates
        if (role === "instruktur") {
          if (type === "cursor-move") {
            setPeerState(clientId, state);
          } else if (type === "offline") {
            setPeerState(clientId, null);
          }
        }

        // All users reply to pings so instructors can discover them
        if (type === "ping") {
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
      if (channelRef.current && isSubscribedRef.current) {
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
