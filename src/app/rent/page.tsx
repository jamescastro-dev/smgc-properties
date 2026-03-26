import { redirect } from "next/navigation";

export default function RentPage() {
  redirect("/properties?listing=For+Rent");
}