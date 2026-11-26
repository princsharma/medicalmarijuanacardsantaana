import type { BlogPost } from "@/data/blog";
import type { Contributor } from "@/data/contributors";
import {
  contributorDisplayName,
  getAuthoredPostsForContributor,
} from "@/data/contributors";
import { siteConfig } from "@/data/site";
import { getCanonicalOrigin, getCanonicalUrl } from "@/lib/url-normalization";

const ORG_ID_SUFFIX = "#organization";
const WEBSITE_ID_SUFFIX = "#website";
const LOGO_ID_SUFFIX = "#logo";
const EDITORIAL_TEAM_ID = `${getCanonicalUrl("/our-authors")}#editorial-team`;
const PUBLISHING_PRINCIPLES = getCanonicalUrl("/our-policies/editorial-policy");
const LOGO_PATH = "/media/brand-logo-light.webp";

function organizationId() {
  return `${getCanonicalOrigin()}${ORG_ID_SUFFIX}`;
}

function websiteId() {
  return `${getCanonicalOrigin()}${WEBSITE_ID_SUFFIX}`;
}

function logoId() {
  return `${getCanonicalOrigin()}${LOGO_ID_SUFFIX}`;
}

function splitName(name: string, familyNameOverride?: string) {
  if (familyNameOverride) {
    const parts = name.trim().split(/\s+/);
    return { givenName: parts[0] ?? name, familyName: familyNameOverride };
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { givenName: name, familyName: name };
  }

  const middleIsInitial = parts.length >= 3 && /^[A-Za-z]\.?$/.test(parts[1] ?? "");
  if (middleIsInitial) {
    return {
      givenName: parts[0] ?? name,
      familyName: parts.slice(2).join(" "),
    };
  }

  return {
    givenName: parts[0] ?? name,
    familyName: parts.slice(1).join(" "),
  };
}

function profilePageDescription(bio: string) {
  const sentences = bio.match(/[^.!?]+[.!?]+/g);
  if (!sentences?.length) return bio;
  return sentences.slice(0, 2).join(" ").trim();
}

function parseYearsFromGlance(contributor: Contributor): number | undefined {
  const experience = contributor.glance?.find((row) =>
    /writing experience/i.test(row.label),
  );
  if (!experience) return undefined;
  const match = experience.value.match(/(\d+)/);
  return match ? Number.parseInt(match[1]!, 10) : undefined;
}

function alumniFromEducation(education?: string[], alumniOfUrl?: string) {
  if (!education?.length) return undefined;
  for (const line of education) {
    const uni = line.match(/—\s*([^(\n]+?)(?:\s*\(|$)/) ?? line.match(/\s—\s*(.+)$/);
    const name = uni?.[1]?.trim();
    if (name && /university|college/i.test(name)) {
      const uniName = name.replace(/\s*\(\d+\)\s*$/, "").trim();
      return {
        "@type": "CollegeOrUniversity",
        name: uniName,
        ...(alumniOfUrl ? { url: alumniOfUrl } : {}),
      };
    }
    if (/Howard University/i.test(line)) {
      return { "@type": "CollegeOrUniversity", name: "Howard University" };
    }
    if (/Bridgewater State University/i.test(line)) {
      return {
        "@type": "CollegeOrUniversity",
        name: "Bridgewater State University",
        ...(alumniOfUrl ? { url: alumniOfUrl } : {}),
      };
    }
  }
  return undefined;
}

function credentialsFromEducation(education?: string[]) {
  if (!education?.length) return undefined;

  const credentials: Record<string, unknown>[] = [];

  for (const line of education) {
    if (/B\.S\./i.test(line) && /Howard University/i.test(line)) {
      credentials.push({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Bachelor of Science in Biology, Minor in Chemistry",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Howard University",
        },
      });
    }
    if (/Paralegal/i.test(line)) {
      credentials.push({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "Paralegal Administrative Officer Certification",
      });
    }
    if (/Master of Education/i.test(line)) {
      const yearMatch = line.match(/\((\d{4})\)/);
      credentials.push({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Master of Education (M.Ed.)",
        ...(yearMatch ? { dateCreated: yearMatch[1] } : {}),
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Bridgewater State University",
          url: "https://www.bridgew.edu/",
        },
      });
    }
  }

  return credentials.length ? credentials : undefined;
}

function occupationsFromExperience(experience?: string[]) {
  if (!experience?.length) return undefined;
  return experience.map((title) => ({
    "@type": "Occupation",
    name: title.split("—")[0]?.trim() ?? title,
    occupationLocation: { "@type": "Country", name: "United States" },
  }));
}

function occupationsFromSchema(contributor: Contributor) {
  const entries = contributor.schema?.occupations;
  if (!entries?.length) return undefined;

  return entries.map((entry) => ({
    "@type": "Occupation",
    name: entry.name,
    ...(entry.description ? { description: entry.description } : {}),
    occupationLocation: { "@type": "Country", name: "United States" },
  }));
}

function blogPostingNode(post: BlogPost, authorPersonId: string) {
  const postUrl = getCanonicalUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    articleSection: post.category,
    datePublished: post.date,
    inLanguage: "en-US",
    author: { "@id": authorPersonId },
    publisher: { "@id": organizationId() },
  };
}

