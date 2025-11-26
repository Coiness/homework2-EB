import React from "react";
import CartPageClient from "@/components/CartPage/CartPage.client";

export default function Page() {
  // Server page simply mounts the client cart — cart reads from localStorage on the client
  return (
    <div className="p-6">
      <CartPageClient />
    </div>
  );
}
