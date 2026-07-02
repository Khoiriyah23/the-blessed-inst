import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Users, DollarSign, GraduationCap, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase-external";
import logo from '@/assets/TBI full logo blue.png'

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin") {
      const { data } = await supabase.auth.getSession();
      throw redirect({ to: data.session ? "/admin/registrations" : "/admin/login" });
    }
  },
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthed(!!data.session);
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (checked && !authed && !isLogin) {
      navigate({ to: "/admin/login" });
    }
  }, [checked, authed, isLogin, navigate]);

  if (isLogin) return <Outlet />;
  if (!checked) return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!authed) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const navItems = [
    { to: "/admin/registrations", label: "Registrations", icon: Users },
    { to: "/admin/pricing", label: "Pricing", icon: DollarSign },
    { to: "/admin/courses", label: "Courses", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 bg-[#0f172a] text-white flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-2.5">
          <div className="flex items-center gap-3">
  <img src={logo} alt="The Blessed Institute" className="h-10 w-auto brightness-0 invert" />
</div>
          <div>
            <div className="text-xs text-white/60 leading-tight">· Admin</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((it) => {
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
