# C.A.N. security baseline

## Data boundary

- The browser uses only the Supabase publishable/anon key. Never expose a service-role key.
- Project records must be accessed through Supabase Row Level Security.
- Project files belong in the private `project-files` bucket, in a folder named with the authenticated user's UUID.
- Identity documents must not be stored in project storage. Send them directly to a compliant identity-verification provider through a server-side integration.
- Do not log passwords, OAuth tokens, identity documents, or financial information.

## Firewall and abuse protection

A frontend cannot create a network firewall. Before production, place the app behind a managed edge firewall/WAF such as Cloudflare, Vercel Firewall, or the hosting provider's equivalent. Configure:

- TLS-only traffic and HSTS
- WAF managed rules and bot protection
- Rate limits on auth, uploads, posts, help requests, and AI endpoints
- Maximum upload size and MIME/type validation on the server
- CORS restricted to the production origin
- CSP and security headers
- Alerting for repeated auth failures and unusual upload activity
- Daily database backups and tested restore procedures

Supabase RLS is the database access boundary; a WAF is the network boundary. Both are required for a production launch.
