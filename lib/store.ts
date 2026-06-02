import { create } from "zustand";
import { supabase, isSupabaseConfigured, UserProgress } from "./supabase";
import { EXCEL_MODULES, checkFormula, ExcelModule, ModuleStep, isTaskLocked } from "./modules";

export interface StudentData {
  id: string;
  name: string;
  email: string;
  completedCount: number;
  streak: number;
  lastActive: string;
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
  addCustomStep: (moduleId: string, step: ModuleStep) => void;
  deleteCustomStep: (moduleId: string, stepId: string) => void;

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

  // Getters
  getCurrentModule: () => ExcelModule;
  getCurrentStep: () => ModuleStep;

  // Methods
  loadUserAndProgress: () => Promise<void>;
  signInWithPassword: (email: string) => Promise<{ error: any }>;
  signUp: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  
  setFormulaInput: (input: string) => void;
  validateFormula: () => Promise<boolean>;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  jumpToStep: (moduleIndex: number, stepIndex: number) => void;
}

const MOCK_STUDENTS: StudentData[] = [
  { id: "s1", name: "Rian Hidayat", email: "rian.hidayat@example.com", completedCount: 15, streak: 3, lastActive: "Baru saja" },
  { id: "s2", name: "Siti Rahma", email: "siti.rahma@example.com", completedCount: 32, streak: 5, lastActive: "10 menit yang lalu" },
  { id: "s3", name: "Budi Santoso", email: "budi.s@example.com", completedCount: 8, streak: 1, lastActive: "2 jam yang lalu" },
  { id: "s4", name: "Aulia Putri", email: "aulia.putri@example.com", completedCount: 22, streak: 4, lastActive: "Kemarin" },
];

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
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      set({ user });

      let progressData: UserProgress | null = null;
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .single();

      if (!error && data) {
        progressData = data;
      } else if (user) {
        const newProgress: Omit<UserProgress, "last_active_at"> = {
          user_id: user.id,
          current_module_id: "basics",
          current_step_id: "sum-basics",
          completed_steps: [],
          streak_count: 0,
          role: "peserta",
        };
        const { data: insertedData } = await supabase
          .from("user_progress")
          .upsert(newProgress)
          .select()
          .single();
          
        if (insertedData) progressData = insertedData;
      } else {
        const { data: mockData } = await supabase
          .from("user_progress")
          .select("*")
          .single();
        progressData = mockData;
      }

      set({ 
        progress: progressData,
        role: progressData?.role || "peserta"
      });

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
  },

  addCustomStep: (moduleId: string, newStep: ModuleStep) => {
    const updatedModules = get().modules.map((mod) => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          steps: [...mod.steps, newStep],
        };
      }
      return mod;
    });

    set({ modules: updatedModules });
  },

  deleteCustomStep: (moduleId: string, stepId: string) => {
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

  signInWithPassword: async (email: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password-for-simplification",
    });
    if (!error) {
      await get().loadUserAndProgress();
    }
    return { error };
  },

  signUp: async (email: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: "dummy-password-for-simplification",
    });
    if (!error) {
      await get().loadUserAndProgress();
    }
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
    await get().loadUserAndProgress();
  },

  signInWithGithub: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
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
      const isCurrentValid = checkFormula(formulaInput, currentTask.validFormulas);

      if (!isCurrentValid) {
        set({ 
          isSuccess: false, 
          isValidated: true,
          shakeTrigger: !get().shakeTrigger, 
          lastErrorHint: `${currentTask.label} salah: ${currentTask.hint}`
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
        const isValid = checkFormula(answer, task.validFormulas);
        const isLocked = isTaskLocked(task, updatedAnswers, currentStep.tasks);
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

          let newStreak = progress.streak_count || 0;
          const now = new Date();
          const lastActive = progress.last_active_at ? new Date(progress.last_active_at) : null;
          
          if (!lastActive) {
            newStreak = 1;
          } else {
            const diffTime = Math.abs(now.getTime() - lastActive.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            } else if (newStreak === 0) {
              newStreak = 1;
            }
          }

          const updatedProgress = {
            ...progress,
            completed_steps,
            streak_count: newStreak,
            last_active_at: now.toISOString(),
          };

          set({ progress: updatedProgress });

          await supabase
            .from("user_progress")
            .update({
              completed_steps,
              streak_count: newStreak,
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
      const isValid = checkFormula(formulaInput, currentStep.validFormulas);

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

          let newStreak = progress.streak_count || 0;
          const now = new Date();
          const lastActive = progress.last_active_at ? new Date(progress.last_active_at) : null;
          
          if (!lastActive) {
            newStreak = 1;
          } else {
            const diffTime = Math.abs(now.getTime() - lastActive.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            } else if (newStreak === 0) {
              newStreak = 1;
            }
          }

          const updatedProgress = {
            ...progress,
            completed_steps,
            streak_count: newStreak,
            last_active_at: now.toISOString(),
          };

          set({ progress: updatedProgress });

          await supabase
            .from("user_progress")
            .update({
              completed_steps,
              streak_count: newStreak,
              last_active_at: now.toISOString(),
            })
            .eq("user_id", progress.user_id);
        }
        return true;
      } else {
        set({ 
          isSuccess: false, 
          isValidated: true,
          shakeTrigger: !get().shakeTrigger, 
          lastErrorHint: currentStep.hint 
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
