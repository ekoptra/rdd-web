import { RDDCode } from "../types/response.type";

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const mapperRDDCode = (code: RDDCode) => {
  switch (code) {
    case "D00":
      return "Wheel Mark Longitudinal Crack";
    case "D01":
      return "Construction Joint Longitudinal Crack";
    case "D10":
      return "Equal Interval Lateral Crack";
    case "D11":
      return "Construction Joint Lateral Crack";
    case "D20":
      return "Alligator Crack";
    case "D21":
      return "Alligator Crack - Partial Pavement";
    case "D40":
      return "Pothole";
    case "D43":
      return "Crosswalk Blur";
    case "D44":
      return "White Line Blur";
    default:
      return "Others";
  }
};
