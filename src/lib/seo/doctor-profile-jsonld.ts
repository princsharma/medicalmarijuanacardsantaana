import type { Doctor } from "@/data/doctors";
import { doctorDisplayName, getDoctorBySlug } from "@/data/doctors";
import type { DoctorProfile } from "@/data/doctor-profiles";
import { siteConfig } from "@/data/site";
import { getCanonicalOrigin, getCanonicalUrl } from "@/lib/url-normalization";

const BUSINESS_DESCRIPTION =
  "Licensed medical marijuana evaluations for Santa Ana and Orange County patients. HIPAA-compliant telehealth with same-day appointments.";
const LOGO_PATH = "/media/brand-logo-light.webp";
const PUBLISHING_PRINCIPLES = getCanonicalUrl("/our-policies/editorial-policy");
const NPI_NUMBER = "1740735737";
const CA_LICENSE = "G55156";
const NPI_URL = `https://npiregistry.cms.hhs.gov/search?number=${NPI_NUMBER}`;

const ORG_KNOWS_ABOUT = [
  "Medical Cannabis Evaluation",
  "California Medical Marijuana Identification Card Program",
  "Telehealth",
  "HIPAA-Compliant Telemedicine",
];

const RICK_KNOWS_ABOUT = [
  "Nuclear Medicine",
  "General Medicine",
  "Medical Cannabis Evaluation",
  "California Medical Marijuana Identification Card Program",
  "Telehealth",
  "Chronic Pain",
  "Anxiety Disorders",
  "Post-Traumatic Stress Disorder",
  "Arthritis",
  "Cancer",
  "Insomnia",
];

const JOHNATHAN_NPI = "1235623372";
const JOHNATHAN_NPI_URL = `https://npiregistry.cms.hhs.gov/search?number=${JOHNATHAN_NPI}`;

const JOHNATHAN_KNOWS_ABOUT = [
  "General Medicine",
  "Medical Cannabis Evaluation",
  "California Medical Marijuana Identification Card Program",
  "Telehealth",
  "Chronic Pain",
  "Post-Traumatic Stress Disorder",
  "Seizures",
  "Multiple Sclerosis",
  "HIV/AIDS",
];

const MILLER_CONDITION_LABELS: Record<string, string> = {
  "Chronic pain": "Chronic Pain",
  "Cancer-related symptoms": "Cancer-Related Symptoms",
  PTSD: "PTSD",
  Seizures: "Seizures",
  "Multiple sclerosis": "Multiple Sclerosis",
  "HIV/AIDS": "HIV/AIDS",
  "Severe nausea": "Severe Nausea",
};

const MILLER_SERVICE_DESCRIPTION =
  "Secure online medical cannabis consultations in which Dr. Miller reviews medical history, discusses symptoms and health concerns, reviews relevant medications and treatments, and evaluates whether medical cannabis may be appropriate. Approval or certification is not guaranteed and is determined by the evaluating physician.";

const CONDITION_META: Record<
  string,
  { sameAs?: string; alternateName?: string }
> = {
  "Chronic Pain": { sameAs: "https://en.wikipedia.org/wiki/Chronic_pain" },
  "Anxiety Disorders": { sameAs: "https://en.wikipedia.org/wiki/Anxiety_disorder" },
  "Cancer-Related Symptoms": { sameAs: "https://en.wikipedia.org/wiki/Cancer" },
  PTSD: {
    alternateName: "Post-Traumatic Stress Disorder",
    sameAs: "https://en.wikipedia.org/wiki/Posttraumatic_stress_disorder",
  },
  Arthritis: { sameAs: "https://en.wikipedia.org/wiki/Arthritis" },
  Cancer: { sameAs: "https://en.wikipedia.org/wiki/Cancer" },
  Insomnia: { sameAs: "https://en.wikipedia.org/wiki/Insomnia" },
  Seizures: { sameAs: "https://en.wikipedia.org/wiki/Seizure" },
  "Multiple Sclerosis": { sameAs: "https://en.wikipedia.org/wiki/Multiple_sclerosis" },
  "HIV/AIDS": { sameAs: "https://en.wikipedia.org/wiki/HIV/AIDS" },
  "Severe Nausea": { sameAs: "https://en.wikipedia.org/wiki/Nausea" },
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

function splitDoctorName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    givenName: parts[0] ?? name,
    familyName: parts.slice(1).join(" ") || name,
  };
}

