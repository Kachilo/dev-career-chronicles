
import { AffiliateLink } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface AffiliateProductsProps {
  links: AffiliateLink[];
  category?: string;
}

// This component is intentionally empty as per user request to remove recommended products
export const AffiliateProducts = ({ links, category }: AffiliateProductsProps) => {
  return null;
};
