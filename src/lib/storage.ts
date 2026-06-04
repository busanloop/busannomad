const DEVICE_ID_KEY = "busannomad-device-id";
const DISPLAY_NAME_KEY = "busannomad-display-name";

/**
 * Stable anonymous device id (capability token for editing your own presence
 * row). Generated once and persisted in localStorage — no login required.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Anonymous handle derived from the device id, e.g. "Nomad-3f9a".
 * Used as the default display name so nomads are distinguishable without
 * having to type anything.
 */
export function getDeviceHandle(): string {
  const id = getDeviceId().replace(/-/g, "");
  return `Nomad-${id.slice(0, 4) || "0000"}`;
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
}

export function setDisplayName(name: string) {
  localStorage.setItem(DISPLAY_NAME_KEY, name.trim());
}