function sharedOrganizationGraph() {
  const origin = getCanonicalOrigin();
  const logoUrl = getCanonicalUrl(LOGO_PATH);

  return [
    {
      "@type": "WebSite",
      "@id": websiteId(),
      url: getCanonicalUrl("/"),
      name: siteConfig.name,
      inLanguage: "en-US",
      publisher: { "@id": organizationId() },
    },
    {
      "@type": "MedicalBusiness",
      "@id": organizationId(),
      name: siteConfig.name,
      url: getCanonicalUrl("/"),
      logo: {
        "@type": "ImageObject",
        "@id": logoId(),
        url: logoUrl,
        contentUrl: logoUrl,
        width: 512,
        height: 512,
      },
      image: { "@id": logoId() },
      telephone: "+1-333-444-1111",
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.zip,
        addressCountry: siteConfig.address.country,
      },
    },
    {
      "@type": "Organization",
      "@id": EDITORIAL_TEAM_ID,
      name: `${siteConfig.name} Editorial Team`,
      url: getCanonicalUrl("/our-authors"),
      parentOrganization: { "@id": organizationId() },
      publishingPrinciples: PUBLISHING_PRINCIPLES,
    },
  ];
}

export function buildContributorProfileJsonLd(contributor: Contributor) {
  const profilePath = `/our-authors/${contributor.slug}`;
  const profileUrl = getCanonicalUrl(profilePath);
  const personId = `${profileUrl}#person`;
  const webpageId = `${profileUrl}#webpage`;
  const breadcrumbId = `${profileUrl}#breadcrumb`;
  const imageId = `${profileUrl}#image`;
  const articlesId = `${profileUrl}#articles`;
  const imageUrl = contributor.photo ? getCanonicalUrl(contributor.photo) : undefined;

  const authoredPosts = [...getAuthoredPostsForContributor(contributor.slug)].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const displayName = contributorDisplayName(contributor);
  const { givenName, familyName } = splitName(
    contributor.name,
    contributor.schema?.familyName,
  );
  const yearsExperience = parseYearsFromGlance(contributor);
  const alumniOf = alumniFromEducation(
    contributor.education,
    contributor.schema?.alumniOfUrl,
  );
  const credentialList = credentialsFromEducation(contributor.education);
  const hasCredential = credentialList
    ? credentialList.length === 1
      ? credentialList[0]
      : credentialList
    : undefined;
  const hasOccupation =
    occupationsFromSchema(contributor) ?? occupationsFromExperience(contributor.experience);
  const knowsAbout = contributor.schema?.knowsAbout ?? contributor.expertise;
  const includeExperienceYears = contributor.schema?.includeExperienceYears ?? false;
  const profileDescription =
    contributor.schema?.profilePageDescription ??
    (contributor.slug === "octavia-wyche"
      ? profilePageDescription(contributor.bio)
      : contributor.shortBio);
  const personDescription =
    contributor.schema?.personDescription ?? contributor.bio;

  const personNode: Record<string, unknown> = {
    "@type": "Person",
    "@id": personId,
    name: displayName,
    givenName,
    familyName,
    ...(contributor.credential ? { honorificSuffix: contributor.credential } : {}),
    url: profileUrl,
    mainEntityOfPage: { "@id": webpageId },
    ...(imageUrl
      ? { image: { "@id": imageId } }
      : {}),
    jobTitle: contributor.role,
    description: personDescription,
    ...(knowsAbout.length ? { knowsAbout } : {}),
    ...(hasOccupation ? { hasOccupation } : {}),
    ...(alumniOf ? { alumniOf } : {}),
    ...(hasCredential ? { hasCredential } : {}),
    ...(includeExperienceYears && yearsExperience !== undefined
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Years of experience in health and telehealth content",
            value: yearsExperience,
            unitText: "years",
          },
        }
      : {}),
    worksFor: { "@id": organizationId() },
    memberOf: { "@id": EDITORIAL_TEAM_ID },
  };

  const profilePageNode: Record<string, unknown> = {
    "@type": "ProfilePage",
    "@id": webpageId,
    url: profileUrl,
    name: `${displayName}, ${contributor.role} | ${siteConfig.name}`,
    description: profileDescription,
    inLanguage: "en-US",
    ...(contributor.profileDates?.dateCreated
      ? { dateCreated: contributor.profileDates.dateCreated }
      : {}),
    ...(contributor.profileDates?.dateModified
      ? { dateModified: contributor.profileDates.dateModified }
      : {}),
    ...(contributor.profileDates?.lastReviewed
      ? { lastReviewed: contributor.profileDates.lastReviewed }
      : {}),
    isAccessibleForFree: true,
    isPartOf: { "@id": websiteId() },
    publisher: { "@id": organizationId() },
    reviewedBy: { "@id": EDITORIAL_TEAM_ID },
    publishingPrinciples: PUBLISHING_PRINCIPLES,
    breadcrumb: { "@id": breadcrumbId },
    ...(imageUrl ? { primaryImageOfPage: { "@id": imageId } } : {}),
    mainEntity: { "@id": personId },
    ...(authoredPosts.length ? { hasPart: { "@id": articlesId } } : {}),
  };

  const graph: Record<string, unknown>[] = [
    ...sharedOrganizationGraph(),
    profilePageNode,
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getCanonicalUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Our Authors",
          item: getCanonicalUrl("/our-authors"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: contributor.name,
          item: profileUrl,
        },
      ],
    },
  ];

  if (imageUrl) {
    graph.push({
      "@type": "ImageObject",
      "@id": imageId,
      url: imageUrl,
      contentUrl: imageUrl,
      caption: `${displayName}, ${contributor.role}`,
      width: 800,
      height: 800,
    });
  }

  graph.push(personNode);

  if (authoredPosts.length) {
    graph.push({
      "@type": "ItemList",
      "@id": articlesId,
      name: `Articles by ${contributor.name}`,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: authoredPosts.length,
      itemListElement: authoredPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@id": `${getCanonicalUrl(`/blog/${post.slug}`)}#article` },
      })),
    });
    graph.push(...authoredPosts.map((post) => blogPostingNode(post, personId)));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}