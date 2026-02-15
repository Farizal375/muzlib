import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="p-4">
        <SignUp />
      </div>
    </div>
  );
}