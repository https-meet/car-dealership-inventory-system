export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold">
        Car Dealership Inventory System
      </h1>

      <div className="text-right">
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>

        <p className="text-sm text-gray-500">
          {user.role}
        </p>
      </div>
    </header>
  );
}