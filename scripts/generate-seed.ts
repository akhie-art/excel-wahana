import fs from "fs";
import path from "path";
import { EXCEL_MODULES } from "../lib/modules";

// Helper to escape string for SQL
function escapeSQL(str: string | undefined | null): string {
  if (str === undefined || str === null) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeJSON(obj: any): string {
  if (obj === undefined || obj === null) return "NULL";
  const jsonStr = JSON.stringify(obj);
  return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
}

function escapeArray(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return "array[]::text[]";
  const escapedElements = arr.map(el => `'${el.replace(/'/g, "''")}'`);
  return `array[${escapedElements.join(", ")}]::text[]`;
}

let sql = `-- Drop existing policies if they exist to avoid duplicate errors
drop policy if exists "Allow public read access to modules" on public.modules;
drop policy if exists "Allow public read access to steps" on public.steps;

-- 1. Create a table to store curriculum modules
create table if not exists public.modules (
  id text primary key,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 2. Create a table to store steps for each module
create table if not exists public.steps (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  short_description text,
  concept_explanation text,
  instructions text,
  headers text[] not null default '{}',
  dummy_data jsonb not null default '[]',
  valid_formulas text[] default '{}',
  expected_result text default '',
  result_cell jsonb default null, -- format: {"row": 0, "col": 0}
  hint text default '',
  tasks jsonb default '[]', -- list of tasks for multi-task steps
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Enable RLS for read-only public access to curriculum
alter table public.modules enable row level security;
alter table public.steps enable row level security;

create policy "Allow public read access to modules" on public.modules
  for select using (true);

create policy "Allow public read access to steps" on public.steps
  for select using (true);

`;

// Append Insert for modules
sql += "\n-- 3. Seed modules\n";
EXCEL_MODULES.forEach((mod, modIdx) => {
  const sortOrder = modIdx * 10;
  sql += `insert into public.modules (id, title, description, sort_order)
values (
  ${escapeSQL(mod.id)},
  ${escapeSQL(mod.title)},
  ${escapeSQL(mod.description)},
  ${sortOrder}
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;\n\n`;
});

// Append Insert for steps
sql += "\n-- 4. Seed steps\n";
EXCEL_MODULES.forEach((mod) => {
  mod.steps.forEach((step, stepIdx) => {
    const sortOrder = stepIdx * 10;
    sql += `insert into public.steps (
  id,
  module_id,
  title,
  short_description,
  concept_explanation,
  instructions,
  headers,
  dummy_data,
  valid_formulas,
  expected_result,
  result_cell,
  hint,
  tasks,
  sort_order
) values (
  ${escapeSQL(step.id)},
  ${escapeSQL(mod.id)},
  ${escapeSQL(step.title)},
  ${escapeSQL(step.shortDescription)},
  ${escapeSQL(step.conceptExplanation)},
  ${escapeSQL(step.instructions)},
  ${escapeArray(step.headers)},
  ${escapeJSON(step.dummyData)},
  ${escapeArray(step.validFormulas)},
  ${escapeSQL(step.expectedResult)},
  ${escapeJSON(step.resultCell)},
  ${escapeSQL(step.hint)},
  ${escapeJSON(step.tasks)},
  ${sortOrder}
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;\n\n`;
  });
});

const outputPath = path.resolve(__dirname, "../supabase/seed_curriculum.sql");
fs.writeFileSync(outputPath, sql);
console.log("SQL seed file generated successfully at " + outputPath);
