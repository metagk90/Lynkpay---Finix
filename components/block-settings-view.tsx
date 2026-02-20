"use client"

import type { Block } from "./block-item"
import { ProductSettings } from "./product-settings"
import { ImageSettings } from "./block-settings/image-settings"
import { TextSettings } from "./block-settings/text-settings"
import { LinkSettings } from "./block-settings/link-settings"
import { VideoSettings } from "./block-settings/video-settings"
import { SocialSettings } from "./block-settings/social-settings"
import { BlogSettings } from "./block-settings/blog-settings"
import { GenericMonetizationSettings } from "./block-settings/generic-monetization-settings"

interface BlockSettingsViewProps {
  block: Block
  onClose: () => void
  onUpdate: (block: Block) => void
}

export function BlockSettingsView({ block, onClose, onUpdate }: BlockSettingsViewProps) {
  const props = { block, onClose, onUpdate }

  switch (block.type) {
    case "Product":
      return <ProductSettings {...props} />
    case "Image":
      return <ImageSettings {...props} />
    case "Text":
      return <TextSettings {...props} />
    case "Link":
      return <LinkSettings {...props} />
    case "Video":
      return <VideoSettings {...props} />
    case "Social":
      return <SocialSettings {...props} />
    case "Blog":
      return <BlogSettings {...props} />
    case "Appointment":
    case "Course":
    case "Event":
    case "Supports":
    case "Affiliate":
    case "Contact":
    case "Physical":
      return <GenericMonetizationSettings {...props} />
    default:
      return <GenericMonetizationSettings {...props} />
  }
}
