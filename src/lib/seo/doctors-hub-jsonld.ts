import { doctorHubFaqs, doctorDisplayName, doctors } from "@/data/doctors";
import type { Doctor } from "@/data/doctors";
import { siteConfig } from "@/data/site";
import { getCanonicalOrigin, getCanonicalUrl } from "@/lib/url-normalization";

const DOCTORS_PATH = "/doctors";
const BUSINESS_DESCRIPTION =
  "Licensed medical marijuana evaluations for Santa Ana and Orange County patients. HIPAA-compliant telehealth with same-day appointments.";
const COLLECTION_DESCRIPTION =
  "Our California-licensed physicians provide one-on-one telehealth evaluations for Santa Ana and Orange County patients. Every recommendation is based on an independent clinical assessment.";
const COLLECTION_TITLE =
  "Our Doctors | California-Licensed Physicians | Medical Marijuana Card Santa Ana";
const HERO_IMAGE_PATH = "/media/professional talking.webp";
const LOGO_PATH = "/media/brand-logo-light.webp";

const PAGE_DATES = {
  datePublished: "2026-01-15",
  dateModified: "2026-11-13",
};

const GEO = {
  latitude: 33.7455,
  longitude: -117.8677,
};

const EVALUATION_STEPS = [
  {
    position: 1,
    name: "Share your health history",
    text: "Complete the intake information and provide details relevant to your evaluation.",
  },
  {
    position: 2,
    name: "Meet with your physician",
    text: "Discuss your health history, current concerns, and questions in a private telehealth visit.",
  },
  {
    position: 3,
    name: "Receive an independent assessment",
    text: "The physician reviews your circumstances and determines whether a recommendation is appropriate.",
  },
  {
    position: 4,
    name: "Review your next steps",
    text: "Your physician explains the outcome and any next steps following the evaluation.",
  },
] as const;

const NAV_LINKS = [
  { name: "Process", url: "/#process" },
  { name: "Benefits", url: "/#benefits" },
  { name: "Pricing", url: "/#pricing" },
  { name: "FAQ", url: "/#faq" },
  { name: "Blog", url: "/blog" },
  { name: "Authors", url: "/our-authors" },
  { name: "Contact Us", url: "/contact-us" },
] as const;

type DoctorSchemaMeta = {
  personDescription: string;
  knowsAbout: string[];
  occupationDescription: string;
  yearsExperience?: number;
};

const DOCTOR_SCHEMA: Record<string, DoctorSchemaMeta> = {
  "rick-rieser": {
    personDescription:
      "A licensed nuclear medicine specialist with decades of experience who provides thorough, patient-focused medical marijuana evaluations while following applicable California regulations.",
    knowsAbout: ["General medicine", "Nuclear medicine", "Medical marijuana evaluations"],
    occupationDescription: "General Medicine and Nuclear Medicine",
  },
  "johnathan-miller": {
    personDescription:
      "A California-licensed physician with 8 years of experience who takes a comprehensive, patient-centered approach to state-compliant medical marijuana evaluations.",
    knowsAbout: ["General medicine", "Medical marijuana evaluations"],
    occupationDescription: "General Medicine",
    yearsExperience: 8,
  },
};

function organizationId() {
  return `${getCanonicalOrigin()}/#organization`;
}

function websiteId() {
  return `${getCanonicalOrigin()}/#website`;
}

function logoId() {
  return `${getCanonicalOrigin()}/#logo`;
}

function serviceId() {
  return `${getCanonicalOrigin()}/#service`;
}

function doctorsHubUrl() {
  return getCanonicalUrl(DOCTORS_PATH);
}

function fragment(suffix: string) {
  return `${doctorsHubUrl()}${suffix}`;
}

function encodeMediaUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const encoded = normalized
    .split("/")
    .map((segment, index) => (index === 0 || !segment ? segment : encodeURIComponent(segment)))
    .join("/");
  return `${getCanonicalOrigin()}${encoded}`;
}

function splitDoctorName(doctor: Doctor) {
  const parts = doctor.name.trim().split(/\s+/);
  return {
    givenName: parts[0] ?? doctor.name,
    familyName: parts.slice(1).join(" ") || doctor.name,
  };
}

function personId(doctor: Doctor) {
  return `${getCanonicalUrl(`/doctors/${doctor.slug}`)}#person`;
}

