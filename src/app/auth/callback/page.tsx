"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("id");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify({ id: userId, name, email }));
      router.replace("/courses");
    } else {
      router.replace("/login?error=InvalidAuth");
    }
  }, [router]);

  return <p>Authenticating...</p>;
}
