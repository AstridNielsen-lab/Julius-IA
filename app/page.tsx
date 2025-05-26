import { AppLayout } from '@/components/app-layout';
import { Footer } from '@/components/footer';

export default async function Home() {
  try {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1">
          <AppLayout />
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Error rendering Home page:', error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="mt-2 text-gray-600">Please try refreshing the page</p>
        </div>
      </main>
    );
  }
}