import { FrontendTemplate } from "../config/constants";

/**
 * Get the effective template based on contract type
 * RUM contracts always use mobile template
 */
export function getEffectiveTemplate(
  contractType: "usermap" | "rum" | undefined,
  userSelectedTemplate: FrontendTemplate
): FrontendTemplate {
  if (contractType === "rum") {
    return "mobile" as FrontendTemplate;
  }
  return userSelectedTemplate;
}