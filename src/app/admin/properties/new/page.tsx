import PropertyForm from "../PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-luxury-50">
          Add New Property
        </h1>
        <p className="text-luxury-400 text-sm mt-1">
          Fill in the details below to add a new listing.
        </p>
      </div>
      <PropertyForm />
    </div>
  );
}