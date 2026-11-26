import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoctorProfileContent } from "@/components/doctors/DoctorProfileContent";
import { doctors, doctorDisplayName, getDoctorBySlug } from "@/data/doctors";
import { getDoctorProfile } from "@/data/doctor-profiles";
import { getDoctorSlugOgImagePath } from "@/lib/og/doctor-slug";
import { buildMetadata } from "@/lib/seo";
import { buildDoctorProfileJsonLd } from "@/lib/seo/doctor-profile-jsonld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return {};

  const path = `/doctors/${slug}`;

  const displayName = doctorDisplayName(doctor);

  return buildMetadata({
    title: displayName,
    description:
      doctor.seoDescription ??
      `${doctor.bio} Book a telehealth medical marijuana evaluation in Santa Ana.`,
    path,
    ogImage: getDoctorSlugOgImagePath(doctor),
    ogImageDimensions: "auto",
    imageAlt: displayName,
  });
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  const profile = getDoctorProfile(slug);

  if (!doctor || !profile) notFound();

  const doctorProfileJsonLd = buildDoctorProfileJsonLd(doctor, profile);

  return (
    <>
      <JsonLd data={doctorProfileJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Our Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
        includeJsonLd={false}
      />
      <DoctorProfileContent doctor={doctor} profile={profile} />
    </>
  );
}
