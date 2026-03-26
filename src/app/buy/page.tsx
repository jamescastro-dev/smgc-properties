import { redirect } from "next/navigation";

export default function BuyPage() {
  redirect("/properties?listing=For+Sale");
}