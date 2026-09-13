// TMP — Supabase-Konfiguration
// Trage hier die Werte aus deinem Supabase-Projekt ein:
// Project Settings → API → "Project URL" und "anon public" Key.
// Der anon-Key ist bewusst öffentlich sichtbar im Browser-Code —
// das ist bei Supabase so vorgesehen, die eigentliche Absicherung
// übernehmen die Row-Level-Security-Regeln aus supabase/setup/schema.sql.

const SUPABASE_URL = "https://DEIN-PROJEKT.supabase.co";
const SUPABASE_ANON_KEY = "DEIN-ANON-KEY";

const tmpSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Öffentliche URL für hochgeladene Bilder im Bucket "bilder"
function tmpBildUrl(pfad) {
  if (!pfad) return "";
  const { data } = tmpSupabase.storage.from("bilder").getPublicUrl(pfad);
  return data.publicUrl;
}
