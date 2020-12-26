import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth } from "utils/nhost";

export default function Login() {
  const [displayName, setdisplayName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await auth.register(email, password, {
        display_name: displayName,
      });
    } catch (error) {
      console.error(error);
      return alert("login failed");
    }

    await auth.login(email, password);
    router.push("/");
  }

  return (
    <div>
      <div>Register</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setdisplayName(e.target.value)}
              placeholder="Name"
              autoFocus
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
      <div>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
    </div>
  );
}
