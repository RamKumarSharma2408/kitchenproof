"use client";

import { useEffect, useState, useMemo } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { DEMO_RESTAURANTS } from "@/lib/demoData";
import { Search, Filter, ShieldCheck, MapPin, SlidersHorizontal, RefreshCw, X } from "lucide-react";

export default function ExplorePage() {
  const [restaurants, setRestaurants] = useState<any[]>(DEMO_RESTAURANTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [minScore, setMinScore] = useState("");
  const [sortBy, setSortBy] = useState("safetyScore");

  const cities = ["ALL", "New Delhi", "Bengaluru", "Mumbai", "Gurugram", "Hyderabad", "Pune"];

  // Instant local filtering so cards render with zero empty flash
  const filteredDemonstrationRestaurants = useMemo(() => {
    return DEMO_RESTAURANTS.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.locality.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.streetAddress.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedCity !== "ALL" && r.city !== selectedCity) {
        return false;
      }

      if (selectedStatus !== "ALL") {
        if (selectedStatus === "VERIFIED" && r.verificationStatus !== "VERIFIED") return false;
        if (selectedStatus === "ACTION_REQUIRED" && r.verificationStatus !== "ACTION_REQUIRED") return false;
        if (selectedStatus === "PENDING_REVIEW" && r.verificationStatus !== "PENDING_REVIEW") return false;
        if (selectedStatus === "EXPIRED" && r.verificationStatus !== "EXPIRED") return false;
        if (selectedStatus === "UNVERIFIED" && r.verificationStatus !== "UNVERIFIED") return false;
      }

      if (minScore) {
        const minVal = parseInt(minScore, 10);
        if (!isNaN(minVal) && r.safetyScore < minVal) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "foodRating") return b.foodRating - a.foodRating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lastInspectedAt") {
        const da = a.lastInspectedAt ? new Date(a.lastInspectedAt).getTime() : 0;
        const db = b.lastInspectedAt ? new Date(b.lastInspectedAt).getTime() : 0;
        return db - da;
      }
      return b.safetyScore - a.safetyScore;
    });
  }, [search, selectedCity, selectedStatus, minScore, sortBy]);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (selectedCity !== "ALL") params.set("city", selectedCity);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (minScore) params.set("minScore", minScore);
      params.set("sortBy", sortBy);

      const res = await fetch(`/api/restaurants?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.restaurants && data.restaurants.length > 0) {
          setRestaurants(data.restaurants);
        } else {
          setRestaurants(filteredDemonstrationRestaurants);
        }
      }
    } catch {
      setRestaurants(filteredDemonstrationRestaurants);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Immediately update local preview
    setRestaurants(filteredDemonstrationRestaurants);
    // Background sync with API
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCity, selectedStatus, minScore, sortBy, filteredDemonstrationRestaurants]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCity("ALL");
    setSelectedStatus("ALL");
    setMinScore("");
    setSortBy("safetyScore");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
          National Restaurant Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] mt-1 tracking-tight">
          Explore Kitchen Safety Audits
        </h1>
        <p className="text-xs sm:text-sm text-[#5E635D] mt-2 max-w-2xl">
          Search cloud kitchens, dine-in restaurants, and bakeries. Inspect verified hygiene evidence, statutory FSSAI compliance, cold-chain monitoring, and sanitation logs before placing your order.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#868A85]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by restaurant name, cuisine (Biryani, South Indian), or locality (Indiranagar, Connaught Place)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B] text-sm text-[#161815] placeholder:text-[#868A85]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-[#868A85] hover:text-[#161815]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* City filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] bg-[#FBFBF9]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Indian Cities" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Verification status filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              Verification Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] bg-[#FBFBF9]"
            >
              <option value="ALL">All Statuses (7 States)</option>
              <option value="VERIFIED">Independently Verified Only</option>
              <option value="PENDING_REVIEW">Pending Verification</option>
              <option value="UPLOADED_UNVERIFIED">Uploaded (Awaiting Audit)</option>
              <option value="ACTION_REQUIRED">Action Required / Rejected</option>
              <option value="EXPIRED">Expired Evidence</option>
              <option value="UNVERIFIED">Self-Reported Claim</option>
            </select>
          </div>

          {/* Safety score filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              Min. Safety Score
            </label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] bg-[#FBFBF9]"
            >
              <option value="">Any Score</option>
              <option value="85">85+ Exemplary Hygiene</option>
              <option value="70">70+ Standard Compliant</option>
              <option value="50">50+ Acceptable</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] bg-[#FBFBF9]"
            >
              <option value="safetyScore">Safety Score (Highest First)</option>
              <option value="foodRating">Food App Rating (Highest First)</option>
              <option value="lastInspectedAt">Most Recently Inspected</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#5E635D]">
        <span>
          Showing <strong>{restaurants.length}</strong> kitchen safety profiles
          {selectedCity !== "ALL" ? ` in ${selectedCity}` : " across India"}
        </span>
        {loading && (
          <span className="flex items-center gap-1.5 text-[#143D2B] font-medium">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Updating profiles...
          </span>
        )}
      </div>

      {/* Grid of Restaurant Cards */}
      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E7E7DE] p-12 text-center max-w-md mx-auto space-y-3">
          <ShieldCheck className="w-10 h-10 text-[#868A85] mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#161815]">No matching kitchens found</h3>
          <p className="text-xs text-[#5E635D]">
            Try adjusting your search terms, selecting &quot;All Cities&quot;, or lowering the minimum safety score filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#143D2B] underline pt-2"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
