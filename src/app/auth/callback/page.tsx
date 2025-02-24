"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function GoogleAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (!token) {
        console.error("No token received");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      try {
        // Fetch user details using the token
        const response = await axios.get(
          "https://course-back-2-00rq.onrender.com/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("User Data:", response.data);

        // Redirect to the dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchToken();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  );
}
