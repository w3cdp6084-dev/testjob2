import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <nav>
        {/* Navigation links go here */}
      </nav>
      <main>
        {children}
      </main>
      <aside>
        {/* Table of contents goes here */}
      </aside>
    </div>
  );
}
