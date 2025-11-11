export default function MenuItem({ item, onAddToCart }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="mb-1 font-medium">{item.name}</h3>
        <p className="mb-3 text-sm text-gray-600">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600">
            Rp {item.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}