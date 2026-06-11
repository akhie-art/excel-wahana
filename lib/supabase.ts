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
      current_module_id: "hitung-data",
      current_step_id: "sum",
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
      current_module_id: "hitung-data",
      current_step_id: "sum",
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
      signInWithOAuth: async ({ provider, options }: { provider: string; options?: any }) => {
        const mockUser = {
          id: "mock-user-oauth",
          email: `${provider}-user@example.com`,
          user_metadata: { 
            name: provider === "google" ? "Google User" : `${provider.charAt(0).toUpperCase() + provider.slice(1)} Explorer` 
          },
        };
        localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
        if (typeof window !== "undefined") {
          if (options?.redirectTo) {
            window.location.href = options.redirectTo;
          } else {
            window.location.reload();
          }
        }
        return { data: { provider }, error: null };
      },
      resetPasswordForEmail: async (email: string, options?: any) => {
        return { data: {}, error: null };
      },
      updateUser: async ({ password }: { password?: string }) => {
        return { data: { user: getMockUser() }, error: null };
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
          }),
          update: (data: any) => ({
            eq: (col: string, val: any) => ({
              then: (cb: any) => {
                const current = getCustomSteps();
                const updated = current.map((s: any) => {
                  if (s[col] === val) {
                    return { ...s, ...data };
                  }
                  return s;
                });
                setCustomSteps(updated);
                return Promise.resolve({ data: data, error: null }).then(cb);
              }
            })
          })
        };
      }

      if (table === "excel_formulas") {
        const getMockFormulas = () => {
          try {
            // Require JSON data
            return require("./formulas-data.json");
          } catch (e) {
            return [];
          }
        };
        return {
          select: () => {
            const data = getMockFormulas();
            return {
              then: (cb: any) => Promise.resolve({ data, error: null }).then(cb),
              order: (col: string, { ascending }: any = {}) => {
                const sorted = [...data];
                sorted.sort((a: any, b: any) => {
                  const valA = String(a[col] || "").toLowerCase();
                  const valB = String(b[col] || "").toLowerCase();
                  if (valA < valB) return ascending ? -1 : 1;
                  if (valA > valB) return ascending ? 1 : -1;
                  return 0;
                });
                return {
                  then: (cb: any) => Promise.resolve({ data: sorted, error: null }).then(cb)
                };
              }
            };
          }
        };
      }

      if (table === "excel_templates") {
        const getTemplates = () => {
          if (typeof window === "undefined") return [];
          const dataStr = localStorage.getItem("excel_lms_templates");
          if (!dataStr) {
            // Seed with initial templates
            const initial = [
              {
                id: "tmpl-1",
                title: "Template Slip Gaji & Payroll Otomatis",
                format: "xlsx (Excel)",
                size: "142 KB",
                downloads: "1,240 unduhan",
                description: "Template siap pakai lengkap dengan slip gaji interaktif yang terhubung langsung dengan tabel database karyawan menggunakan rumus VLOOKUP.",
                file_url: "https://raw.githubusercontent.com/excel-wahana/templates/main/payroll-template.xlsx",
                file_name: "payroll_template.xlsx",
                images: [
                  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&auto=format&fit=crop&q=60"
                ]
              },
              {
                id: "tmpl-2",
                title: "Dashboard KPI Keuangan & Kas Bulanan",
                format: "xlsx (Excel)",
                size: "98 KB",
                downloads: "850 unduhan",
                description: "Pantau arus kas masuk dan keluar secara bulanan lengkap dengan grafik tren performa laba rugi otomatis dan ringkasan persentase bulanan.",
                file_url: "https://raw.githubusercontent.com/excel-wahana/templates/main/finance-dashboard.xlsx",
                file_name: "finance_dashboard.xlsx",
                images: [
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60"
                ]
              },
              {
                id: "tmpl-3",
                title: "Rekap Nilai Siswa & Raport Guru",
                format: "xlsx (Excel)",
                size: "115 KB",
                downloads: "590 unduhan",
                description: "Permudah pembagian rapor dengan sistem pengisi nilai bersyarat menggunakan COUNTIF, AVERAGE, serta konversi Grade otomatis (A, B, C, D).",
                file_url: "https://raw.githubusercontent.com/excel-wahana/templates/main/grading-system.xlsx",
                file_name: "grading_system.xlsx",
                images: [
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60"
                ]
              },
              {
                id: "tmpl-4",
                title: "Jadwal Kerja Shift Karyawan Mingguan",
                format: "xlsx (Excel)",
                size: "76 KB",
                downloads: "920 unduhan",
                description: "Template penjadwalan shift kerja bergilir yang menghitung total jam kerja mingguan secara otomatis dan mendeteksi bentrok jadwal.",
                file_url: "https://raw.githubusercontent.com/excel-wahana/templates/main/weekly-schedule.xlsx",
                file_name: "weekly_schedule.xlsx",
                images: [
                  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60"
                ]
              }
            ];
            localStorage.setItem("excel_lms_templates", JSON.stringify(initial));
            return initial;
          }
          return JSON.parse(dataStr);
        };

        const setTemplates = (templates: any[]) => {
          if (typeof window === "undefined") return;
          localStorage.setItem("excel_lms_templates", JSON.stringify(templates));
        };

        return {
          select: () => ({
            then: (cb: any) => Promise.resolve({ data: getTemplates(), error: null }).then(cb),
            order: (col: string, { ascending }: any = {}) => {
              const sorted = [...getTemplates()];
              sorted.sort((a: any, b: any) => {
                const valA = String(a[col] || "").toLowerCase();
                const valB = String(b[col] || "").toLowerCase();
                if (valA < valB) return ascending ? -1 : 1;
                if (valA > valB) return ascending ? 1 : -1;
                return 0;
              });
              return {
                then: (cb: any) => Promise.resolve({ data: sorted, error: null }).then(cb)
              };
            }
          }),
          insert: (newTemplate: any) => ({
            then: (cb: any) => {
              const current = getTemplates();
              const tmplsArray = Array.isArray(newTemplate) ? newTemplate : [newTemplate];
              // Ensure id is present
              const tmplsWithId = tmplsArray.map(t => ({
                id: t.id || "tmpl-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
                format: t.format || "xlsx (Excel)",
                downloads: t.downloads || "0 unduhan",
                ...t
              }));
              const updated = [...current, ...tmplsWithId];
              setTemplates(updated);
              return Promise.resolve({ data: tmplsWithId, error: null }).then(cb);
            }
          }),
          delete: () => ({
            eq: (col: string, val: any) => ({
              then: (cb: any) => {
                const current = getTemplates();
                const updated = current.filter((t: any) => t[col] !== val);
                setTemplates(updated);
                return Promise.resolve({ data: null, error: null }).then(cb);
              }
            })
          }),
          update: (data: any) => ({
            eq: (col: string, val: any) => ({
              then: (cb: any) => {
                const current = getTemplates();
                const updated = current.map((t: any) => {
                  if (t[col] === val) {
                    return { ...t, ...data };
                  }
                  return t;
                });
                setTemplates(updated);
                return Promise.resolve({ data: data, error: null }).then(cb);
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
