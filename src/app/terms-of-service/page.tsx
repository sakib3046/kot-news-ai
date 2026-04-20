export const metadata = {
  title: "Terms of Service | KOT News AI",
  description: "Terms of Service for KOT News AI.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 20, 2026</p>

        <section className="space-y-4 text-gray-700">
          <p>
            These Terms of Service govern your use of KOT News AI. By accessing
            the service, you agree to these terms.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Use of the service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Only authorized administrators may access the dashboard.</li>
            <li>You are responsible for the content you publish.</li>
            <li>You must comply with platform policies (e.g., Facebook).</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900">Content and ownership</h2>
          <p>
            You retain ownership of your content. KOT News AI processes it to
            generate summaries and media for publication.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
          <p>
            The service is provided as-is. We may update or discontinue features
            at any time.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Liability</h2>
          <p>
            To the maximum extent permitted by law, KOT News AI is not liable for
            indirect or consequential damages arising from use of the service.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <p>
            For questions about these terms, contact
            <span className="font-semibold"> legal@kotnews.ai</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
