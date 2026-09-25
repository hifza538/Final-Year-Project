export const searchLocation = async (query) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=pk&q=${encodeURIComponent(query)}`,
    { headers: { "Accept-Language": "en" } }
  );

  if (!response.ok) throw new Error("Location search failed");
  const results = await response.json();
  if (!results.length) throw new Error("Location not found");

  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    label: results[0].display_name,
  };
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const addr = data.address || {};

    return {
      city: addr.city || addr.town || addr.county || "",
      zone: addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || "",
   };
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return { city: "", zone: "" };
  }
};