function firstTwoSentences(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences?.length) return text;
  return sentences.slice(0, 2).join(" ").trim();
}

function sharedSiteOrganizationGraph() {
  const logoUrl = getCanonicalUrl(LOGO_PATH);

  return [
    {
      "@type": "MedicalBusiness",
      "@id": organizationId(),
      name: siteConfig.name,
      url: getCanonicalUrl("/"),
      logo: { "@id": logoId() },
      image: { "@id": logoId() },
      description: BUSINESS_DESCRIPTION,
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
      areaServed: [
        { "@type": "City", name: "Santa Ana" },
        { "@type": "AdministrativeArea", name: "Orange County, California" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-333-444-1111",
        email: siteConfig.email,
        contactType: "customer service",
        areaServed: "US-CA",
        availableLanguage: "English",
        url: getCanonicalUrl("/contact-us"),
      },
      publishingPrinciples: PUBLISHING_PRINCIPLES,
      knowsAbout: ORG_KNOWS_ABOUT,
    },
    {
      "@type": "ImageObject",
      "@id": logoId(),
      url: logoUrl,
      contentUrl: logoUrl,
      caption: `${siteConfig.name} logo`,
    },
    {
      "@type": "WebSite",
      "@id": websiteId(),
      url: getCanonicalUrl("/"),
      name: siteConfig.name,
      inLanguage: "en-US",
      publisher: { "@id": organizationId() },
    },
  ];
}

function colleaguePersonNode(colleague: Doctor) {
  const profileUrl = getCanonicalUrl(`/doctors/${colleague.slug}`);
  const imageUrl = colleague.photo ? getCanonicalUrl(colleague.photo) : undefined;

  return {
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: doctorDisplayName(colleague),
    honorificPrefix: "Dr.",
    givenName: splitDoctorName(colleague.name).givenName,
    familyName: splitDoctorName(colleague.name).familyName,
    honorificSuffix: colleague.credential,
    jobTitle:
      colleague.slug === "rick-rieser"
        ? "Nuclear Medicine Physician"
        : "General Medicine Physician",
    description: colleague.bio,
    url: profileUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    worksFor: { "@id": organizationId() },
  };
}

function buildRickRieserJsonLd(doctor: Doctor, profile: DoctorProfile) {
  const profilePath = `/doctors/${doctor.slug}`;
  const profileUrl = getCanonicalUrl(profilePath);
  const personId = `${profileUrl}#person`;
  const webpageId = `${profileUrl}#webpage`;
  const breadcrumbId = `${profileUrl}#breadcrumb`;
  const primaryImageId = `${profileUrl}#primaryimage`;
  const serviceId = `${profileUrl}#service`;
  const conditionsId = `${profileUrl}#conditions`;
  const faqId = `${profileUrl}#faq`;
  const imageUrl = getCanonicalUrl(doctor.photo ?? "/media/dr-rick-rieser.webp");
  const { givenName, familyName } = splitDoctorName(doctor.name);
  const colleague = getDoctorBySlug("johnathan-miller");

  const listConditions = profile.conditions.filter(
    (name) => name !== "Other Qualifying Conditions",
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...sharedSiteOrganizationGraph(),
      {
        "@type": "ImageObject",
        "@id": primaryImageId,
        url: imageUrl,
        contentUrl: imageUrl,
        caption: doctorDisplayName(doctor),
        representativeOfPage: true,
      },
      {
        "@type": "Person",
        "@id": personId,
        name: doctorDisplayName(doctor),
        honorificPrefix: "Dr.",
        givenName,
        familyName,
        honorificSuffix: doctor.credential,
        jobTitle: "Nuclear Medicine Physician",
        description: firstTwoSentences(profile.intro),
        url: profileUrl,
        image: { "@id": primaryImageId },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "NPI",
          name: "National Provider Identifier",
          value: NPI_NUMBER,
        },
        sameAs: NPI_URL,
        hasOccupation: {
          "@type": "Occupation",
          name: "Nuclear Medicine Physician",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "University of Louisville School of Medicine",
        },
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "Doctor of Medicine (MD), University of Louisville School of Medicine, Class of 1983",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "California Physician License",
            identifier: CA_LICENSE,
            validIn: { "@type": "State", name: "California" },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "National Provider Identifier (NPI)",
            name: "NPI Registration (Active)",
            identifier: NPI_NUMBER,
            recognizedBy: {
              "@type": "GovernmentOrganization",
              name: "Centers for Medicare & Medicaid Services (CMS) — NPPES NPI Registry",
              url: NPI_URL,
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "board",
            name: "American Board of Nuclear Medicine",
            recognizedBy: {
              "@type": "Organization",
              name: "American Board of Nuclear Medicine",
            },
          },
        ],
        knowsAbout: RICK_KNOWS_ABOUT,
        knowsLanguage: "en",
        worksFor: { "@id": organizationId() },
        memberOf: { "@id": organizationId() },
        ...(colleague
          ? { colleague: { "@id": `${getCanonicalUrl(`/doctors/${colleague.slug}`)}#person` } }
          : {}),
        mainEntityOfPage: { "@id": webpageId },
      },
      ...(colleague ? [colleaguePersonNode(colleague)] : []),
      {
        "@type": "ProfilePage",
        "@id": webpageId,
        url: profileUrl,
        name: `${doctorDisplayName(doctor)} | ${siteConfig.name}`,
        description: doctor.seoDescription ?? doctor.bio,
        inLanguage: "en-US",
        isPartOf: { "@id": websiteId() },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        primaryImageOfPage: { "@id": primaryImageId },
        thumbnailUrl: imageUrl,
        breadcrumb: { "@id": breadcrumbId },
        publisher: { "@id": organizationId() },
        potentialAction: {
          "@type": "ReadAction",
          target: profileUrl,
        },
      },
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
            name: "Our Doctors",
            item: getCanonicalUrl("/doctors"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: doctor.name,
            item: profileUrl,
          },
        ],
      },
      {
        "@type": "HealthcareService",
        "@id": serviceId,
        name: "Medical Marijuana Evaluation with Dr. Rick Rieser",
        description:
          "Patients complete an online intake form followed by a brief virtual consultation where medical eligibility is reviewed. When appropriate, a physician recommendation may be issued to support California's Medical Marijuana Identification Card (MMIC) registration.",
        url: profileUrl,
        serviceType: "Medical Marijuana Evaluation",
        category: "Telemedicine",
        provider: [{ "@id": personId }, { "@id": organizationId() }],
        areaServed: [
          { "@type": "City", name: "Santa Ana" },
          { "@type": "State", name: "California" },
        ],
        audience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
          geographicArea: { "@type": "State", name: "California" },
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceType: "Telehealth",
          serviceUrl: `${getCanonicalUrl("/")}#apply`,
          availableLanguage: "English",
        },
        potentialAction: {
          "@type": "ScheduleAction",
          name: "Book My Appointment",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${getCanonicalUrl("/")}#apply`,
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
              "https://schema.org/IOSPlatform",
              "https://schema.org/AndroidPlatform",
            ],
          },
        },
      },
      {
        "@type": "ItemList",
        "@id": conditionsId,
        name: "Conditions Dr. Rick Rieser Evaluates",
        description:
          "Qualifying medical conditions that Dr. Rick Rieser evaluates for medical cannabis therapy under California's program. Other qualifying conditions may also be evaluated.",
        numberOfItems: listConditions.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: listConditions.map((name, index) => {
          const meta = CONDITION_META[name] ?? CONDITION_META[name.replace(/\s+/g, " ")];

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "MedicalCondition",
              name: name === "PTSD" ? "PTSD" : name,
              ...(meta?.alternateName ? { alternateName: meta.alternateName } : {}),
              ...(meta?.sameAs ? { sameAs: meta.sameAs } : {}),
            },
          };
        }),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: profile.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

