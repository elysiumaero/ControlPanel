import { RequestHandler } from "express";
import { LocationUpdateRequest, LocationUpdateResponse } from "@shared/api";

export const handleLocationUpdate: RequestHandler = (req, res) => {
  const body = req.body as Partial<LocationUpdateRequest>;
  const lat = typeof body.lat === "number" ? body.lat : undefined;
  const lon = typeof body.lon === "number" ? body.lon : undefined;

  if (lat == null || lon == null || Number.isNaN(lat) || Number.isNaN(lon)) {
    const errorResponse: LocationUpdateResponse = { ok: false, error: "Invalid lat/lon" };
    return res.status(400).json(errorResponse);
  }

  // In a real implementation, you might persist or forward this location.
  const response: LocationUpdateResponse = { ok: true, received: { lat, lon } };
  return res.status(200).json(response);
};
