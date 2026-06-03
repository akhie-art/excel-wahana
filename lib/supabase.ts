import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://your-supabase-project.supabase.co");

// Define basic types for user progress
export interface UserProgress {
  user_id: string;
  current_module_id: string;
  current_step_id: string;
  completed_steps: string[];
  streak_count: number;
  last_active_at: string;
  role: "peserta" | "instruktur";
  email?: string | null;
  name?: string | null;
}

// Create real or mock Supabase client
let clientInstance: any;

if (isSupabaseConfigured) {
  clientInstance = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // Mock client implementation for local-only execution
  const mockStorageKey = "excel_lms_mock_user";

  const getMockUser = () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(mockStorageKey);
    return userStr ? JSON.parse(userStr) : null;
  };

  const getMockProgress = () => {
    if (typeof window === "undefined") return null;
    const user = getMockUser();
    if (!user) return null;

    const key = `excel_lms_mock_progress_${user.id}`;
    const progressStr = localStorage.getItem(key);
    if (progressStr) {
      const progress = JSON.parse(progressStr);
      if (!progress.email || !progress.name) {
        progress.email = user.email;
        progress.name = user.user_metadata?.name || user.email?.split("@")[0];
        localStorage.setItem(key, JSON.stringify(progress));
      }
      return progress;
    }
    
    // Check if the user is an instructor
    const isInstructor = user.email === "instruktur@excel.com" || user.email?.includes("instruktur");
    
    // Default initial progress
    const defaultProgress: UserProgress = {
      user_id: user.id,
      current_module_id: "basics",
      current_step_id: "sum-basics",
      completed_steps: [],
      streak_count: 0,
      last_active_at: new Date().toISOString(),
      role: isInstructor ? "instruktur" : "peserta",
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
    };
    localStorage.setItem(key, JSON.stringify(defaultProgress));
    return defaultProgress;
  };

  const setMockProgress = (progress: Partial<UserProgress>) => {
    if (typeof window === "undefined") return;
    const user = getMockUser();
    if (!user) return;

    const key = `excel_lms_mock_progress_${user.id}`;
    const current = getMockProgress() || {
      user_id: user.id,
      current_module_id: "basics",
      current_step_id: "sum-basics",
      completed_steps: [],
      streak_count: 0,
      last_active_at: new Date().toISOString(),
      role: (user.email === "instruktur@excel.com" || user.email?.includes("instruktur")) ? "instruktur" : "peserta",
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
    };
    const updated = { ...current, ...progress, last_active_at: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  };

  const listeners = new Set<(event: string, session: any) => void>();

  clientInstance = {
    auth: {
      getSession: async () => {
        const user = getMockUser();
        return {
          data: {
            session: user ? { user, access_token: "mock-token" } : null,
          },
          error: null,
        };
      },
      getUser: async () => {
        const user = getMockUser();
        return { data: { user }, error: null };
      },
      signInWithPassword: async ({ email, options }: { email: string; options?: any }) => {
        const cleanEmail = email.trim().toLowerCase();
        const id = "mock-user-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "_");
        const mockUser = {
          id,
          email: cleanEmail,
          user_metadata: { name: options?.data?.name || cleanEmail.split("@")[0] },
        };
        localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
        const session = { user: mockUser, access_token: "mock-token" };
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user: mockUser, session }, error: null };
      },
      signUp: async ({ email, options }: { email: string; options?: any }) => {
        const cleanEmail = email.trim().toLowerCase();
        const id = "mock-user-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "_");
        const mockUser = {
          id,
          email: cleanEmail,
          user_metadata: { name: options?.data?.name || cleanEmail.split("@")[0] },
        };
        localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
        const session = { user: mockUser, access_token: "mock-token" };
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user: mockUser, session }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem(mockStorageKey);
        listeners.forEach((cb) => cb("SIGNED_OUT", null));
        return { error: null };
      },
      signInWithOAuth: async ({ provider }: { provider: string }) => {
        const mockUser = {
          id: "mock-user-oauth",
          email: `${provider}-user@example.com`,
          user_metadata: { name: `GitHub Explorer` },
        };
        localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
        window.location.reload();
        return { data: {}, error: null };
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        listeners.add(callback);
        const user = getMockUser();
        const session = user ? { user, access_token: "mock-token" } : null;
        callback(user ? "SIGNED_IN" : "INITIAL_SESSION", session);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(callback);
              },
            },
          },
        };
      },
    },
    from: (table: string) => {
      if (table === "user_progress") {
        const queryResult = {
          single: async () => {
            const user = getMockUser();
            if (!user) return { data: null, error: new Error("Unauthorized") };
            return { data: getMockProgress(), error: null };
          },
          maybeSingle: async () => {
            const user = getMockUser();
            if (!user) return { data: null, error: null };
            return { data: getMockProgress(), error: null };
          },
        };
        return {
          select: () => {
            const getProgressList = () => {
              if (typeof window === "undefined") return [];
              const list = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("excel_lms_mock_progress_")) {
                  const val = localStorage.getItem(key);
                  if (val) list.push(JSON.parse(val));
                }
              }
              return list;
            };

            return {
              single: queryResult.single,
              maybeSingle: queryResult.maybeSingle,
              eq: (col: string, val: any) => {
                if (col === "role") {
                  const filtered = getProgressList().filter((p) => p[col] === val);
                  return {
                    then: (cb: any) => Promise.resolve({ data: filtered, error: null }).then(cb),
                  };
                }
                return {
                  single: queryResult.single,
                  maybeSingle: queryResult.maybeSingle,
                };
              },
            };
          },
          upsert: (data: any) => ({
            select: () => ({
              single: async () => {
                const updated = setMockProgress(data);
                return { data: updated, error: null };
              },
              maybeSingle: async () => {
                const updated = setMockProgress(data);
                return { data: updated, error: null };
              },
            }),
          }),
          update: (data: any) => ({
            eq: (col: string, val: any) => ({
              select: () => ({
                single: async () => {
                  const updated = setMockProgress(data);
                  return { data: updated, error: null };
                },
                maybeSingle: async () => {
                  const updated = setMockProgress(data);
                  return { data: updated, error: null };
                },
              }),
              then: (cb: any) => {
                const updated = setMockProgress(data);
                return Promise.resolve({ data: updated, error: null }).then(cb);
              }
            }),
          }),
        };
      }

      if (table === "custom_steps") {
        const getCustomSteps = () => {
          if (typeof window === "undefined") return [];
          const dataStr = localStorage.getItem("excel_lms_custom_steps");
          return dataStr ? JSON.parse(dataStr) : [];
        };

        const setCustomSteps = (steps: any[]) => {
          if (typeof window === "undefined") return;
          localStorage.setItem("excel_lms_custom_steps", JSON.stringify(steps));
        };

        return {
          select: () => ({
            then: (cb: any) => Promise.resolve({ data: getCustomSteps(), error: null }).then(cb),
            eq: (col: string, val: any) => ({
              then: (cb: any) => {
                const filtered = getCustomSteps().filter((s: any) => s[col] === val);
                return Promise.resolve({ data: filtered, error: null }).then(cb);
              }
            })
          }),
          insert: (newStep: any) => ({
            then: (cb: any) => {
              const current = getCustomSteps();
              const stepsArray = Array.isArray(newStep) ? newStep : [newStep];
              const updated = [...current, ...stepsArray];
              setCustomSteps(updated);
              return Promise.resolve({ data: newStep, error: null }).then(cb);
            }
          }),
          delete: () => ({
            eq: (col: string, val: any) => ({
              then: (cb: any) => {
                const current = getCustomSteps();
                const updated = current.filter((s: any) => s[col] !== val);
                setCustomSteps(updated);
                return Promise.resolve({ data: null, error: null }).then(cb);
              }
            })
          })
        };
      }

      return {
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Table not found") }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      };
    },
  };
}

export const supabase = clientInstance;