function buildJohnathanMillerJsonLd(doctor: Doctor, profile: DoctorProfile) {
  const profilePath = `/doctors/${doctor.slug}`;
  const profileUrl = getCanonicalUrl(profilePath);
  const personId = `${profileUrl}#person`;
  const webpageId = `${profileUrl}#webpage`;
  const breadcrumbId = `${profileUrl}#breadcrumb`;
  const primaryImageId = `${profileUrl}#primaryimage`;
  const serviceId = `${profileUrl}#service`;
  const conditionsId = `${profileUrl}#conditions`;
  const howToId = `${profileUrl}#howto`;
  const faqId = `${profileUrl}#faq`;
  const imageUrl = getCanonicalUrl(doctor.photo ?? "/media/dr-johnathan-c-miller.webp");
  const { givenName, familyName } = splitDoctorName(doctor.name);
  const colleague = getDoctorBySlug("rick-rieser");

  const listConditions = profile.conditions.filter(
    (name) => !/other qualifying/i.test(name),
  );

  const howToDescription = [profile.expectIntro, profile.expectNote]
    .filter(Boolean)
    .join(" ");

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...sharedSiteOrganizationGraph(),
      {
        "@type": "ImageObject",
        "@id": primaryImageId,
        url: imageUrl,
        contentUrl: imageUrl,
        caption: doctorDisplayName(doctor),
        representativeOfPage: true,
      },
      {
        "@type": "Person",
        "@id": personId,
        name: doctorDisplayName(doctor),
        honorificPrefix: "Dr.",
        givenName,
        familyName,
        honorificSuffix: doctor.credential,
        jobTitle: "General Practice Physician",
        description: profile.intro,
        url: profileUrl,
        image: { "@id": primaryImageId },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "NPI",
          name: "National Provider Identifier",
          value: JOHNATHAN_NPI,
        },
        sameAs: JOHNATHAN_NPI_URL,
        hasOccupation: {
          "@type": "Occupation",
          name: "General Practice Physician",
          experienceRequirements: "8 years of medical experience",
        },
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: "Columbia University Vagelos College of Physicians and Surgeons",
          },
          {
            "@type": "CollegeOrUniversity",
            name: "University of Alabama at Birmingham",
          },
          {
            "@type": "EducationalOrganization",
            name: "Washington University/B-JH/SLCH Consortium",
          },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "Doctor of Medicine (M.D.), Columbia University Vagelos College of Physicians and Surgeons, Class of 2018",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "B.A. in Foreign Languages and Literatures - Spanish, Summa Cum Laude, University of Alabama at Birmingham, 2009–2014",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "residency",
            name: "Residency in Orthopaedic Surgery, Washington University/B-JH/SLCH Consortium, 2018–2020",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "California Physician License",
            validIn: { "@type": "State", name: "California" },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "National Provider Identifier (NPI)",
            name: "NPI Registration (Active)",
            identifier: JOHNATHAN_NPI,
            recognizedBy: {
              "@type": "GovernmentOrganization",
              name: "Centers for Medicare & Medicaid Services (CMS) — NPPES NPI Registry",
              url: JOHNATHAN_NPI_URL,
            },
          },
        ],
        knowsAbout: JOHNATHAN_KNOWS_ABOUT,
        knowsLanguage: ["en", "es"],
        worksFor: { "@id": organizationId() },
        memberOf: { "@id": organizationId() },
        ...(colleague
          ? { colleague: { "@id": `${getCanonicalUrl(`/doctors/${colleague.slug}`)}#person` } }
          : {}),
        mainEntityOfPage: { "@id": webpageId },
      },
      ...(colleague ? [colleaguePersonNode(colleague)] : []),
      {
        "@type": "ProfilePage",
        "@id": webpageId,
        url: profileUrl,
        name: `${doctorDisplayName(doctor)} | ${siteConfig.name}`,
        description: doctor.seoDescription ?? doctor.bio,
        inLanguage: "en-US",
        isPartOf: { "@id": websiteId() },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        primaryImageOfPage: { "@id": primaryImageId },
        thumbnailUrl: imageUrl,
        breadcrumb: { "@id": breadcrumbId },
        publisher: { "@id": organizationId() },
        potentialAction: {
          "@type": "ReadAction",
          target: profileUrl,
        },
      },
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
            name: "Our Doctors",
            item: getCanonicalUrl("/doctors"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: doctor.name,
            item: profileUrl,
          },
        ],
      },
      {
        "@type": "HealthcareService",
        "@id": serviceId,
        name: "Medical Cannabis Evaluation with Dr. Johnathan Miller",
        description: MILLER_SERVICE_DESCRIPTION,
        url: profileUrl,
        serviceType: "Medical Cannabis Evaluation",
        category: "Telemedicine",
        provider: [{ "@id": personId }, { "@id": organizationId() }],
        areaServed: [
          { "@type": "City", name: "Santa Ana" },
          { "@type": "State", name: "California" },
        ],
        audience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
          geographicArea: { "@type": "State", name: "California" },
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceType: "Telehealth",
          serviceUrl: `${getCanonicalUrl("/")}#apply`,
          availableLanguage: "English",
        },
        potentialAction: {
          "@type": "ScheduleAction",
          name: "Book My Appointment",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${getCanonicalUrl("/")}#apply`,
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
              "https://schema.org/IOSPlatform",
              "https://schema.org/AndroidPlatform",
            ],
          },
        },
      },
      {
        "@type": "ItemList",
        "@id": conditionsId,
        name: "Conditions Dr. Miller Evaluates",
        description:
          "Medical conditions for which medical cannabis may be appropriate under applicable California requirements. Other qualifying or physician-determined conditions may also be evaluated, and final eligibility is determined by the evaluating physician.",
        numberOfItems: listConditions.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: listConditions.map((name, index) => {
          const label = MILLER_CONDITION_LABELS[name] ?? name;
          const meta = CONDITION_META[label];

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "MedicalCondition",
              name: label,
              ...(meta?.alternateName ? { alternateName: meta.alternateName } : {}),
              ...(meta?.sameAs ? { sameAs: meta.sameAs } : {}),
            },
          };
        }),
      },
      ...(profile.expectSteps?.length
        ? [
            {
              "@type": "HowTo",
              "@id": howToId,
              name: "What to Expect During Your Consultation with Dr. Johnathan Miller",
              description: howToDescription,
              step: profile.expectSteps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.title,
                text: step.body,
              })),
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: profile.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

