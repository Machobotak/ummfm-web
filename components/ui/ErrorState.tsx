"use client";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-control bg-danger/10 px-4 py-3 text-sm text-danger">
      <p className="font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 min-h-11 rounded-control border border-danger/40 bg-surface px-4 font-semibold text-danger hover:bg-danger/5"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}
