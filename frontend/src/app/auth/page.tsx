import Image from "next/image";
import { Boxes, NotebookText, ReceiptText } from "lucide-react";
import LoginForm from "./components/LoginForm";

const features = [
  { icon: Boxes, text: "Real-time stock levels and low-stock alerts" },
  { icon: ReceiptText, text: "Fast point-of-sale transactions" },
  { icon: NotebookText, text: "Full audit logbook of every change" },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-36 -top-32 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(200,75,138,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-90 w-90 rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.18),transparent_70%)]" />

        <Image
          src="/logo/pharlogo.png"
          alt="PharMaMa"
          width={160}
          height={41}
          className="relative"
          priority
        />

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Inventory and sales,
            <br />
            <span className="text-pink-300">in one place.</span>
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-violet-100/75">
            Track stocks, record transactions and review the logbook for your
            pharmacy branch.
          </p>

          <ul className="mt-8 grid gap-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-violet-100/90">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-violet-300/60">© 2026 PharMaMa</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <LoginForm />
      </section>
    </main>
  );
}
