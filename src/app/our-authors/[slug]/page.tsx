import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContributorProfileContent } from "@/components/authors/ContributorProfileContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  contributorDisplayName,
  contributors,
  getContributorBySlug,
} from "@/data/contributors";
import { getAuthorSlugOgAlt, getAuthorSlugOgImagePath } from "@/lib/og/author-slug";
import { buildMetadata } from "@/lib/seo";
import { buildContributorProfileJsonLd } from "@/lib/seo/contributor-profile-jsonld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return contributors.map((contributor) => ({ slug: contributor.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const contributor = getContributorBySlug(slug);
  if (!contributor) return {};

  const path = `/our-authors/${slug}`;
  const isRobertSaintLaurent = slug === "robert-d-saint-laurent";
  const title = isRobertSaintLaurent
    ? "Robert D. Saint Laurent | Health Content Writer"
    : contributorDisplayName(contributor);

  return buildMetadata({
    title,
    description: contributor.seoDescription,
    path,
    absoluteTitle: isRobertSaintLaurent,
    ogImage: getAuthorSlugOgImagePath(contributor),
    ogImageDimensions: "auto",
    imageAlt: getAuthorSlugOgAlt(contributor),
  });
}

export default async function ContributorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const contributor = getContributorBySlug(slug);

  if (!contributor) notFound();

  const contributorProfileJsonLd = buildContributorProfileJsonLd(contributor);

  return (
    <>
      <JsonLd data={contributorProfileJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Our Authors", href: "/our-authors" },
          { label: contributor.name },
        ]}
        includeJsonLd={false}
      />
      <ContributorProfileContent contributor={contributor} />
    </>
  );
}