function californiaMedicalLicense() {
  return {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    name: "California Medical License (MD)",
    recognizedBy: {
      "@type": "GovernmentOrganization",
      name: "Medical Board of California",
      url: "https://www.mbc.ca.gov/",
    },
  };
}

function doctorPersonNode(doctor: Doctor) {
  const profileUrl = getCanonicalUrl(`/doctors/${doctor.slug}`);
  const meta = DOCTOR_SCHEMA[doctor.slug];
  const { givenName, familyName } = splitDoctorName(doctor);
  const imageUrl = doctor.photo ? getCanonicalUrl(doctor.photo) : undefined;

  return {
    "@type": "Person",
    "@id": personId(doctor),
    name: doctorDisplayName(doctor),
    givenName,
    familyName,
    honorificSuffix: doctor.credential,
    url: profileUrl,
    mainEntityOfPage: profileUrl,
    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: imageUrl,
            caption: doctorDisplayName(doctor),
          },
        }
      : {}),
    jobTitle: `Physician, ${doctor.specialty}`,
    description: meta?.personDescription ?? doctor.bio,
    ...(meta?.knowsAbout ? { knowsAbout: meta.knowsAbout } : {}),
    hasOccupation: {
      "@type": "Occupation",
      name: "Physician",
      description: meta?.occupationDescription ?? doctor.specialty,
      occupationLocation: { "@type": "State", name: "California" },
    },
    hasCredential: californiaMedicalLicense(),
    ...(meta?.yearsExperience !== undefined
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Years of experience",
            value: meta.yearsExperience,
            unitText: "years",
          },
        }
      : {}),
    worksFor: { "@id": organizationId() },
    memberOf: { "@id": fragment("#physician-team") },
  };
}