function buildGenericDoctorJsonLd(doctor: Doctor, profile: DoctorProfile) {
  const profilePath = `/doctors/${doctor.slug}`;
  const profileUrl = getCanonicalUrl(profilePath);
  const personId = `${profileUrl}#person`;
  const webpageId = `${profileUrl}#webpage`;
  const breadcrumbId = `${profileUrl}#breadcrumb`;
  const primaryImageId = `${profileUrl}#primaryimage`;
  const imageUrl = doctor.photo ? getCanonicalUrl(doctor.photo) : undefined;
  const { givenName, familyName } = splitDoctorName(doctor.name);

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...sharedSiteOrganizationGraph(),
      ...(imageUrl
        ? [
            {
              "@type": "ImageObject",
              "@id": primaryImageId,
              url: imageUrl,
              contentUrl: imageUrl,
              caption: doctorDisplayName(doctor),
              representativeOfPage: true,
            },
          ]
        : []),
      {
        "@type": "Person",
        "@id": personId,
        name: doctorDisplayName(doctor),
        honorificPrefix: "Dr.",
        givenName,
        familyName,
        honorificSuffix: doctor.credential,
        jobTitle: `Physician, ${doctor.specialty}`,
        description: profile.intro || doctor.bio,
        url: profileUrl,
        ...(imageUrl ? { image: { "@id": primaryImageId } } : {}),
        worksFor: { "@id": organizationId() },
        memberOf: { "@id": organizationId() },
        mainEntityOfPage: { "@id": webpageId },
      },
      {
        "@type": "ProfilePage",
        "@id": webpageId,
        url: profileUrl,
        name: `${doctorDisplayName(doctor)} | ${siteConfig.name}`,
        description: doctor.seoDescription ?? doctor.bio,
        inLanguage: "en-US",
        isPartOf: { "@id": websiteId() },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        ...(imageUrl ? { primaryImageOfPage: { "@id": primaryImageId } } : {}),
        breadcrumb: { "@id": breadcrumbId },
        publisher: { "@id": organizationId() },
      },
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
            name: "Our Doctors",
            item: getCanonicalUrl("/doctors"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: doctor.name,
            item: profileUrl,
          },
        ],
      },
      ...(profile.faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${profileUrl}#faq`,
              mainEntity: profile.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };
}

export function buildDoctorProfileJsonLd(doctor: Doctor, profile: DoctorProfile) {
  if (doctor.slug === "rick-rieser") {
    return buildRickRieserJsonLd(doctor, profile);
  }

  if (doctor.slug === "johnathan-miller") {
    return buildJohnathanMillerJsonLd(doctor, profile);
  }

  return buildGenericDoctorJsonLd(doctor, profile);
}