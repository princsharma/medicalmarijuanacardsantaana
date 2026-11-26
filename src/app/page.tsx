import dynamic from "next/dynamic";

import { JsonLd } from "@/components/seo/JsonLd";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { faqItems, processSteps } from "@/data/homepage";
import { buildHubMetadata } from "@/lib/og/hub-metadata";

const PAGE_TITLE = "How to Get a Medical Marijuana Card in Santa Ana, California";
const PAGE_DESCRIPTION =
  "Apply for your medical marijuana card in Santa Ana online from licensed doctors. Same-day telehealth evaluation, plans from $55, money-back guarantee.";

export async function generateMetadata() {
  return buildHubMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
  });
}

const ProcessSection = dynamic(() =>
  import("@/components/sections/ProcessSection").then((m) => m.ProcessSection)
);
const TelehealthSection = dynamic(() =>
  import("@/components/sections/TelehealthSection").then((m) => m.TelehealthSection)
);
const BenefitsSection = dynamic(() =>
  import("@/components/sections/BenefitsSection").then((m) => m.BenefitsSection)
);
const ConditionsSection = dynamic(() =>
  import("@/components/sections/ConditionsSection").then((m) => m.ConditionsSection)
);
const PricingSection = dynamic(() =>
  import("@/components/sections/PricingSection").then((m) => m.PricingSection)
);
const TrustSection = dynamic(() =>
  import("@/components/sections/TrustSection").then((m) => m.TrustSection)
);
// const ServiceAreasSection = dynamic(() =>
//   import("@/components/sections/ServiceAreasSection").then((m) => m.ServiceAreasSection)
// );
const ReviewsSection = dynamic(() =>
  import("@/components/sections/ReviewsSection").then((m) => m.ReviewsSection)
);
const FaqSection = dynamic(() =>
  import("@/components/sections/FaqSection").then((m) => m.FaqSection)
);
const CtaSection = dynamic(() =>
  import("@/components/sections/CtaSection").then((m) => m.CtaSection)
);

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://medicalmarijuanacardsantaana.com/#website",
      url: "https://medicalmarijuanacardsantaana.com/",
      name: "Medical Marijuana Santa Ana",
      inLanguage: "en-US",
      publisher: { "@id": "https://medicalmarijuanacardsantaana.com/#business" },
    },
    {
      "@type": "MedicalWebPage",
      "@id": "https://medicalmarijuanacardsantaana.com/#webpage",
      url: "https://medicalmarijuanacardsantaana.com/",
      name: PAGE_TITLE,
      description:
        "Connect with a licensed California medical marijuana doctor and get evaluated via secure telehealth. Plans from $55 with a money-back guarantee.",
      inLanguage: "en-US",
      isPartOf: { "@id": "https://medicalmarijuanacardsantaana.com/#website" },
      about: { "@id": "https://medicalmarijuanacardsantaana.com/#service" },
      publisher: { "@id": "https://medicalmarijuanacardsantaana.com/#business" },
      breadcrumb: { "@id": "https://medicalmarijuanacardsantaana.com/#breadcrumb" },
      mainEntity: { "@id": "https://medicalmarijuanacardsantaana.com/#faq" },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "#process", "#faq"],
      },
    },
    {
      "@type": ["MedicalBusiness", "Organization"],
      "@id": "https://medicalmarijuanacardsantaana.com/#business",
      name: "Medical Marijuana Santa Ana",
      url: "https://medicalmarijuanacardsantaana.com/",
      description:
        "Licensed medical marijuana evaluations for Santa Ana and Orange County patients. HIPAA-compliant telehealth with same-day appointments.",
      image: "https://medicalmarijuanacardsantaana.com/media/home-feature.webp",
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
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+1-333-444-1111",
        email: "contact@medicalmarijuanacardsantaana.com",
        areaServed: "US-CA",
        availableLanguage: "English",
      },
      sameAs: [
        "https://medicalmarijuanacardsantaana.com/about-us",
        "https://medicalmarijuanacardsantaana.com/reviews",
      ],
      makesOffer: { "@id": "https://medicalmarijuanacardsantaana.com/#service" },
    },
    {
      "@type": ["MedicalService", "Service"],
      "@id": "https://medicalmarijuanacardsantaana.com/#service",
      name: "Telehealth Medical Marijuana Evaluation",
      serviceType: "Medical cannabis evaluation and recommendation",
      description:
        "Online audio or video consultation with a licensed California physician who determines whether medical cannabis is appropriate and issues a written recommendation if approved.",
      provider: { "@id": "https://medicalmarijuanacardsantaana.com/#business" },
      areaServed: [
        { "@type": "City", name: "Santa Ana" },
        { "@type": "AdministrativeArea", name: "Orange County, California" },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://medicalmarijuanacardsantaana.com/#apply",
        name: "Online application and telehealth visit",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        "@id": "https://medicalmarijuanacardsantaana.com/#pricing",
        name: "Medical Marijuana Evaluation Plans",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Basic Plan",
            description:
              "Digital recommendation letter, full legal protections statewide, same-day evaluation.",
            price: "55.00",
            priceCurrency: "USD",
            url: "https://medicalmarijuanacardsantaana.com/#pricing",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Gold Plan",
            description:
              "Everything in Basic, plus plastic MMIC ID card, MMIC delivered via email, and printed recommendation copy.",
            price: "99.00",
            priceCurrency: "USD",
            url: "https://medicalmarijuanacardsantaana.com/#pricing",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Platinum Plan",
            description:
              "Everything in Gold, plus grower's license and plastic MMIC ID card.",
            price: "199.00",
            priceCurrency: "USD",
            url: "https://medicalmarijuanacardsantaana.com/#pricing",
            availability: "https://schema.org/InStock",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://medicalmarijuanacardsantaana.com/#faq",
      url: "https://medicalmarijuanacardsantaana.com/#faq",
      isPartOf: { "@id": "https://medicalmarijuanacardsantaana.com/#webpage" },
      mainEntity: faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#faq"],
      },
    },
    {
      "@type": "HowTo",
      "@id": "https://medicalmarijuanacardsantaana.com/#howto",
      name: "How to Get a Medical Marijuana Card in Santa Ana",
      description:
        "Three steps to get your medical marijuana recommendation online, typically within 30 minutes.",
      totalTime: "PT30M",
      step: processSteps.map((step) => ({
        "@type": "HowToStep",
        position: step.step,
        name: step.title,
        text: step.description,
        url: "https://medicalmarijuanacardsantaana.com/#process",
      })),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#process"],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://medicalmarijuanacardsantaana.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://medicalmarijuanacardsantaana.com/",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageJsonLd} />
      <HeroSection />
      {/* <TrustMarquee /> */}
      <ProcessSection />
      {/* <TelehealthSection /> */}
      <BenefitsSection />
      <ConditionsSection />
      <PricingSection />
      <TrustSection />
      {/* <ServiceAreasSection /> */}
      <ReviewsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
