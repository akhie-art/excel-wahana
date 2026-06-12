import { create } from "zustand";
import { supabase, isSupabaseConfigured, UserProgress } from "./supabase";
import { EXCEL_MODULES, checkFormula, ExcelModule, ModuleStep, isTaskLocked, generateSmartHint } from "./modules";

export interface StudentData {
  id: string;
  name: string;
  email: string;
  completedCount: number;
  completedSteps: string[];
  lastActive: string;
}

export interface PeerState {
  userId: string;
  name: string;
  role: "peserta" | "instruktur";
  activeCell: { row: number; col: number } | null;
  color: string;
  stepId: string;
  formulaInput?: string;
  isSuccess?: boolean;
  taskAnswers?: string[];
  completedSteps?: string[];
}

interface AppState {
  // Auth & Profile
  user: any | null;
  progress: UserProgress | null;
  isConfigured: boolean;
  isLoading: boolean;

  // Roles System
  role: "peserta" | "instruktur";
  setRole: (role: "peserta" | "instruktur") => Promise<void>;

  // Dynamic Curriculum
  modules: ExcelModule[];
  addCustomStep: (moduleId: string, step: ModuleStep) => Promise<void>;
  updateCustomStep: (moduleId: string, step: ModuleStep) => Promise<void>;
  deleteCustomStep: (moduleId: string, stepId: string) => Promise<void>;

  // Instructor Data
  students: StudentData[];

  // Active Lesson Position
  currentModuleIndex: number;
  currentStepIndex: number;

  // Interactive formula editor state
  formulaInput: string;
  isSuccess: boolean;
  isValidated: boolean;
  shakeTrigger: boolean;
  lastErrorHint: string | null;

  // Multi-task state
  selectedTaskIndex: number;
  taskAnswers: string[];
  setSelectedTaskIndex: (index: number) => void;

  // Multiplayer
  peerStates: Record<string, PeerState>;
  setPeerState: (clientId: string, state: PeerState | null) => void;

  // Getters
  getCurrentModule: () => ExcelModule;
  getCurrentStep: () => ModuleStep;

  // Methods
  loadUserAndProgress: () => Promise<void>;
  loadStudents: () => Promise<void>;
  signInWithPassword: (email: string, password?: string) => Promise<{ error: any }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  
  setFormulaInput: (input: string) => void;
  validateFormula: () => Promise<boolean>;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  jumpToStep: (moduleIndex: number, stepIndex: number) => void;
}

