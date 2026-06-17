import MfaSettingsClient from "./MfaSettingsClient";

export default function AdminSecurityPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-luxury-50">Security</h1>
        <p className="text-luxury-400 text-sm mt-1">
          Add two-factor authentication for an extra layer of protection on your
          admin account.
        </p>
      </div>

      <MfaSettingsClient />
    </div>
  );
}
