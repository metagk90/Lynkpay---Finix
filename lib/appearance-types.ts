export interface AppearanceConfig {
  layout: "classic" | "modern" | "clean"
  memberArea: boolean
  about: string
  textColor: string
  activeSocials: string[]
  selectedTemplate: string | null
  bgType: "flat" | "gradient-up" | "gradient-down"
  bgColor: string
  bgImage: string | null
  selectedFont: string
  buttonStyle: "fill" | "outline"
  buttonShape: "square" | "rounded" | "pill"
  blockColor: string
  btnTextColor: string
  softShadow: boolean
  profileImage: string | null
  bannerImage: string | null
}

export const DEFAULT_APPEARANCE: AppearanceConfig = {
  layout: "classic",
  memberArea: true,
  about: "",
  textColor: "#f4f4f5",
  activeSocials: [],
  selectedTemplate: null,
  bgType: "flat",
  bgColor: "#0a0a0a",
  bgImage: null,
  selectedFont: "Helvetica",
  buttonStyle: "fill",
  buttonShape: "rounded",
  blockColor: "#10b981",
  btnTextColor: "#000000",
  softShadow: false,
  profileImage: null,
  bannerImage: null,
}
