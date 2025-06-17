import Image from "next/image";
import { BackgroundBeams } from "~/components/background-beams";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex-1">
        <div className="flex min-h-screen w-full">
          <div className="relative hidden flex-col border-r bg-muted p-10 lg:flex lg:w-1/2">
            <div className="absolute inset-0 h-full w-full">
              <BackgroundBeams />
            </div>
            <div className="z-10">
              <div className="flex items-center gap-2">
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <h1 className="text-2xl font-bold animate-in-out-in duration-1000">
                  Boot Next.js
                </h1>
              </div>
              <p className="mt-2 text-muted-foreground max-w-md">
                Modern, high-performance web application template
              </p>
            </div>
            <div className="flex-1" />
            <div className="z-10 mb-6 space-y-2">
              <h2 className="text-xl font-semibold">Fast Development, Exceptional Experience</h2>
              <p className="text-muted-foreground">
                Start your next project with best practices and modern tooling to build amazing user experiences.
              </p>
            </div>
          </div>

          <div className="w-full bg-background p-6 lg:w-1/2 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
