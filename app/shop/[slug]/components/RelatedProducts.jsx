import ProductCard from '@/components/ProductCard';

export default function RelatedProducts({ products, currentId }) {
  const filteredProducts = products?.filter((p) => p._id !== currentId).slice(0, 4);

  if (!filteredProducts?.length) return null;

  return (
    <div className="mt-32">
      <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tighter">
        Related <span className="text-primary">Gear</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
}