export function buildDoctorsHubJsonLd() {
  const hubUrl = doctorsHubUrl();
  const logoUrl = getCanonicalUrl(LOGO_PATH);
  const heroImageUrl = encodeMediaUrl(HERO_IMAGE_PATH);
  const mapQuery = encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`,
  );
  const faqItems = doctorHubFaqs.slice(0, 5);

  return {
    "@context": "https://schema.org",
    "@graph": [
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
        description: BUSINESS_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          "@id": logoId(),
          url: logoUrl,
          contentUrl: logoUrl,
          width: 512,
          height: 512,
          caption: siteConfig.name,
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
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO.latitude,
          longitude: GEO.longitude,
        },
        hasMap: `https://www.google.com/maps?q=${mapQuery}`,
        areaServed: [
          { "@type": "City", name: "Santa Ana" },
          { "@type": "AdministrativeArea", name: "Orange County, California" },
        ],
        openingHoursSpecification: {
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
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-333-444-1111",
          contactType: "customer service",
          email: siteConfig.email,
          areaServed: "US-CA",
          availableLanguage: "English",
        },
        makesOffer: { "@id": serviceId() },
        member: doctors.map((doctor) => ({ "@id": personId(doctor) })),
      },
      {
        "@type": ["CollectionPage", "WebPage"],
        "@id": fragment("#webpage"),
        url: hubUrl,
        name: COLLECTION_TITLE,
        description: COLLECTION_DESCRIPTION,
        inLanguage: "en-US",
        datePublished: PAGE_DATES.datePublished,
        dateModified: PAGE_DATES.dateModified,
        isAccessibleForFree: true,
        isPartOf: { "@id": websiteId() },
        about: { "@id": organizationId() },
        publisher: { "@id": organizationId() },
        audience: { "@id": fragment("#audience") },
        breadcrumb: { "@id": fragment("#breadcrumb") },
        primaryImageOfPage: { "@id": fragment("#hero-image") },
        mainEntity: { "@id": fragment("#physician-list") },
        hasPart: [
          { "@id": fragment("#header") },
          { "@id": fragment("#hero") },
          { "@id": fragment("#howto") },
          { "@id": fragment("#faq") },
          { "@id": fragment("#cta") },
          { "@id": fragment("#footer") },
        ],
        significantLink: [
          getCanonicalUrl("/doctors/rick-rieser"),
          getCanonicalUrl("/doctors/johnathan-miller"),
          getCanonicalUrl("/our-authors"),
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": fragment("#breadcrumb"),
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
            name: "Our Doctors",
            item: hubUrl,
          },
        ],
      },
      {
        "@type": "ImageObject",
        "@id": fragment("#hero-image"),
        url: heroImageUrl,
        contentUrl: heroImageUrl,
        caption: "Physician conducting a secure telehealth consultation",
        width: 1200,
        height: 800,
      },
      {
        "@type": "ItemList",
        "@id": fragment("#physician-list"),
        name: "Meet our physicians",
        description:
          "California-licensed physicians who provide telehealth evaluations for our patients.",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: doctors.length,
        itemListElement: doctors.map((doctor, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": personId(doctor) },
        })),
      },
      {
        "@type": "Organization",
        "@id": fragment("#physician-team"),
        name: `${siteConfig.name} Physician Team`,
        url: hubUrl,
        description:
          "California-licensed physicians who provide one-on-one telehealth evaluations for Santa Ana and Orange County patients.",
        parentOrganization: { "@id": organizationId() },
        numberOfEmployees: {
          "@type": "QuantitativeValue",
          value: doctors.length,
          unitText: "licensed physicians",
        },
        member: doctors.map((doctor) => ({
          "@type": "OrganizationRole",
          roleName: "Physician",
          member: { "@id": personId(doctor) },
        })),
      },
      {
        "@type": "WebPageElement",
        "@id": fragment("#hero"),
        name: "Meet your medical team",
        description: COLLECTION_DESCRIPTION,
        isPartOf: { "@id": fragment("#webpage") },
        image: { "@id": fragment("#hero-image") },
      },
      {
        "@type": "WebPageElement",
        "@id": fragment("#cta"),
        name: "Take the next step in your care",
        description:
          "Book an online visit with a California-licensed physician. A recommendation is determined by the physician after an individual evaluation.",
        isPartOf: { "@id": fragment("#webpage") },
        about: { "@id": serviceId() },
      },
      ...doctors.map((doctor) => doctorPersonNode(doctor)),
      {
        "@type": "Service",
        "@id": serviceId(),
        name: "Medical Marijuana Evaluation (Telehealth)",
        serviceType: "Medical marijuana evaluation",
        description:
          "One-on-one telehealth evaluation with a California-licensed physician. A recommendation is determined by the physician after an individual evaluation.",
        provider: { "@id": organizationId() },
        areaServed: [
          { "@type": "City", name: "Santa Ana" },
          { "@type": "AdministrativeArea", name: "Orange County, California" },
        ],
        audience: { "@id": fragment("#audience") },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Physician licensure",
            value: "Licensed in California",
          },
          {
            "@type": "PropertyValue",
            name: "Visit format",
            value: "Secure telehealth visits",
          },
          {
            "@type": "PropertyValue",
            name: "Privacy",
            value: "HIPAA-conscious workflow",
          },
          {
            "@type": "PropertyValue",
            name: "Evaluation approach",
            value: "Independent clinical assessment",
          },
        ],
        potentialAction: {
          "@type": "ReserveAction",
          name: "Book a consultation",
          target: {
            "@type": "EntryPoint",
            urlTemplate: fragment("#apply"),
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
          result: {
            "@type": "Reservation",
            name: "Telehealth consultation with a California-licensed physician",
          },
        },
      },
      {
        "@type": "MedicalAudience",
        "@id": fragment("#audience"),
        audienceType: "Patient",
        geographicArea: {
          "@type": "AdministrativeArea",
          name: "Orange County, California",
        },
      },
      {
        "@type": "HowTo",
        "@id": fragment("#howto"),
        name: "How your evaluation with our physicians works",
        description:
          "A straightforward process, with your physician guiding the clinical conversation.",
        inLanguage: "en-US",
        step: EVALUATION_STEPS.map((step) => ({
          "@type": "HowToStep",
          position: step.position,
          name: step.name,
          text: step.text,
          url: fragment(`#step-${step.position}`),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": fragment("#faq"),
        name: "Physician FAQs",
        url: hubUrl,
        inLanguage: "en-US",
        mainEntity: faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${getCanonicalOrigin()}/#navigation`,
        name: NAV_LINKS.map((item) => item.name),
        url: NAV_LINKS.map((item) => getCanonicalUrl(item.url)),
      },
      {
        "@type": "WPHeader",
        "@id": fragment("#header"),
        name: "Site header and main navigation",
        cssSelector: "header",
        hasPart: { "@id": `${getCanonicalOrigin()}/#navigation` },
      },
      {
        "@type": "WPFooter",
        "@id": fragment("#footer"),
        name: "Site footer, policies and contact details",
        cssSelector: "footer",
      },
    ],
  };
}