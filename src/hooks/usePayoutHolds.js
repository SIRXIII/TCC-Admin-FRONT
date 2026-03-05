import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPayouts,
  getPayoutById,
  releasePayout,
  refundPayout,
  retryTransferPayout,
} from "../services/payoutHoldService";

export const PAYOUT_HOLDS_KEY = "admin-payout-holds";

export function usePayoutHolds(params = {}) {
  return useQuery({
    queryKey: [PAYOUT_HOLDS_KEY, params],
    queryFn: () => getPayouts(params),
    select: (res) => {
      const d = res?.data?.data;
      return {
        payouts: d?.payouts ?? [],
        pagination: d?.pagination ?? {},
      };
    },
  });
}

export function usePayoutHold(id, options = {}) {
  return useQuery({
    queryKey: [PAYOUT_HOLDS_KEY, "detail", id],
    queryFn: () => getPayoutById(id),
    enabled: !!id,
    select: (res) => res?.data?.data ?? null,
    ...options,
  });
}

export function useReleasePayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, force, note }) => releasePayout(id, { force: !!force, note: note || undefined }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY] });
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY, "detail", id] });
    },
  });
}

export function useRefundPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount, reason, note, reverse_transfer }) =>
      refundPayout(id, {
        amount: amount ?? undefined,
        reason: reason ?? undefined,
        note: note ?? undefined,
        reverse_transfer: reverse_transfer !== false,
      }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY] });
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY, "detail", id] });
    },
  });
}

export function useRetryTransferPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => retryTransferPayout(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY] });
      qc.invalidateQueries({ queryKey: [PAYOUT_HOLDS_KEY, "detail", id] });
    },
  });
}
