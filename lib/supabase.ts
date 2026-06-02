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
}

// Create real or mock Supabase client
let clientInstance: any;

if (isSupabaseConfigured) {
  clientInstance = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // Mock client implementation for local-only execution
  const mockStorageKey = "excel_lms_mock_user";
  const mockProgressKey = "excel_lms_mock_progress";

  const getMockUser = () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(mockStorageKey);
    return userStr ? JSON.parse(userStr) : null;
  };

  const getMockProgress = () => {
    if (typeof window === "undefined") return null;
    const progressStr = localStorage.getItem(mockProgressKey);
    if (progressStr) return JSON.parse(progressStr);
    
    // Default initial progress
    const defaultProgress: UserProgress = {
      user_id: "mock-user-id",
      current_module_id: "basics",
      current_step_id: "sum-basics",
      completed_steps: [],
      streak_count: 0,
      last_active_at: new Date().toISOString(),
      role: "peserta",
    };
    localStorage.setItem(mockProgressKey, JSON.stringify(defaultProgress));
    return defaultProgress;
  };

  const setMockProgress = (progress: Partial<UserProgress>) => {
    if (typeof window === "undefined") return;
    const current = getMockProgress();
    const updated = { ...current, ...progress, last_active_at: new Date().toISOString() };
    localStorage.setItem(mockProgressKey, JSON.stringify(updated));
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
        const mockUser = {
          id: "mock-user-id",
          email,
          user_metadata: { name: options?.data?.name || email.split("@")[0] },
        };
        localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
        const session = { user: mockUser, access_token: "mock-token" };
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user: mockUser, session }, error: null };
      },
      signUp: async ({ email, options }: { email: string; options?: any }) => {
        const mockUser = {
          id: "mock-user-id",
          email,
          user_metadata: { name: options?.data?.name || email.split("@")[0] },
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
          id: "mock-user-id",
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
        return {
          select: () => ({
            single: async () => {
              const user = getMockUser();
              if (!user) return { data: null, error: new Error("Unauthorized") };
              return { data: getMockProgress(), error: null };
            },
            eq: (col: string, val: any) => ({
              single: async () => {
                const user = getMockUser();
                if (!user) return { data: null, error: new Error("Unauthorized") };
                return { data: getMockProgress(), error: null };
              },
            }),
          }),
          upsert: (data: any) => ({
            select: () => ({
              single: async () => {
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
              }),
              then: (cb: any) => {
                const updated = setMockProgress(data);
                return Promise.resolve({ data: updated, error: null }).then(cb);
              }
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Table not found") }),
          }),
        }),
      };
    },
  };
}

export const supabase = clientInstance;
