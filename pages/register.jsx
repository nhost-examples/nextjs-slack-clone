import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth } from "utils/nhost";

export default function Login() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError(undefined);
    setLoading(true);

    try {
      await auth.register(email, password, {
        display_name: displayName,
      });
    } catch (error) {
      try {
        setError(error.response.data.message);
      } catch (error) {
        setError("unknown error");
      }
      return;
    } finally {
      setLoading(false);
    }

    await auth.login(email, password);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-screen-sm flex flex-col items-center pt-6">
      <div className="">
        <img
          src="https://nhost.io/images/nhost-logo.svg"
          style={{ width: "120px" }}
          className="py-6"
        />
      </div>
      <div className="text-3xl font-bold">Register to Nhost Slack Clone</div>
      <div className="py-3 text-gray-500">
        Continue with the email address and password to register an account.
      </div>
      <div style={{ width: "300px" }} className="pt-12">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Name"
              autoFocus
              className="border w-full rounded py-1 px-2"
            />
          </div>
          <div className="py-2">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border w-full rounded py-1 px-2"
            />
          </div>
          <div className="py-2">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full rounded py-1 px-2"
            />
          </div>
          <div className="py-2">
            <button
              className="py-1 w-full text-white bg-slack-base cursor"
              type="submit"
              disabled={loading}
            >
              {!loading ? <>Register</> : <>Registering account...</>}
            </button>
          </div>
        </form>
        {error && (
          <div className="my-4 border bg-red-700 text-white p-2 rounded text-sm ">
            {error}
          </div>
        )}
      </div>
      <div className="pt-6">
        <Link href="/login">
          <a className="text-gray-800 text-sm hover:underline">Login</a>
        </Link>
      </div>
    </div>
  );
}
