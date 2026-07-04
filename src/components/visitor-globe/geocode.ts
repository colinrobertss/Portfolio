// City/town search backed by OpenStreetMap's Nominatim (free-tier geocoding,
// no API key). Replaces the old fixed WORLD_CITIES autocomplete list with
// real matches worldwide — see https://operations.osmfoundation.org/policies/nominatim/
// for the usage policy this respects (debounced client, ≤1 req/sec, and the
// attribution rendered alongside results in VisitorGlobe.tsx).
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export interface GeoResult {
  id: string;
  city: string;
  /** May include a state/region for disambiguation, e.g. "Virginia, United States". */
  country: string;
  lat: number;
  lng: number;
}

// `addresstype` is which key in `address` Nominatim considers the actual
// match for this result — far more reliable than `category`/`type`, which
// mark plenty of real towns as "boundary"/"administrative" rather than
// "place" (e.g. Christiansburg, VA comes back as category:"boundary",
// addresstype:"town").
const SETTLEMENT_TYPES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "municipality",
  "suburb",
  "borough",
  "quarter",
  "neighbourhood",
  "isolated_dwelling",
]);

interface NominatimAddress {
  [key: string]: string | undefined;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  addresstype?: string;
  address?: NominatimAddress;
}

export async function searchCities(query: string, signal: AbortSignal): Promise<GeoResult[]> {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "10");
  url.searchParams.set("accept-language", "en");
  url.searchParams.set("featureType", "settlement");

  const res = await fetch(url.toString(), { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`geocoding request failed (${res.status})`);
  const data = (await res.json()) as NominatimResult[];

  const seen = new Set<string>();
  const results: GeoResult[] = [];
  for (const r of data) {
    if (!r.addresstype || !SETTLEMENT_TYPES.has(r.addresstype)) continue;
    const a = r.address ?? {};
    const city =
      a[r.addresstype] || a.city || a.town || a.village || a.hamlet || a.municipality || a.suburb || r.display_name.split(",")[0];
    const region = a.state || a.county || "";
    const countryName = a.country || "";
    // Same-named settlements in different states/countries are common
    // (Christiansburg, VA vs. OH vs. IN) — key on region too so they don't
    // collapse into one result, and surface the region in the label so
    // users can tell them apart.
    const key = `${city.toLowerCase()}|${region.toLowerCase()}|${countryName.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const country = [region, countryName].filter(Boolean).join(", ");
    results.push({ id: String(r.place_id), city, country, lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
  }
  return results;
}
