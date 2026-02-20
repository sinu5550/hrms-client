import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/20 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
