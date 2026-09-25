//admin-frontend/src/components/categories/CategoryThumb.jsx

// Cuisine image, or a coloured tile with the first letter for cuisines without an image
const CuisineThumb = ({ cuisine, size = "w-12 h-12" }) => {
  if (cuisine.image?.url) {
    return (
      <img
        src={cuisine.image.url}
        alt={cuisine.name}
        className={`${size} rounded-lg object-cover shrink-0 border border-gray-100`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-lg bg-primary/10 text-primary font-semibold flex items-center
        justify-center shrink-0`}
      aria-hidden="true"
    >
      {cuisine.name?.charAt(0).toUpperCase()}
    </div>
  );
};

export default CuisineThumb;