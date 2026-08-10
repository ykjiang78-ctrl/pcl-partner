import Link from "next/link";
import type { McResource, ResourceLink } from "@/lib/mc-resources";
import { SOURCE_INFO, getCategoryLabel } from "@/lib/mc-resources";
import Reveal from "@/components/ui/Reveal";

export default function ResourceCard({
  resource,
  index = 0,
}: {
  resource: McResource;
  index?: number;
}) {
  return (
    <Reveal delay={Math.min(index, 6) * 50}>
      <div className="card card-hover shine p-5 h-full">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl shadow-glow">
            {resource.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {resource.name}
              </h3>
              {resource.featured && (
                <span className="badge-gradient">热门</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="chip bg-indigo-50 text-indigo-600 dark:text-indigo-300">
                {getCategoryLabel(resource.category)}
              </span>
              {resource.loader && resource.loader !== "—" && (
                <span className="chip bg-purple-50 text-purple-600 dark:text-purple-300">
                  {resource.loader}
                </span>
              )}
              <span className="chip bg-gray-100 text-gray-500">
                📌 {resource.versions}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3 line-clamp-2">
          {resource.desc}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {resource.links.map((link) => (
            <DownloadLink key={link.url + link.label} link={link} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function DownloadLink({ link }: { link: ResourceLink }) {
  const info = SOURCE_INFO[link.label];
  const isExternal = link.url.startsWith("http");
  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      title={link.note}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition dark:bg-[#181825] dark:border-[#313244] dark:text-gray-300"
    >
      {info?.icon ?? "🔗"}
      <span>去 {info?.name ?? link.label} 下载↗</span>
    </a>
  );
}