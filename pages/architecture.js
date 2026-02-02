import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function getStaticProps() {
  const docPath = path.join(process.cwd(), 'docs', 'target-platform-architecture.md');
  const markdown = fs.readFileSync(docPath, 'utf8');

  return {
    props: {
      markdown,
    },
  };
}

export default function ArchitecturePage({ markdown }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Целевая архитектура платформы</h1>
            <p className="mt-2 text-sm text-white/70">
              Источник: <code className="rounded bg-white/10 px-2 py-1">docs/target-platform-architecture.md</code>
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
          >
            На главную
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6">
          <article className="prose prose-invert max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}

