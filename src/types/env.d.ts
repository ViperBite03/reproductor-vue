/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_GOOGLE_CX: string
  // puedes añadir más si necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
