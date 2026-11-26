import type { Contributor } from "@/data/contributors";
import { contributors, contributorsHubContent } from "@/data/contributors";
import type { Doctor } from "@/data/doctors";
import { doctors } from "@/data/doctors";
import { getCanonicalOrigin, getCanonicalUrl } from "@/lib/url-normalization";

const AUTHORS_HUB_PATH = "/our-authors";
const BUSINESS_NAME = "Medical Marijuana Santa Ana";
const BUSINESS_IMAGE = `${getCanonicalOrigin()}/media/home-feature.webp`;

const COLLECTION_DESCRIPTION =
  "Meet the writers and licensed physicians who create and review patient education for Santa Ana and California cannabis rules.";

function personAtId(profilePath: string) {
  return `${getCanonicalUrl(profilePath)}#person`;
}

function contributorPersonNode(contributor: Contributor) {
  const profileUrl = getCanonicalUrl(`/our-authors/${contributor.slug}`);

  return {
    "@type": "Person",
    "@id": personAtId(`/our-authors/${contributor.slug}`),
    name: contributor.name,
    ...(contributor.credential ? { honorificSuffix: contributor.credential } : {}),
    jobTitle: contributor.role,
    description: contributor.shortBio,
    url: profileUrl,
    mainEntityOfPage: profileUrl,
    worksFor: { "@id": `${getCanonicalOrigin()}/#business` },
  };
}

function doctorPersonNode(doctor: Doctor) {
  const profileUrl = getCanonicalUrl(`/doctors/${doctor.slug}`);

  return {
    "@type": "Person",
    "@id": personAtId(`/doctors/${doctor.slug}`),
    name: doctor.name,
    honorificSuffix: doctor.credential,
    jobTitle: `Physician Reviewer, ${doctor.specialty}`,
    description: doctor.bio,
    url: profileUrl,
    mainEntityOfPage: profileUrl,
    worksFor: { "@id": `${getCanonicalOrigin()}/#business` },
  };
}

export function buildAuthorsHubJsonLd() {
  const origin = getCanonicalOrigin();
  const hubUrl = getCanonicalUrl(AUTHORS_HUB_PATH);
  const team = [
    ...contributors.map((c) => ({
      path: `/our-authors/${c.slug}`,
      node: contributorPersonNode(c),
    })),
    ...doctors.map((d) => ({
      path: `/doctors/${d.slug}`,
      node: doctorPersonNode(d),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: getCanonicalUrl("/"),
        name: BUSINESS_NAME,
        inLanguage: "en-US",
        publisher: { "@id": `${origin}/#business` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#webpage`,
        url: hubUrl,
        name: contributorsHubContent.title,
        description: COLLECTION_DESCRIPTION,
        inLanguage: "en-US",
        isPartOf: { "@id": `${origin}/#website` },
        publisher: { "@id": `${origin}/#business` },
        breadcrumb: { "@id": `${hubUrl}#breadcrumb` },
        mainEntity: { "@id": `${hubUrl}#team` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1"],
        },
      },
      {
        "@type": ["MedicalBusiness", "Organization"],
        "@id": `${origin}/#business`,
        name: BUSINESS_NAME,
        url: getCanonicalUrl("/"),
        description:
          "Licensed medical marijuana evaluations for Santa Ana and Orange County patients. HIPAA-compliant telehealth with same-day appointments.",
        image: BUSINESS_IMAGE,
        priceRange: "55-199",
        telephone: "+1-333-444-1111",
        email: "contact@medicalmarijuanacardsantaana.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Main Street",
          addressLocality: "Santa Ana",
          addressRegion: "CA",
          postalCode: "92701",
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "City", name: "Santa Ana" },
          { "@type": "AdministrativeArea", name: "Orange County, California" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "20:00",
          },
        ],
        publishingPrinciples: getCanonicalUrl("/our-policies/editorial-policy"),
        sameAs: [getCanonicalUrl("/about-us"), getCanonicalUrl("/reviews")],
        employee: team.map(({ path }) => ({ "@id": personAtId(path) })),
      },
      {
        "@type": "ItemList",
        "@id": `${hubUrl}#team`,
        name: "Authors and Physician Reviewers",
        numberOfItems: team.length,
        itemListElement: team.map(({ path }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": personAtId(path) },
        })),
      },
      ...team.map(({ node }) => node),
      {
        "@type": "BreadcrumbList",
        "@id": `${hubUrl}#breadcrumb`,
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
            item: hubUrl,
          },
        ],
      },
    ],
  };
}