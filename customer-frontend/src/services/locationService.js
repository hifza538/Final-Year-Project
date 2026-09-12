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
