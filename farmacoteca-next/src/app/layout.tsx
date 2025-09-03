export const metadata = {
  title: "Farmacoteca Digital",
  description: "Consulta de protocolos y drills (DEMO)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
