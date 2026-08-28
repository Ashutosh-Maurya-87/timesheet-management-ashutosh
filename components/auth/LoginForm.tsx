"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f5f5f5] p-3">
            <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden bg-white md:grid-cols-2">

                {/* Left Side */}
                <section className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-[408px]">

                        <h1 className="mb-8 text-xl font-semibold text-[#252b36]">
                            Welcome back
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-sm text-[#3b4350]">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    className="h-10 w-full rounded-lg border border-[#d9dee7] px-3 text-sm outline-none focus:border-[#315dbc]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm text-[#3b4350]"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="h-10 w-full rounded-lg border border-[#d9dee7] px-3 pr-11 text-sm outline-none transition focus:border-[#315dbc]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697386] transition hover:text-[#315dbc]"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-[#697386]">
                                <input type="checkbox" />
                                Remember me
                            </label>

                            {error && (
                                <p className="text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-10 w-full rounded-md bg-[#315dbc] text-sm text-white transition hover:bg-[#254fa8] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Right Side */}
                <section className="hidden items-center bg-[#315dbc] px-12 text-white md:flex">
                    <div className="max-w-117.5">
                        <h2 className="mb-4 text-3xl font-semibold">
                            ticktock
                        </h2>

                        <p className="text-sm leading-6 text-blue-100">
                            Introducing ticktock, our cutting-edge timesheet
                            web application designed to revolutionize how you
                            manage employee work hours. With ticktock, you can
                            effortlessly track and monitor employee attendance
                            and productivity from anywhere, anytime, using any
                            internet-connected device.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}