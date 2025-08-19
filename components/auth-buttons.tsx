"use client";
import { LoginModal, RegisterModal } from "@/components/auth-modals";

export function AuthButtons() {
  return (
    <div className="flex gap-4 mt-2">
      <LoginModal />
      <RegisterModal />
    </div>
  );
}
