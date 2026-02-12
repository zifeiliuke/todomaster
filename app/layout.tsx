import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TodoMaster - 待办事项管理",
  description: "简洁高效的待办事项管理应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
