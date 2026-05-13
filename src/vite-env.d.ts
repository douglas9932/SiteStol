/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL:       string;
  readonly VITE_SUPABASE_KEY:       string;
  readonly VITE_EMAILJS_SERVICE:    string;
  readonly VITE_EMAILJS_TEMPLATE:   string;
  readonly VITE_EMAILJS_KEY:        string;
  readonly VITE_MODE:               string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}