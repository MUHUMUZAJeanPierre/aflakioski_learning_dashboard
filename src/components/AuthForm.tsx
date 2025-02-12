import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ type }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted: ", formData);
    router.push("/dashboard"); // Redirect after login/signup
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold">{type === "login" ? "Login" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 my-2 w-full"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 my-2 w-full"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        {type === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
