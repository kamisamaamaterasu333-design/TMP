// TMP — Supabase-Konfiguration
// Trage hier die Werte aus deinem Supabase-Projekt ein:
// Project Settings → API → "Project URL" und "anon public" Key.
// Der anon-Key ist bewusst öffentlich sichtbar im Browser-Code —
// das ist bei Supabase so vorgesehen, die eigentliche Absicherung
// übernehmen die Row-Level-Security-Regeln aus supabase/setup/schema.sql.

const SUPABASE_URL = https://fmkuidmshlqgumcamoqk.supabase.co/rest/v1/;
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta3VpZG1zaGxxZ3VtY2Ftb3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTQyMTgsImV4cCI6MjEwNDg5MDIxOH0.rzG1jdBOEdk1J-KPR8k-BvDjBXUTO0Ani3qCL4fIrIA;

const tmpSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Öffentliche URL für hochgeladene Bilder im Bucket "bilder"
function tmpBildUrl(pfad) {
  if (!pfad) return "";
  const { data } = tmpSupabase.storage.from("bilder").getPublicUrl(pfad);
  return data.publicUrl;
}
