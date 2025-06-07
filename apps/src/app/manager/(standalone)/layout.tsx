export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div id="page-container" className="min-h-screen">
        {children}
      </div>
    </>
  );
}