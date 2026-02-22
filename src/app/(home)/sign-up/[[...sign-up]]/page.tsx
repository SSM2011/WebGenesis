"use client"

import { SignUp } from '@clerk/nextjs'
import { useCurrentTheme } from '@/hooks/use-current-theme'
import { dark } from "@clerk/themes"

export default function Page() {
  const currentTheme = useCurrentTheme();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        appearance={{
          baseTheme: currentTheme === "dark" ? dark : undefined,
          elements: {
            cardBox: "border! shadow-none! rounded-lg"
          }
        }}
      />
    </div>
  )
}