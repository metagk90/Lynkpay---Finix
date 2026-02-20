"use client"

import { useState } from "react"
import {
  Home,
  Link as LinkIcon,
  Palette,
  BarChart3,
  ShoppingCart,
  CreditCard,
  ArrowLeftRight,
  AlertTriangle,
  FileBarChart,
  ShieldCheck,
  GraduationCap,
  Settings,
  Users,
  Mail,
  MessageSquare,
  Zap,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react"
import { SidebarItem } from "@/components/sidebar-item"
import { SidebarDropdown } from "@/components/sidebar-dropdown"
import { HomeView } from "@/components/home-view"
import { MyLynkView } from "@/components/my-lynk-view"
import { OrdersView } from "@/components/orders-view"
import { StatisticsView } from "@/components/statistics-view"
import { AppearanceView } from "@/components/appearance-view"
import { TransactionsView } from "@/components/payments/transactions-view"
import { DisputesView } from "@/components/payments/disputes-view"
import { ReportsView } from "@/components/payments/reports-view"
import { VerificationView } from "@/components/payments/verification-view"
import { PhonePreview } from "@/components/phone-preview"
import type { Block } from "@/components/block-item"
import type { AppearanceConfig } from "@/lib/appearance-types"
import { DEFAULT_APPEARANCE } from "@/lib/appearance-types"

const chartData = [
  { name: "08 Feb", views: 8, clicks: 3 },
  { name: "09 Feb", views: 15, clicks: 8 },
  { name: "10 Feb", views: 30, clicks: 18 },
  { name: "11 Feb", views: 85, clicks: 45 },
  { name: "12 Feb", views: 32, clicks: 19 },
  { name: "13 Feb", views: 18, clicks: 10 },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState("Home")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [userCountry] = useState<"US" | "CA">("US")
  const userCurrency = userCountry === "CA" ? "CAD" : "USD"
  const currencySymbol = "$"

  const [appearance, setAppearance] = useState<AppearanceConfig>(DEFAULT_APPEARANCE)

  const handleAppearanceChange = (update: Partial<AppearanceConfig>) => {
    setAppearance((prev) => ({ ...prev, ...update }))
  }

  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      title: "Viral VFX Pro",
      type: "Product",
      active: true,
      price: "9.99",
      image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400",
      description: "Professional VFX presets to make your videos go viral.",
      layout: "standard",
    },
    {
      id: 2,
      title: "Follow Me",
      type: "Social Connect",
      active: true,
      socials: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "TikTok", url: "https://tiktok.com" },
        { platform: "YouTube", url: "https://youtube.com" },
        { platform: "Twitter", url: "https://twitter.com" },
      ],
    },
    {
      id: 3,
      title: "My Portfolio",
      type: "Link",
      active: true,
      url: "https://myportfolio.com",
      description: "Check out my latest work",
      thumbnailStyle: "none",
      layout: "standard",
    },
    {
      id: 4,
      title: "Behind the Scenes",
      type: "Video",
      active: true,
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      description: "See how I create my VFX",
      layout: "standard",
    },
    {
      id: 5,
      title: "Support My Work",
      type: "Supports",
      active: true,
      description: "If you enjoy my content, buy me a coffee!",
      price: "5.00",
    },
  ])

  const handleAddBlock = (type: string) => {
    const defaults: Record<string, Partial<Block>> = {
      Product: {
        title: "New Digital Product",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "A premium digital product for your audience.",
        layout: "standard",
      },
      "Digital Product": {
        title: "New Digital Product",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "A premium digital product for your audience.",
        layout: "standard",
      },
      Image: {
        title: "Image Block",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
        description: "",
        layout: "standard",
      },
      Text: {
        title: "Text Block",
        content: "Share your thoughts, updates, or important info with your audience.",
        headingType: "Paragraph",
      },
      Link: {
        title: "My Website",
        url: "https://example.com",
        description: "",
        image: null,
        thumbnailStyle: "none",
        layout: "standard",
      },
      Video: {
        title: "Watch This",
        videoUrl: "",
        description: "Check out my latest video!",
        layout: "standard",
      },
      Social: {
        title: "Follow Me",
        socials: [
          { platform: "Instagram", url: "" },
          { platform: "TikTok", url: "" },
          { platform: "YouTube", url: "" },
        ],
        layout: "standard",
      },
      "Social Connect": {
        title: "Follow Me",
        socials: [
          { platform: "Instagram", url: "" },
          { platform: "TikTok", url: "" },
          { platform: "YouTube", url: "" },
        ],
        layout: "standard",
      },
      Blog: {
        title: "New Blog Post",
        content: "Write your blog post content here...",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600",
        description: "A quick summary of what this post is about.",
      },
      Appointment: {
        title: "Book a Session",
        price: "0.00",
        description: "30 min consultation",
      },
      Course: {
        title: "My Course",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
        description: "Learn everything you need to know.",
      },
      "Course Video": {
        title: "My Course",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
        description: "Learn everything you need to know.",
      },
      Event: {
        title: "Upcoming Event",
        description: "Join me for this live event!",
        price: "0.00",
      },
      Supports: {
        title: "Support My Work",
        description: "If you enjoy my content, buy me a coffee!",
        price: "5.00",
      },
      Contact: {
        title: "Get in Touch",
        description: "Send me a message or inquiry.",
      },
      "Email & Phone Number": {
        title: "Get in Touch",
        description: "Send me a message or inquiry.",
      },
      Affiliate: {
        title: "Recommended Product",
        url: "https://example.com/product",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
        description: "Check out this product I love!",
      },
      "Affiliate Products": {
        title: "Recommended Product",
        url: "https://example.com/product",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
        description: "Check out this product I love!",
      },
      Physical: {
        title: "Merch Item",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Premium physical product, shipped to your door.",
      },
      "Physical Product": {
        title: "Merch Item",
        price: "0.00",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Premium physical product, shipped to your door.",
      },
    }

    const typeDefaults = defaults[type] || {}
    const newBlock: Block = {
      id: Date.now(),
      title: typeDefaults.title || "New Block",
      type: type,
      active: true,
      price: typeDefaults.price ?? null,
      image: typeDefaults.image ?? null,
      description: typeDefaults.description ?? null,
      url: typeDefaults.url ?? null,
      videoUrl: typeDefaults.videoUrl ?? null,
      content: typeDefaults.content ?? null,
      headingType: typeDefaults.headingType ?? null,
      socials: typeDefaults.socials ?? null,
      thumbnailStyle: typeDefaults.thumbnailStyle ?? null,
      layout: typeDefaults.layout ?? null,
    }
    setBlocks([newBlock, ...blocks])
  }

  const handleToggleBlock = (id: number) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, active: !b.active } : b)))
  }

  const handleDeleteBlock = (id: number) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  const handleUpdateBlock = (updated: Block) => {
    setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)))
  }

  const handleReorderBlocks = (reordered: Block[]) => {
    setBlocks(reordered)
  }

  const handleDuplicateBlock = (id: number) => {
    const original = blocks.find((b) => b.id === id)
    if (!original) return
    const idx = blocks.findIndex((b) => b.id === id)
    const duplicate: Block = { ...original, id: Date.now(), title: `${original.title} (copy)` }
    const updated = [...blocks]
    updated.splice(idx + 1, 0, duplicate)
    setBlocks(updated)
  }

  const toggleTab = (tab: string) => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-black font-sans text-zinc-100 selection:bg-emerald-500/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#050505] border-r border-zinc-900/50 p-6 flex flex-col gap-10 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-1 text-emerald-500 text-3xl font-black italic tracking-tighter">
            LYNK<span className="text-white font-light not-italic tracking-normal">PAY</span>
          </div>
          <button className="lg:hidden p-2 text-zinc-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-4">Menu</p>
          <SidebarItem icon={Home} label="Home" active={activeTab === "Home"} onClick={() => toggleTab("Home")} />
          <SidebarItem
            icon={LinkIcon}
            label="My Lynk"
            active={activeTab === "My Lynk"}
            onClick={() => toggleTab("My Lynk")}
          />
          <SidebarItem icon={Palette} label="Appearance" active={activeTab === "Appearance"} onClick={() => toggleTab("Appearance")} />
          <SidebarItem icon={BarChart3} label="Statistics" active={activeTab === "Statistics"} onClick={() => toggleTab("Statistics")} />
          <SidebarItem icon={ShoppingCart} label="Orders" badge={0} active={activeTab === "Orders"} onClick={() => toggleTab("Orders")} />
          <SidebarDropdown
            icon={CreditCard}
            label="Payments"
            activeTab={activeTab}
            onSelect={toggleTab}
            children={[
              { icon: ArrowLeftRight, label: "Transactions" },
              { icon: AlertTriangle, label: "Disputes" },
              { icon: FileBarChart, label: "Reports" },
              { icon: ShieldCheck, label: "Verification", warning: true },
            ]}
          />
          <SidebarItem icon={GraduationCap} label="Tutorials" />
          <SidebarItem icon={Settings} label="Settings" />

          <p className="px-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest mt-8 mb-4">
            Marketing Tools
          </p>
          <SidebarItem icon={Users} label="Affiliates" comingSoon />
          <SidebarItem icon={Mail} label="E-Mail Marketing" comingSoon />
          <SidebarItem icon={MessageSquare} label="WhatsApp Blast" comingSoon />
          <SidebarItem icon={Zap} label="Automate Workflow" comingSoon />
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-900/50">
          <SidebarItem icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 h-screen overflow-y-auto relative p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 bg-zinc-900 rounded-xl border border-zinc-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">{activeTab}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <button className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 relative shadow-2xl">
              <Bell size={20} className="text-zinc-500" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
            </button>
            <div className="hidden sm:flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Habib"
                className="w-9 h-9 rounded-xl"
                alt="user avatar"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </header>

        {activeTab === "Home" ? (
          <HomeView chartData={chartData} currency={userCurrency} currencySymbol={currencySymbol} />
        ) : activeTab === "Appearance" ? (
          <AppearanceView blocks={blocks} appearance={appearance} onChange={handleAppearanceChange} />
        ) : activeTab === "Statistics" ? (
          <StatisticsView currency={userCurrency} currencySymbol={currencySymbol} />
        ) : activeTab === "Orders" ? (
          <OrdersView />
        ) : activeTab === "Transactions" ? (
          <TransactionsView currency={userCurrency} currencySymbol={currencySymbol} />
        ) : activeTab === "Disputes" ? (
          <DisputesView currency={userCurrency} currencySymbol={currencySymbol} />
        ) : activeTab === "Reports" ? (
          <ReportsView currency={userCurrency} currencySymbol={currencySymbol} />
        ) : activeTab === "Verification" ? (
          <VerificationView />
        ) : (
          <MyLynkView
            onShowPreview={() => setIsPreviewOpen(true)}
            blocks={blocks}
            onAddBlock={handleAddBlock}
            onToggleBlock={handleToggleBlock}
            onDeleteBlock={handleDeleteBlock}
            onUpdateBlock={handleUpdateBlock}
            onReorderBlocks={handleReorderBlocks}
            onDuplicateBlock={handleDuplicateBlock}
            appearance={appearance}
            currency={userCurrency}
          />
        )}
      </main>

      {/* Mobile Preview Modal */}
      {isPreviewOpen && <PhonePreview isModal={true} onClose={() => setIsPreviewOpen(false)} blocks={blocks} appearance={appearance} currency={userCurrency} />}
    </div>
  )
}
