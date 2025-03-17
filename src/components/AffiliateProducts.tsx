
import { AffiliateLink } from "@/types/blog";

interface AffiliateProductsProps {
  links: AffiliateLink[];
  category?: string;
}

// This component is intentionally empty as per user request to remove recommended products
export const AffiliateProducts = ({ links, category }: AffiliateProductsProps) => {
  return null;
};
