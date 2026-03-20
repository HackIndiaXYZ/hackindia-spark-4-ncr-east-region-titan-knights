import './globals.css';
import { AuthProvider } from '@/components/ui/AuthProvider';

export const metadata = {
  title: 'AgriSmart — Smart Farming Decision Platform',
  description: 'AI-powered crop recommendations, real-time weather risk analysis, and parametric insurance for Indian farmers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider />
        {children}
      </body>
    </html>
  );
}
