export const metadata = {
  title: "Privacy Policy | KOT News AI",
  description: "Privacy policy for KOT News AI.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 20, 2026</p>

        <section className="space-y-4 text-gray-700">
          <p>
            KOT News AI respects your privacy. This policy describes what data we
            collect, how we use it, and the choices available to you.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account data (email, profile details) for admin access.</li>
            <li>Usage data from the dashboard to improve performance.</li>
            <li>RSS and social integration data needed to automate publishing.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900">How we use data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Operate and secure the admin dashboard.</li>
            <li>Generate AI-enhanced summaries and media.</li>
            <li>Post content to your connected social accounts.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900">Data sharing</h2>
          <p>
            We only share data with service providers required for hosting,
            analytics, or social posting (e.g., Supabase, OpenAI, Facebook).
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Your choices</h2>
          <p>
            You can request access, correction, or deletion of your data by
            contacting the administrator of this installation.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <p>
            For privacy questions, reach out at
            <span className="font-semibold"> privacy@kotnews.ai</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
