export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full bg-white rounded-xl shadow-lg">{children}</div>;
}
