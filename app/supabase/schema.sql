-- Run in Supabase SQL Editor.
-- Provider credentials are configured in Supabase Auth, never in this file or the browser.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username is null or username ~ '^[a-z0-9_]{3,30}$'),
  display_name text,
  bio text check (bio is null or char_length(bio) <= 500),
  avatar_url text,
  role text check (role in ('builder', 'mentor', 'collaborator', 'supporter', 'explorer')),
  verification_status text not null default 'required' check (verification_status in ('required', 'pending', 'verified', 'rejected')),
  verification_provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.create_profile_for_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_user();

-- Project data is private to its owner by default. Add collaboration policies
-- only after a membership/permission model has been implemented.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text check (char_length(description) <= 10000),
  visibility text not null default 'private' check (visibility in ('private', 'shared', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Owners can read their projects"
  on public.projects for select
  using (auth.uid() = owner_id);

create policy "Owners can create projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their projects"
  on public.projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- Private project uploads. Create this bucket in Storage if it does not exist.
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do update set public = false;

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do update set public = true;

create policy "Users can update their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Users can replace their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Users can read files in their own folder"
  on storage.objects for select to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Users can upload files to their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Users can update files in their own folder"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Users can delete files in their own folder"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid()::text));

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  intent text not null check (intent in ('INTRODUCE', 'BUILD', 'HELP', 'OFFER', 'SUPPORT')),
  space text not null,
  body text not null check (char_length(body) between 1 and 600),
  visibility text not null default 'public' check (visibility in ('private', 'shared', 'public')),
  created_at timestamptz not null default now()
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.post_reactions (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null default 'support' check (reaction in ('support', 'helpful', 'inspiring')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, reaction)
);

alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;

create policy "Anyone can read public posts"
  on public.posts for select to authenticated
  using (visibility = 'public' or auth.uid() = author_id);
create policy "Users can create their own posts"
  on public.posts for insert to authenticated
  with check (auth.uid() = author_id);
create policy "Authors can update their posts"
  on public.posts for update to authenticated
  using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Authors can delete their posts"
  on public.posts for delete to authenticated
  using (auth.uid() = author_id);

create policy "Authenticated users can read comments"
  on public.post_comments for select to authenticated using (true);
create policy "Users can create their own comments"
  on public.post_comments for insert to authenticated with check (auth.uid() = author_id);
create policy "Authors can delete their comments"
  on public.post_comments for delete to authenticated using (auth.uid() = author_id);

create policy "Authenticated users can read reactions"
  on public.post_reactions for select to authenticated using (true);
create policy "Users can create their own reactions"
  on public.post_reactions for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can remove their own reactions"
  on public.post_reactions for delete to authenticated using (auth.uid() = user_id);

-- Product expansion tables. These are additive and keep provider credentials,
-- payment secrets, and identity documents outside the browser and database.
create table if not exists public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('builder', 'creator', 'mentor', 'collaborator', 'supporter')),
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create table if not exists public.user_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  country_code text,
  currency_code text,
  timezone text,
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  goals text[] not null default '{}',
  personalization_enabled boolean not null default true,
  marketing_notifications boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete set null,
  source_type text not null check (source_type in ('youtube', 'article', 'website', 'pdf', 'book', 'course', 'can')),
  original_url text not null,
  title text not null,
  publisher text,
  description text,
  category text,
  subcategory text,
  skills text[] not null default '{}',
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  language text,
  published_at timestamptz,
  relevance_score numeric(5,4) check (relevance_score is null or relevance_score between 0 and 1),
  source_attribution text,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  resource_id uuid primary key references public.resources(id) on delete cascade,
  youtube_video_id text unique not null,
  channel_name text,
  thumbnail_url text,
  educational_summary text,
  quality_metadata jsonb not null default '{}'
);

