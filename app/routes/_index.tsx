import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { auth } from "~/lib/auth";
import { Session } from "~/lib/auth-types";
import { Button } from "~/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Cake" },
    { name: "description", content: "Welcome to Cake!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export default function Index() {
  const session = useLoaderData<Session | null>();
  return (
    <div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
      <main className="flex flex-col gap-4 row-start-2 items-center justify-center">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-4xl text-black dark:text-white text-center">
            Cake
          </h3>
        </div>
        <Link to={session ? "/dashboard" : "/sign-in"}>
          <Button className="rounded-none" size="lg">
            {session ? "Dashboard" : "Sign In"}
          </Button>
        </Link>
      </main>
    </div>
  );
}
