import { createClient } from '@supabase/supabase-js'

// A missing env var must degrade the enquiry form, never blank the whole site
// (createClient throws on an invalid URL at module load, before React mounts).
const rawUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseUrl = /^https?:\/\//i.test(rawUrl || '') ? rawUrl : 'https://missing-env.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'missing-env'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
