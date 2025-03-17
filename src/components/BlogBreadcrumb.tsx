
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogBreadcrumbProps {
  category?: string;
  title?: string;
}

export const BlogBreadcrumb = ({ category, title }: BlogBreadcrumbProps) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        {category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/categories/${category.toLowerCase()}`}>
                  {category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {title && (
          <BreadcrumbItem>
            <BreadcrumbPage>{title.length > 40 ? `${title.substring(0, 40)}...` : title}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
