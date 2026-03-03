import React, { useState } from "react";
import {
  createPartnerConnectAccount,
  createPartnerAccountLink,
  getPartnerConnectStatus,
} from "../../../services/stripeService";

/**
 * PartnerStripeConnect
 *
 * Displayed as the "Stripe" tab inside the partner profile.
 * Shows current Stripe Connect status and provides action buttons for:
 *   – Creating a connected account
 *   – Opening the hosted onboarding link
 *   – Refreshing account status from Stripe
 */
const PartnerStripeConnect = ({ partner, onStatusRefreshed }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [onboardingUrl, setOnboardingUrl] = useState("");

  const hasAccount = !!partner?.stripe_connected_account_id;

  const handleCreateAccount = async () => {
    setLoading("create");
    setError("");
    try {
      const res = await createPartnerConnectAccount(partner.id);
      onStatusRefreshed?.();
      alert(`✓ Stripe account created: ${res.data.data.stripe_account_id}`);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      setError(msg.includes("not enabled") ? "Stripe Connect is not yet enabled on this server." : msg);
    } finally {
      setLoading("");
    }
  };

  const handleOnboardingLink = async () => {
    setLoading("link");
    setError("");
    setOnboardingUrl("");
    try {
      const res = await createPartnerAccountLink(partner.id);
      const url = res.data.data.url;
      setOnboardingUrl(url);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading("");
    }
  };

  const handleRefreshStatus = async () => {
    setLoading("status");
    setError("");
    try {
      const res = await getPartnerConnectStatus(partner.id);
      setStatus(res.data.data);
      onStatusRefreshed?.();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading("");
    }
  };

  const liveStatus = status || {
    stripe_account_id:  partner?.stripe_connected_account_id || null,
    charges_enabled:    partner?.charges_enabled,
    payouts_enabled:    partner?.payouts_enabled,
    details_submitted:  partner?.details_submitted,
    requirements_due:   partner?.requirements_due || [],
    onboarding_complete: partner?.charges_enabled && partner?.payouts_enabled,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status Card */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[#232323]">Stripe Connect Status</h3>

        {liveStatus.stripe_account_id ? (
          <>
            <div className="flex flex-wrap gap-4 text-sm">
              <StatusBadge label="Account ID" value={liveStatus.stripe_account_id} mono />
              <StatusBadge label="Charges" enabled={liveStatus.charges_enabled} />
              <StatusBadge label="Payouts"  enabled={liveStatus.payouts_enabled} />
              <StatusBadge label="KYC"      enabled={liveStatus.details_submitted} trueText="Submitted" falseText="Pending" />
            </div>

            {liveStatus.onboarding_complete ? (
              <p className="text-green-600 text-sm font-medium">✓ Onboarding complete – partner can receive payouts.</p>
            ) : (
              <p className="text-amber-600 text-sm font-medium">⚠ Onboarding incomplete – partner cannot receive payouts yet.</p>
            )}

            {Array.isArray(liveStatus.requirements_due) && liveStatus.requirements_due.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">Requirements due:</p>
                <ul className="list-disc list-inside text-xs text-amber-700 space-y-0.5">
                  {liveStatus.requirements_due.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-[#9A9A9A]">No Stripe account connected yet.</p>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}
      </div>

      {/* Actions Card */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[#232323]">Actions</h3>

        <div className="flex flex-wrap gap-3">
          {!hasAccount && (
            <ActionButton
              label="Create Stripe Account"
              loading={loading === "create"}
              onClick={handleCreateAccount}
              variant="primary"
            />
          )}

          {hasAccount && (
            <ActionButton
              label="Open Onboarding Link"
              loading={loading === "link"}
              onClick={handleOnboardingLink}
              variant="secondary"
            />
          )}

          {hasAccount && (
            <ActionButton
              label="Refresh Status"
              loading={loading === "status"}
              onClick={handleRefreshStatus}
              variant="outline"
            />
          )}
        </div>

        {onboardingUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-800 mb-2 font-semibold">Onboarding link generated (share with partner):</p>
            <a
              href={onboardingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline break-all"
            >
              {onboardingUrl}
            </a>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(onboardingUrl); }}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Copy Link
              </button>
              <a
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition"
              >
                Open in Tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatusBadge = ({ label, value, enabled, mono, trueText = "Enabled", falseText = "Disabled" }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-[#9A9A9A]">{label}</span>
    {value !== undefined ? (
      <span className={`text-xs font-medium ${mono ? "font-mono text-[#232323]" : ""}`}>{value}</span>
    ) : (
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
        }`}
      >
        {enabled ? trueText : falseText}
      </span>
    )}
  </div>
);

const ActionButton = ({ label, loading, onClick, variant = "primary" }) => {
  const base = "px-4 py-2 text-sm rounded-lg font-medium transition disabled:opacity-50";
  const variants = {
    primary:   "bg-[#F77F00] text-white hover:bg-orange-600",
    secondary: "bg-[#FEF2E6] text-[#F77F00] border border-[#F77F00] hover:bg-[#F77F00] hover:text-white",
    outline:   "bg-white text-[#232323] border border-[#D9D9D9] hover:bg-gray-50",
  };
  return (
    <button
      onClick={onClick}
      disabled={!!loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {label}...
        </span>
      ) : label}
    </button>
  );
};

export default PartnerStripeConnect;
