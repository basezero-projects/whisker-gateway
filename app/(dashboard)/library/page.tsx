export default function LibraryPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Library</h1>
      <p className="text-zinc-600">Your transcripts will appear here. Hit <code>POST /api/v1/transcribe</code> with your API key to start.</p>
    </div>
  );
}
