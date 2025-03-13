
import { Link } from "react-router-dom";
import { Category } from "../types/blog";

interface CategoryListProps {
  categories: Category[];
  activeCategorySlug?: string;
}

export const CategoryList = ({ categories, activeCategorySlug }: CategoryListProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategorySlug
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategorySlug === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
