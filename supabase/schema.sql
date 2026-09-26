-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the ideas table
create table public.ideas (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text default '',
    type text not null default 'idea',
    status text not null default 'idea',
    is_archived boolean default false,
    converted_to_project_id uuid,
    mood text,
    priority text not null default 'medium',
    is_favorite boolean default false,
    tags text[] default '{}',
    checklist jsonb default '[]'::jsonb,
    problem_statement text,
    solution_statement text,
    voice_note_uri text,
    voice_note_duration integer,
    image_uri text,
    project_id uuid,
    resurfaced_count integer default 0,
    last_resurfaced_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.ideas enable row level security;

-- Create policy to allow all operations for now (since we don't have Auth hooked up yet)
create policy "Enable all access for now" on public.ideas
    for all
    using (true)
    with check (true);