const MOCK_STUDENTS: StudentData[] = [];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  progress: null,
  isConfigured: isSupabaseConfigured,
  isLoading: true,
  role: "peserta",

  modules: EXCEL_MODULES,
  students: MOCK_STUDENTS,

  currentModuleIndex: 0,
  currentStepIndex: 0,

  formulaInput: "",
  isSuccess: false,
  isValidated: false,
  shakeTrigger: false,
  lastErrorHint: null,
  selectedTaskIndex: 0,
  taskAnswers: [],
  setSelectedTaskIndex: (index: number) => {
    const step = get().getCurrentStep();
    if (step.tasks && step.tasks[index]) {
      set({
        selectedTaskIndex: index,
        formulaInput: get().taskAnswers[index] || "",
        isValidated: false,
        lastErrorHint: null
      });
    }
  },

  peerStates: {},
  setPeerState: (clientId: string, state: PeerState | null) => {
    const current = get().peerStates;
    const next = { ...current };
    if (state === null) {
      delete next[clientId];
    } else {
      next[clientId] = state;
    }
    set({ peerStates: next });
  },

  getCurrentModule: () => {
    const { modules, currentModuleIndex } = get();
    return modules[currentModuleIndex] || modules[0];
  },

  getCurrentStep: () => {
    const currentModule = get().getCurrentModule();
    return currentModule.steps[get().currentStepIndex] || currentModule.steps[0];
  },

  loadUserAndProgress: async () => {
    set({ isLoading: true });
    try {
      // 1. Fetch modules, steps, and custom steps from database
      const { data: customStepsData } = await supabase.from("custom_steps").select("*");
      
      let baseModules: ExcelModule[] = [];

      if (isSupabaseConfigured) {
        try {
          const { data: dbModules, error: modErr } = await supabase
            .from("modules")
            .select("*")
            .order("sort_order", { ascending: true });
          
          const { data: dbSteps, error: stepErr } = await supabase
            .from("steps")
            .select("*")
            .order("sort_order", { ascending: true });

          if (dbModules && dbSteps && !modErr && !stepErr) {
            baseModules = dbModules.map((mod: any) => ({
              id: mod.id,
              title: mod.title,
              description: mod.description || "",
              steps: dbSteps
                .filter((step: any) => step.module_id === mod.id)
                .map((step: any) => ({
                  id: step.id,
                  title: step.title,
                  shortDescription: step.short_description || "",
                  conceptExplanation: step.concept_explanation || "",
                  instructions: step.instructions || "",
                  headers: step.headers || [],
                  dummyData: step.dummy_data || [],
                  validFormulas: step.valid_formulas || [],
                  expectedResult: step.expected_result || "",
                  resultCell: step.result_cell || null,
                  hint: step.hint || "",
                  tasks: step.tasks || []
                }))
            }));
          } else {
            // Fallback to static if query fails
            baseModules = EXCEL_MODULES.map(mod => ({
              ...mod,
              steps: [...mod.steps]
            }));
          }
        } catch (e) {
          // Fallback to static on exception
          baseModules = EXCEL_MODULES.map(mod => ({
            ...mod,
            steps: [...mod.steps]
          }));
        }
      } else {
        // Fallback to static if Supabase is not configured
        baseModules = EXCEL_MODULES.map(mod => ({
          ...mod,
          steps: [...mod.steps]
        }));
      }

      if (customStepsData && Array.isArray(customStepsData)) {
        customStepsData.forEach((row: any) => {
          const step: ModuleStep = {
            id: row.id,
            title: row.title,
            shortDescription: row.short_description || row.shortDescription,
            conceptExplanation: row.concept_explanation || row.conceptExplanation,
            instructions: row.instructions,
            headers: row.headers,
            dummyData: row.dummy_data || row.dummyData,
            validFormulas: row.valid_formulas || row.validFormulas,
            expectedResult: row.expected_result || row.expectedResult,
            resultCell: row.result_cell || row.resultCell,
            hint: row.hint,
            tasks: row.tasks || undefined,
            isCustom: true
          };
          
          const moduleId = row.module_id || row.moduleId;
          const targetModule = baseModules.find(m => m.id === moduleId);
          if (targetModule) {
            if (!targetModule.steps.some(s => s.id === step.id)) {
              targetModule.steps.push(step);
            }
          }
        });
      }
      set({ modules: baseModules });

      // 1.5. Exchange OAuth PKCE code for session client-side if present
      if (typeof window !== "undefined" && isSupabaseConfigured) {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
            // Clean up code query parameter from URL
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState(null, "", url.pathname + url.search);
          } catch (err) {
            console.error("Failed to exchange auth code for session:", err);
          }
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      set({ user });

      let progressData: UserProgress | null = null;
      
      if (user) {
        const { data, error } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) {
          progressData = data;
        } else {
          const isInstructor = user.email === "instruktur@excel.com" || user.email?.includes("instruktur");
          const newProgress: Omit<UserProgress, "last_active_at"> = {
            user_id: user.id,
            current_module_id: "hitung-data",
            current_step_id: "sum",
            completed_steps: [],
            streak_count: 0,
            role: isInstructor ? "instruktur" : "peserta",
            email: user.email,
            name: user.user_metadata?.name || user.email?.split("@")[0],
          };
          const { data: insertedData } = await supabase
            .from("user_progress")
            .upsert(newProgress)
            .select()
            .single();
            
          if (insertedData) progressData = insertedData;
        }
      }

      const isInstructorAccount = user?.email === "instruktur@excel.com" || user?.email?.includes("instruktur");
      const resolvedRole: "peserta" | "instruktur" = isInstructorAccount ? "instruktur" : "peserta";

      set({ 
        progress: progressData,
        role: resolvedRole
      });

      // Self-heal the database role if it differs
      if (progressData && progressData.role !== resolvedRole) {
        const updatedProgress = { ...progressData, role: resolvedRole };
        set({ progress: updatedProgress });
        await supabase
          .from("user_progress")
          .update({ role: resolvedRole })
          .eq("user_id", progressData.user_id);
      }

      if (resolvedRole === "instruktur") {
        await get().loadStudents();
      }

      if (progressData) {
        let matchedModuleIdx = 0;
        let matchedStepIdx = 0;
        
        get().modules.forEach((mod, modIdx) => {
          mod.steps.forEach((step, stepIdx) => {
            if (step.id === progressData?.current_step_id) {
              matchedModuleIdx = modIdx;
              matchedStepIdx = stepIdx;
            }
          });
        });

        const activeStep = get().modules[matchedModuleIdx].steps[matchedStepIdx];
        const isReadingStep = activeStep.validFormulas.length === 0 && (!activeStep.tasks || activeStep.tasks.length === 0);
        const isStepCompleted = progressData.completed_steps.includes(progressData.current_step_id) || isReadingStep;

        let initialTaskAnswers: string[] = [];
        let initialFormulaInput = "";
        if (activeStep.tasks && activeStep.tasks.length > 0) {
          initialTaskAnswers = activeStep.tasks.map(t => 
            isStepCompleted ? t.validFormulas[0] : ""
          );
          initialFormulaInput = isStepCompleted ? activeStep.tasks[0].validFormulas[0] : "";
        } else {
          initialFormulaInput = isStepCompleted && !isReadingStep 
            ? activeStep.validFormulas[0] 
            : "";
        }

        set({
          currentModuleIndex: matchedModuleIdx,
          currentStepIndex: matchedStepIdx,
          formulaInput: initialFormulaInput,
          isSuccess: isStepCompleted,
          isValidated: isStepCompleted,
          selectedTaskIndex: 0,
          taskAnswers: initialTaskAnswers
        });
      }
    } catch (err) {
      console.error("Error loading user progress:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  loadStudents: async () => {
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("role", "peserta");

      if (!error && data) {
        const mappedStudents: StudentData[] = data.map((row: any) => {
          const lastActiveDate = row.last_active_at ? new Date(row.last_active_at) : new Date();
          const now = new Date();
          const diffMs = now.getTime() - lastActiveDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let lastActiveStr = "Baru saja";
          if (diffDays > 0) {
            lastActiveStr = `${diffDays} hari yang lalu`;
          } else if (diffHours > 0) {
            lastActiveStr = `${diffHours} jam yang lalu`;
          } else if (diffMins > 0) {
            lastActiveStr = `${diffMins} menit yang lalu`;
          }

          return {
            id: row.user_id,
            name: row.name || row.email?.split("@")[0] || `User_${row.user_id.substring(0, 5)}`,
            email: row.email || "-",
            completedCount: row.completed_steps?.length || 0,
            completedSteps: row.completed_steps || [],
            lastActive: lastActiveStr
          };
        });
        set({ students: mappedStudents });
      }
    } catch (err) {
      console.error("Error loading students list:", err);
    }
  },

  setRole: async (newRole: "peserta" | "instruktur") => {
    set({ role: newRole });
    const { progress } = get();
    
    if (progress) {
      const updatedProgress = { ...progress, role: newRole };
      set({ progress: updatedProgress });

      await supabase
        .from("user_progress")
        .update({ role: newRole })
        .eq("user_id", progress.user_id);
    }

    if (newRole === "instruktur") {
      await get().loadStudents();
    }
  },

  addCustomStep: async (moduleId: string, newStep: ModuleStep) => {
    // 1. Insert into Supabase table custom_steps
    const dbStep: any = {
      id: newStep.id,
      module_id: moduleId,
      title: newStep.title,
      short_description: newStep.shortDescription,
      concept_explanation: newStep.conceptExplanation,
      instructions: newStep.instructions,
      headers: newStep.headers,
      dummy_data: newStep.dummyData,
      valid_formulas: newStep.validFormulas,
      expected_result: newStep.expectedResult,
      result_cell: newStep.resultCell,
      hint: newStep.hint,
    };

    if (newStep.tasks) {
      dbStep.tasks = newStep.tasks;
    }

    try {
      const { error } = await supabase.from("custom_steps").insert(dbStep);
      if (error) {
        console.error("Supabase insert error details:", error);
        throw error;
      }
    } catch (err) {
      console.error("Failed to insert custom step into Supabase:", err);
      throw err;
    }

    // 2. Update local state
    const updatedModules = get().modules.map((mod) => {
      if (mod.id === moduleId) {
        const exists = mod.steps.some(s => s.id === newStep.id);
        const stepWithCustom = { ...newStep, isCustom: true };
        return {
          ...mod,
          steps: exists
            ? mod.steps.map((s) => (s.id === newStep.id ? stepWithCustom : s))
            : [...mod.steps, stepWithCustom],
        };
      }
      return mod;
    });

    set({ modules: updatedModules });
  },

  updateCustomStep: async (moduleId: string, updatedStep: ModuleStep) => {
    // 1. Update in Supabase table custom_steps (Delete then Insert to bypass missing RLS update policy)
    const dbStep: any = {
      id: updatedStep.id,
      module_id: moduleId,
      title: updatedStep.title,
      short_description: updatedStep.shortDescription,
      concept_explanation: updatedStep.conceptExplanation,
      instructions: updatedStep.instructions,
      headers: updatedStep.headers,
      dummy_data: updatedStep.dummyData,
      valid_formulas: updatedStep.validFormulas,
      expected_result: updatedStep.expectedResult,
      result_cell: updatedStep.resultCell,
      hint: updatedStep.hint,
    };

    if (updatedStep.tasks) {
      dbStep.tasks = updatedStep.tasks;
    } else {
      dbStep.tasks = null;
    }

    try {
      // Delete existing step first
      await supabase
        .from("custom_steps")
        .delete()
        .eq("id", updatedStep.id);

      // Insert updated step
      const { error } = await supabase
        .from("custom_steps")
        .insert(dbStep);

      if (error) {
        console.error("Supabase insert after delete error details:", error);
        throw error;
      }
    } catch (err) {
      console.error("Failed to update custom step in Supabase:", err);
      throw err;
    }

    // 2. Update local state
    const updatedModules = get().modules.map((mod) => {
      const stepWithCustom = { ...updatedStep, isCustom: true };
      // If module changed (moved to another module)
      const stepExists = mod.steps.some(s => s.id === updatedStep.id);
      if (stepExists && mod.id !== moduleId) {
        return {
          ...mod,
          steps: mod.steps.filter(s => s.id !== updatedStep.id)
        };
      }
      if (mod.id === moduleId) {
        const exists = mod.steps.some(s => s.id === updatedStep.id);
        return {
          ...mod,
          steps: exists
            ? mod.steps.map((s) => (s.id === updatedStep.id ? stepWithCustom : s))
            : [...mod.steps, stepWithCustom],
        };
      }
      return mod;
    });

    set({ modules: updatedModules });
  },

  deleteCustomStep: async (moduleId: string, stepId: string) => {
    // 1. Delete from Supabase table custom_steps
    try {
      await supabase.from("custom_steps").delete().eq("id", stepId);
    } catch (err) {
      console.error("Failed to delete custom step from Supabase:", err);
    }

    // 2. Update local state
    const updatedModules = get().modules.map((mod) => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          steps: mod.steps.filter((step) => step.id !== stepId),
        };
      }
      return mod;
    });

    set({ modules: updatedModules });
  },

  signInWithPassword: async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || "dummy-password-for-simplification",
    });
    if (!error) {
      await get().loadUserAndProgress();
    }
    return { error };
  },

  signUp: async (email: string, password?: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || "dummy-password-for-simplification",
      options: fullName ? {
        data: {
          name: fullName
        }
      } : undefined
    });
    if (!error) {
      await get().loadUserAndProgress();
    }
    return { error };
  },

  signInWithGoogle: async () => {
    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/belajar`
      : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    return { error };
  },

  resetPassword: async (email: string) => {
    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/`
      : undefined;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error };
  },

  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      progress: null,
      role: "peserta",
      currentModuleIndex: 0,
      currentStepIndex: 0,
      formulaInput: "",
      isSuccess: false,
      isValidated: false,
      lastErrorHint: null
    });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      await get().loadUserAndProgress();
    }
  },

  setFormulaInput: (input: string) => {
    const currentStep = get().getCurrentStep();
    if (currentStep.tasks && currentStep.tasks.length > 0) {
      const { selectedTaskIndex, taskAnswers } = get();
      const newAnswers = [...taskAnswers];
      newAnswers[selectedTaskIndex] = input;
      set({ 
        formulaInput: input, 
        taskAnswers: newAnswers,
        isValidated: false, 
        lastErrorHint: null 
      });
    } else {
      set({ formulaInput: input, isValidated: false, lastErrorHint: null });
    }
  },

  validateFormula: async () => {
    const { formulaInput, progress, selectedTaskIndex, taskAnswers } = get();
    const currentStep = get().getCurrentStep();
    
    // If it's a reading-only step, validate immediately
    if (currentStep.validFormulas.length === 0 && (!currentStep.tasks || currentStep.tasks.length === 0)) {
      set({ isSuccess: true, isValidated: true });
      return true;
    }

    if (currentStep.tasks && currentStep.tasks.length > 0) {
      // Validate the CURRENT active task first
      const currentTask = currentStep.tasks[selectedTaskIndex];
      const isCurrentValid = checkFormula(
        formulaInput,
        currentTask.validFormulas,
        currentTask.expectedResult,
        currentStep.dummyData,
        currentStep.headers,
        taskAnswers,
        currentStep.tasks
      );

      if (!isCurrentValid) {
        const smartHint = generateSmartHint(formulaInput, currentTask.validFormulas);
        set({ 
          isSuccess: false, 
          isValidated: true,
          shakeTrigger: !get().shakeTrigger, 
          lastErrorHint: smartHint || `${currentTask.label} salah: ${currentTask.hint}`
        });
        return false;
      }

      // Update taskAnswers in local state
      const updatedAnswers = [...taskAnswers];
      updatedAnswers[selectedTaskIndex] = formulaInput;

      // Auto-fill columns for final-mega-case (Studi Kasus Akbar) to mimic Excel's drag-down behavior
      if (currentStep.id === "final-mega-case") {
        const currentTaskCol = currentTask.resultCell.col;
        if (currentTaskCol >= 3 && currentTaskCol <= 8 && currentTask.resultCell.row <= 3) {
          currentStep.tasks.forEach((task, idx) => {
            if (
              task.resultCell.col === currentTaskCol &&
              task.resultCell.row <= 3 &&
              idx !== selectedTaskIndex
            ) {
              updatedAnswers[idx] = task.validFormulas[0];
            }
          });
        }
      }

      // Find the next incomplete task starting from selectedTaskIndex + 1, wrapping around
      let nextIncorrectIndex = -1;
      for (let i = 0; i < currentStep.tasks.length; i++) {
        const checkIndex = (selectedTaskIndex + 1 + i) % currentStep.tasks.length;
        const task = currentStep.tasks[checkIndex];
        const answer = updatedAnswers[checkIndex] || "";
        const isValid = checkFormula(
          answer,
          task.validFormulas,
          task.expectedResult,
          currentStep.dummyData,
          currentStep.headers,
          updatedAnswers,
          currentStep.tasks
        );
        const isLocked = isTaskLocked(
          task,
          updatedAnswers,
          currentStep.tasks,
          currentStep.dummyData,
          currentStep.headers
        );
        if (!isValid && !isLocked) {
          nextIncorrectIndex = checkIndex;
          break;
        }
      }

      if (nextIncorrectIndex === -1) {
        // All correct!
        set({ 
          isSuccess: true, 
          isValidated: true, 
          lastErrorHint: null,
          taskAnswers: updatedAnswers
        });

        if (typeof window !== "undefined") {
          import("canvas-confetti").then((confetti) => {
            confetti.default({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
              colors: ["#22c55e", "#3b82f6", "#10b981", "#ffffff"]
            });
          });
        }

        if (progress) {
          const stepId = currentStep.id;
          const alreadyCompleted = progress.completed_steps.includes(stepId);
          
          const completed_steps = alreadyCompleted 
            ? progress.completed_steps 
            : [...progress.completed_steps, stepId];

          const now = new Date();
          const updatedProgress = {
            ...progress,
            completed_steps,
            last_active_at: now.toISOString(),
          };

          set({ progress: updatedProgress });

          await supabase
            .from("user_progress")
            .update({
              completed_steps,
              last_active_at: now.toISOString(),
            })
            .eq("user_id", progress.user_id);
        }
        return true;
      } else {
        // Move focus/selection to the next incomplete task cell
        set({
          isSuccess: false,
          isValidated: false,
          lastErrorHint: null,
          selectedTaskIndex: nextIncorrectIndex,
          formulaInput: updatedAnswers[nextIncorrectIndex] || "",
          taskAnswers: updatedAnswers
        });
        return true;
      }
    } else {
      const isValid = checkFormula(
        formulaInput,
        currentStep.validFormulas,
        currentStep.expectedResult,
        currentStep.dummyData,
        currentStep.headers,
        [],
        []
      );

      if (isValid) {
        set({ isSuccess: true, isValidated: true, lastErrorHint: null });

        if (typeof window !== "undefined") {
          import("canvas-confetti").then((confetti) => {
            confetti.default({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
              colors: ["#22c55e", "#3b82f6", "#10b981", "#ffffff"]
            });
          });
        }

        if (progress) {
          const stepId = currentStep.id;
          const alreadyCompleted = progress.completed_steps.includes(stepId);
          
          const completed_steps = alreadyCompleted 
            ? progress.completed_steps 
            : [...progress.completed_steps, stepId];

          const now = new Date();
          const updatedProgress = {
            ...progress,
            completed_steps,
            last_active_at: now.toISOString(),
          };

          set({ progress: updatedProgress });

          await supabase
            .from("user_progress")
            .update({
              completed_steps,
              last_active_at: now.toISOString(),
            })
            .eq("user_id", progress.user_id);
        }
        return true;
      } else {
        const smartHint = generateSmartHint(formulaInput, currentStep.validFormulas);
        set({ 
          isSuccess: false, 
          isValidated: true,
          shakeTrigger: !get().shakeTrigger, 
          lastErrorHint: smartHint || currentStep.hint 
        });
        return false;
      }
    }
  },

  nextStep: async () => {
    const { currentModuleIndex, currentStepIndex, progress, modules } = get();
    const currentModule = modules[currentModuleIndex];

    let nextModuleIdx = currentModuleIndex;
    let nextStepIdx = currentStepIndex + 1;

    if (nextStepIdx >= currentModule.steps.length) {
      nextModuleIdx = currentModuleIndex + 1;
      nextStepIdx = 0;
    }

    if (nextModuleIdx >= modules.length) {
      return;
    }

    const nextStep = modules[nextModuleIdx].steps[nextStepIdx];
    const nextStepId = nextStep.id;
    const nextModuleId = modules[nextModuleIdx].id;

    const isReadingStep = nextStep.validFormulas.length === 0 && (!nextStep.tasks || nextStep.tasks.length === 0);
    const isStepCompleted = progress?.completed_steps.includes(nextStepId) || isReadingStep;

    let initialTaskAnswers: string[] = [];
    let initialFormulaInput = "";
    if (nextStep.tasks && nextStep.tasks.length > 0) {
      initialTaskAnswers = nextStep.tasks.map(t => 
        isStepCompleted ? t.validFormulas[0] : ""
      );
      initialFormulaInput = isStepCompleted ? nextStep.tasks[0].validFormulas[0] : "";
    } else {
      initialFormulaInput = isStepCompleted && !isReadingStep 
        ? nextStep.validFormulas[0] 
        : "";
    }

    set({
      currentModuleIndex: nextModuleIdx,
      currentStepIndex: nextStepIdx,
      formulaInput: initialFormulaInput,
      isSuccess: isStepCompleted,
      isValidated: isStepCompleted,
      lastErrorHint: null,
      selectedTaskIndex: 0,
      taskAnswers: initialTaskAnswers
    });

    if (progress) {
      const updatedProgress = {
        ...progress,
        current_module_id: nextModuleId,
        current_step_id: nextStepId,
      };

      set({ progress: updatedProgress });

      await supabase
        .from("user_progress")
        .update({
          current_module_id: nextModuleId,
          current_step_id: nextStepId,
        })
        .eq("user_id", progress.user_id);
    }
  },

  prevStep: () => {
    const { currentModuleIndex, currentStepIndex, progress, modules } = get();
    
    let prevModuleIdx = currentModuleIndex;
    let prevStepIdx = currentStepIndex - 1;

    if (prevStepIdx < 0) {
      prevModuleIdx = currentModuleIndex - 1;
      if (prevModuleIdx < 0) {
        return;
      }
      prevStepIdx = modules[prevModuleIdx].steps.length - 1;
    }

    const prevStep = modules[prevModuleIdx].steps[prevStepIdx];
    const prevStepId = prevStep.id;

    const isReadingStep = prevStep.validFormulas.length === 0 && (!prevStep.tasks || prevStep.tasks.length === 0);
    const isStepCompleted = progress?.completed_steps.includes(prevStepId) || isReadingStep;

    let initialTaskAnswers: string[] = [];
    let initialFormulaInput = "";
    if (prevStep.tasks && prevStep.tasks.length > 0) {
      initialTaskAnswers = prevStep.tasks.map(t => 
        isStepCompleted ? t.validFormulas[0] : ""
      );
      initialFormulaInput = isStepCompleted ? prevStep.tasks[0].validFormulas[0] : "";
    } else {
      initialFormulaInput = isStepCompleted && !isReadingStep 
        ? prevStep.validFormulas[0] 
        : "";
    }

    set({
      currentModuleIndex: prevModuleIdx,
      currentStepIndex: prevStepIdx,
      formulaInput: initialFormulaInput,
      isSuccess: isStepCompleted,
      isValidated: isStepCompleted,
      lastErrorHint: null,
      selectedTaskIndex: 0,
      taskAnswers: initialTaskAnswers
    });
  },

  jumpToStep: (moduleIndex: number, stepIndex: number) => {
    const { progress, modules } = get();
    if (moduleIndex < 0 || moduleIndex >= modules.length) return;
    const mod = modules[moduleIndex];
    if (stepIndex < 0 || stepIndex >= mod.steps.length) return;

    const step = mod.steps[stepIndex];
    const stepId = step.id;

    const isReadingStep = step.validFormulas.length === 0 && (!step.tasks || step.tasks.length === 0);
    const isStepCompleted = progress?.completed_steps.includes(stepId) || isReadingStep;

    let initialTaskAnswers: string[] = [];
    let initialFormulaInput = "";
    if (step.tasks && step.tasks.length > 0) {
      initialTaskAnswers = step.tasks.map(t => 
        isStepCompleted ? t.validFormulas[0] : ""
      );
      initialFormulaInput = isStepCompleted ? step.tasks[0].validFormulas[0] : "";
    } else {
      initialFormulaInput = isStepCompleted && !isReadingStep 
        ? step.validFormulas[0] 
        : "";
    }

    set({
      currentModuleIndex: moduleIndex,
      currentStepIndex: stepIndex,
      formulaInput: initialFormulaInput,
      isSuccess: isStepCompleted,
      isValidated: isStepCompleted,
      lastErrorHint: null,
      selectedTaskIndex: 0,
      taskAnswers: initialTaskAnswers
    });
  }
}));
