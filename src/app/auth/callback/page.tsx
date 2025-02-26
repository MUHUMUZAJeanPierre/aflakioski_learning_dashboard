"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function GoogleAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // First, attempt to get the token from the URL hash if present
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let token = hashParams.get("access_token");

        // If not in hash, check query parameters
        if (!token) {
          const queryParams = new URLSearchParams(window.location.search);
          token = queryParams.get("token");
        }

        // If still no token, try to get it from the backend
        if (!token) {
          const response = await axios.get(
            "https://course-back-2-00rq.onrender.com/auth/google/callback" + window.location.search
          );
          token = response.data.token;
        }

        if (!token) {
          console.error("No token received from any source");
          return;
        }

        // Store token in localStorage
        localStorage.setItem("authToken", token);
        console.log("Token stored:", token);

        // Fetch user details using the token
        const userResponse = await axios.get(
          "https://course-back-2-00rq.onrender.com/user",
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("User Data:", userResponse.data);

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);
        // Handle error appropriately
        router.push("/login?error=auth_failed");
      }
    };

    // Add a small delay to ensure all parameters are available
    setTimeout(fetchToken, 100);
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  );
}