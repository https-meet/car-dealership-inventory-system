interface BadgeProps {
  quantity: number;
}

export default function StockBadge({ quantity }: BadgeProps) {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    );
  }

  if (quantity <= 5) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      In Stock
    </span>
  );
}
