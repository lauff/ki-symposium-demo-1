import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repair Café",
  description: "Community repair events connecting citizens with skilled volunteers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                🔧 Repair Café
              </Link>
              <div className="flex items-center gap-4">
                {session?.user ? (
                  <>
                    {role === "CITIZEN" && (
                      <Link href="/citizen/requests" className="text-gray-700 hover:text-green-700 font-medium">
                        My Requests
                      </Link>
                    )}
                    {role === "VOLUNTEER" && (
                      <>
                        <Link href="/volunteer/dashboard" className="text-gray-700 hover:text-green-700 font-medium">
                          Dashboard
                        </Link>
                        <Link href="/volunteer/requests" className="text-gray-700 hover:text-green-700 font-medium">
                          Requests
                        </Link>
                        <Link href="/volunteer/events" className="text-gray-700 hover:text-green-700 font-medium">
                          Events
                        </Link>
                      </>
                    )}
                    <span className="text-gray-500 text-sm">{session.user.name}</span>
                    <form
                      action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                      }}
                    >
                      <button
                        type="submit"
                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-700 hover:text-green-700 font-medium">
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
