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
  // Card Style
  cardStyle: "flat" | "glass" | "elevated" | "bordered"
  cardRadius: "none" | "sm" | "md" | "lg" | "full"
  cardBorderEnabled: boolean
  cardBorderWidth: number
  cardBorderColor: string
  cardBorderOpacity: number
  cardShadow: "none" | "subtle" | "medium" | "bold"
  cardShadowColor: string
  cardOpacity: number
  // Profile Effects
  profileShape: "circle" | "rounded-square" | "hexagon"
  profileBorderEffect: "none" | "solid" | "gradient-spin" | "glow-pulse"
  profileBorderColor1: string
  profileBorderColor2: string
  profileBorderWidth: number
  profileBadge: "none" | "verified" | "star" | "crown"
  profileBadgeColor: string
  // Background Effects
  bgEffect: "none" | "animated-gradient" | "particles" | "noise"
  bgOverlay: "none" | "vignette" | "dark-fade" | "light-fade"
  bgGradientSpeed: "slow" | "medium" | "fast"
  // Block Hover
  blockHover: "none" | "lift" | "scale" | "glow" | "tilt"
  // Header Style
  headerTextEffect: "none" | "gradient" | "outline" | "glow" | "shadow"
  headerAlignment: "center" | "left"
  bannerOverlay: "none" | "gradient-fade" | "darken" | "blur"
  headerGradientColor1: string
  headerGradientColor2: string
  // Spacing & Sizing
  blockGap: "tight" | "normal" | "relaxed" | "loose"
  contentWidth: "narrow" | "standard" | "wide"
  blockPadding: "compact" | "normal" | "spacious"
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
  // Card Style
  cardStyle: "flat",
  cardRadius: "md",
  cardBorderEnabled: false,
  cardBorderWidth: 1,
  cardBorderColor: "#ffffff",
  cardBorderOpacity: 20,
  cardShadow: "none",
  cardShadowColor: "#000000",
  cardOpacity: 100,
  // Profile Effects
  profileShape: "circle",
  profileBorderEffect: "solid",
  profileBorderColor1: "#10b981",
  profileBorderColor2: "#06b6d4",
  profileBorderWidth: 2,
  profileBadge: "none",
  profileBadgeColor: "#3b82f6",
  // Background Effects
  bgEffect: "none",
  bgOverlay: "none",
  bgGradientSpeed: "medium",
  // Block Hover
  blockHover: "none",
  // Header Style
  headerTextEffect: "none",
  headerAlignment: "center",
  bannerOverlay: "none",
  headerGradientColor1: "#10b981",
  headerGradientColor2: "#06b6d4",
  // Spacing & Sizing
  blockGap: "normal",
  contentWidth: "standard",
  blockPadding: "normal",
}