create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  goal text not null,
  source text not null default 'can' check (source in ('can', 'ai', 'user')),
  status text not null default 'active' check (status in ('draft', 'active', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.learning_path_steps (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.learning_paths(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  practical_task text,
  resource_ids uuid[] not null default '{}',
  completed_at timestamptz,
  unique (path_id, position)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  category text,
  price_minor integer not null default 0 check (price_minor >= 0),
  currency_code text not null default 'EUR',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  description text,
  resource_ids uuid[] not null default '{}',
  unique (course_id, position)
);

create table if not exists public.enrollments (
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  progress numeric(5,4) not null default 0 check (progress between 0 and 1),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (course_id, user_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null check (event_type in ('seminar', 'workshop', 'masterclass', 'webinar', 'networking', 'session')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null,
  delivery text not null check (delivery in ('online', 'in_person', 'hybrid')),
  location text,
  meeting_url text,
  capacity integer check (capacity is null or capacity > 0),
  price_minor integer not null default 0 check (price_minor >= 0),
  currency_code text not null default 'EUR',
  cancellation_policy text,
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'registered' check (status in ('registered', 'cancelled', 'attended')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.mentor_offerings (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  topics text[] not null default '{}',
  availability text,
  price_minor integer not null default 0 check (price_minor >= 0),
  currency_code text not null default 'EUR',
  published boolean not null default false
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  price_minor integer not null check (price_minor >= 0),
  currency_code text not null default 'EUR',
  availability text,
  published boolean not null default false
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid references auth.users(id) on delete set null,
  title text not null,
  organization text,
  opportunity_type text not null,
  description text,
  country_codes text[] not null default '{}',
  eligibility text,
  requirements text,
  deadline timestamptz,
  source_url text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('post', 'project', 'resource', 'course', 'event', 'opportunity', 'person', 'service')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id) on delete set null,
  provider_id uuid references auth.users(id) on delete set null,
  item_type text not null,
  item_id uuid,
  provider_transaction_id text unique,
  item_amount_minor integer not null check (item_amount_minor >= 0),
  platform_fee_minor integer not null check (platform_fee_minor >= 0),
  provider_amount_minor integer not null check (provider_amount_minor >= 0),
  currency_code text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level text not null check (level in ('identity', 'project', 'business', 'financial')),
  provider text,
  provider_reference text,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile_roles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.resources enable row level security;
alter table public.videos enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_steps enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.mentor_offerings enable row level security;
alter table public.services enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_items enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.transactions enable row level security;
alter table public.verification_requests enable row level security;

create policy "Users manage their roles" on public.profile_roles for all to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "Users manage their preferences" on public.user_preferences for all to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "Approved resources are public" on public.resources for select to authenticated using (approval_status = 'approved' or auth.uid() = creator_id);
create policy "Creators manage resources" on public.resources for all to authenticated using (auth.uid() = creator_id) with check (auth.uid() = creator_id);
create policy "Approved videos are public" on public.videos for select to authenticated using (exists (select 1 from public.resources r where r.id = resource_id and (r.approval_status = 'approved' or r.creator_id = auth.uid())));
create policy "Path owners manage paths" on public.learning_paths for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Path owners manage steps" on public.learning_path_steps for all to authenticated using (exists (select 1 from public.learning_paths p where p.id = path_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.learning_paths p where p.id = path_id and p.owner_id = auth.uid()));
create policy "Published courses are public" on public.courses for select to authenticated using (published or creator_id = auth.uid());
create policy "Course creators manage courses" on public.courses for all to authenticated using (creator_id = auth.uid()) with check (creator_id = auth.uid());
create policy "Course lessons follow course access" on public.lessons for select to authenticated using (exists (select 1 from public.courses c where c.id = course_id and (c.published or c.creator_id = auth.uid())));
create policy "Course creators manage lessons" on public.lessons for all to authenticated using (exists (select 1 from public.courses c where c.id = course_id and c.creator_id = auth.uid())) with check (exists (select 1 from public.courses c where c.id = course_id and c.creator_id = auth.uid()));
create policy "Users manage enrollments" on public.enrollments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Published events are public" on public.events for select to authenticated using (host_id = auth.uid() or starts_at > now());
create policy "Hosts manage events" on public.events for all to authenticated using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "Users manage event registrations" on public.event_registrations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Published offerings are public" on public.mentor_offerings for select to authenticated using (published or mentor_id = auth.uid());
create policy "Mentors manage offerings" on public.mentor_offerings for all to authenticated using (mentor_id = auth.uid()) with check (mentor_id = auth.uid());
create policy "Published services are public" on public.services for select to authenticated using (published or provider_id = auth.uid());
create policy "Providers manage services" on public.services for all to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
create policy "Opportunities are public" on public.opportunities for select to authenticated using (true);
create policy "Publishers manage opportunities" on public.opportunities for all to authenticated using (publisher_id = auth.uid()) with check (publisher_id = auth.uid());
create policy "Users manage saved items" on public.saved_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Conversation members read memberships" on public.conversation_members for select to authenticated using (auth.uid() = user_id);
create policy "Conversation members read messages" on public.messages for select to authenticated using (exists (select 1 from public.conversation_members m where m.conversation_id = conversation_id and m.user_id = auth.uid()));
create policy "Members send messages" on public.messages for insert to authenticated with check (auth.uid() = sender_id and exists (select 1 from public.conversation_members m where m.conversation_id = conversation_id and m.user_id = auth.uid()));
create policy "Users read their notifications" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "Users mark notifications read" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read their transactions" on public.transactions for select to authenticated using (auth.uid() = buyer_id or auth.uid() = provider_id);
create policy "Users read their verification" on public.verification_requests for select to authenticated using (auth.uid() = user_id);
create policy "Users create verification requests" on public.verification_requests for insert to authenticated with check (auth.uid() = user_id);

create index if not exists resources_category_idx on public.resources(category, approval_status);
create index if not exists opportunities_deadline_idx on public.opportunities(deadline);
create index if not exists events_starts_at_idx on public.events(starts_at);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.connections (
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

alter table public.follows enable row level security;
alter table public.connections enable row level security;

create policy "Users read their follows" on public.follows for select to authenticated using (auth.uid() = follower_id or auth.uid() = following_id);
create policy "Users create their follows" on public.follows for insert to authenticated with check (auth.uid() = follower_id);
create policy "Users remove their follows" on public.follows for delete to authenticated using (auth.uid() = follower_id);
create policy "Connection participants read connections" on public.connections for select to authenticated using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "Users request connections" on public.connections for insert to authenticated with check (auth.uid() = requester_id);
create policy "Recipients update connection status" on public.connections for update to authenticated using (auth.uid() = recipient_id or auth.uid() = requester_id) with check (auth.uid() = recipient_id or auth.uid() = requester_id);

-- Public profile fields are intentionally separated from private verification metadata.
create or replace view public.public_profiles as
  select id, username, display_name, bio, avatar_url, role, created_at
  from public.profiles;
grant select on public.public_profiles to authenticated;

create or replace function public.list_public_profiles(search_term text default null)
returns table (id uuid, username text, display_name text, bio text, avatar_url text, role text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username, p.display_name, p.bio, p.avatar_url, p.role, p.created_at
  from public.profiles p
  where p.id <> auth.uid()
    and (search_term is null or search_term = '' or p.display_name ilike '%' || search_term || '%' or p.username ilike '%' || search_term || '%' or p.bio ilike '%' || search_term || '%')
  order by p.created_at desc
  limit 50;
$$;
revoke all on function public.list_public_profiles(text) from public;
grant execute on function public.list_public_profiles(text) to authenticated;

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'collaborator' check (member_role in ('owner', 'collaborator', 'mentor')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 1 check (position > 0),
  completed_at timestamptz
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.project_milestones(id) on delete set null,
  assignee_id uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  due_at timestamptz
);

create table if not exists public.creator_offerings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  offering_type text not null check (offering_type in ('course', 'event', 'mentorship', 'service', 'resource')),
  offering_id uuid not null,
  created_at timestamptz not null default now(),
  unique (creator_id, offering_type, offering_id)
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  provider_payout_id text unique,
  amount_minor integer not null check (amount_minor >= 0),
  currency_code text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (key, value)
values ('platform_fee_percentage', '0.08')
on conflict (key) do nothing;

alter table public.project_members enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_tasks enable row level security;
alter table public.creator_offerings enable row level security;
alter table public.payouts enable row level security;
alter table public.platform_settings enable row level security;

create policy "Project members can read memberships" on public.project_members for select to authenticated using (auth.uid() = user_id or exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Project owners manage memberships" on public.project_members for all to authenticated using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Project members read milestones" on public.project_milestones for select to authenticated using (exists (select 1 from public.project_members m where m.project_id = project_id and m.user_id = auth.uid()));
create policy "Project owners manage milestones" on public.project_milestones for all to authenticated using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Project members read tasks" on public.project_tasks for select to authenticated using (assignee_id = auth.uid() or exists (select 1 from public.project_members m where m.project_id = project_id and m.user_id = auth.uid()));
create policy "Project owners manage tasks" on public.project_tasks for all to authenticated using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Creators manage offerings" on public.creator_offerings for all to authenticated using (auth.uid() = creator_id) with check (auth.uid() = creator_id);
create policy "Providers read their payouts" on public.payouts for select to authenticated using (auth.uid() = provider_id);
create policy "Platform fee is not public" on public.platform_settings for select to authenticated using (false);
