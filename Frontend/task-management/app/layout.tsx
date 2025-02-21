import "./globals.css"; // ✅ Keep global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="w-full p-4 bg-blue-600 text-white text-center font-bold text-xl shadow-lg">
          Task Management App
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
