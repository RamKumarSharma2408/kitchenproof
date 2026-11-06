import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Calendar, Star, AlertTriangle, Clock } from "lucide-react";
import { formatDate, getScoreBadge, getVerificationStatusBadge } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    cuisine: string;
    locality: string;
    city: string;
    foodRating?: number | null;
    totalReviews?: number;
    safetyScore: number;
    dataConfidenceScore: number;
    verificationStatus: string;
    lastInspectedAt?: Date | string | null;
    coverImageUrl?: string | null;
    isDemoData?: boolean;
    fssaiNumber?: string | null;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const scoreBadge = getScoreBadge(restaurant.safetyScore);
  const statusBadge = getVerificationStatusBadge(restaurant.verificationStatus);

  return (
    <article className="group bg-white rounded-xl border border-[#E7E7DE] hover:border-[#143D2B]/40 shadow-subtle hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-44 w-full bg-[#EFEFE9] overflow-hidden">
          {restaurant.coverImageUrl ? (
            <Image
              src={restaurant.coverImageUrl}
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#868A85] text-xs">
              Kitchen Photo Pending
            </div>
          )}

          {/* Demonstration Notice Badge */}
          {restaurant.isDemoData && (
            <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide">
              DEMO DATA
            </div>
          )}

          {/* Verification Status Pill */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
            >
              {restaurant.verificationStatus === "VERIFIED" && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#143D2B]" />
              )}
              {restaurant.verificationStatus === "ACTION_REQUIRED" && (
                <AlertTriangle className="w-3.5 h-3.5 text-[#B91C1C]" />
              )}
              {statusBadge.label}
            </span>
          </div>

          {/* Dual Score Overlay at base of image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Consumer App Food Rating */}
            {restaurant.foodRating && (
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-[#161815] flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{restaurant.foodRating.toFixed(1)}</span>
                <span className="text-[10px] text-[#5E635D]">Food Rating</span>
              </span>
            )}
          </div>
        </div>

        {/* Content details */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif font-bold text-lg text-[#161815] group-hover:text-[#143D2B] transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
            </div>
            <p className="text-xs text-[#5E635D] font-medium mt-0.5 line-clamp-1">
              {restaurant.cuisine}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5E635D]">
            <MapPin className="w-3.5 h-3.5 text-[#868A85] flex-shrink-0" />
            <span className="line-clamp-1">
              {restaurant.locality}, {restaurant.city}
            </span>
          </div>

          {/* Kitchen Safety Score Card Banner */}
          <div className="pt-3 border-t border-[#EFEFE9]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#868A85] block">
                  Kitchen Safety Score
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black font-serif text-[#161815]">
                    {restaurant.safetyScore > 0 ? restaurant.safetyScore : "—"}
                  </span>
                  <span className="text-xs text-[#5E635D]">/100</span>
                  <span className={`text-[11px] font-medium ml-1.5 ${scoreBadge.text}`}>
                    • {scoreBadge.label}
                  </span>
                </div>
              </div>

              {/* Data Confidence Pill */}
              <div className="text-right">
                <span className="text-[10px] text-[#868A85] block">Data Quality</span>
                <span className="text-xs font-semibold text-[#161815]">
                  {restaurant.dataConfidenceScore}% Confident
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-5 py-3 bg-[#F5F5F0]/60 border-t border-[#E7E7DE] flex items-center justify-between text-xs text-[#5E635D]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#868A85]" />
          <span>
            {restaurant.lastInspectedAt
              ? `Inspected ${formatDate(restaurant.lastInspectedAt)}`
              : "No formal inspection on file"}
          </span>
        </div>

        <Link
          href={`/restaurants/${restaurant.slug}`}
          className="font-semibold text-xs text-[#143D2B] group-hover:underline flex items-center gap-0.5"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}
