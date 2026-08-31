"use client";
import { Icon } from "@iconify/react";

interface IconifyIconProps {
  icon?: string;
  className?: string;
  fallback?: string;
}

export default function IconifyIcon({ icon, className = "w-5 h-5", fallback = "mdi:lightbulb" }: IconifyIconProps) {
  const iconName = icon || fallback;

  return (
    <Icon
      icon={iconName}
      className={className}
      onError={() => {
        // Soft fail if icon name isn't found
      }}
    />
  );
}
