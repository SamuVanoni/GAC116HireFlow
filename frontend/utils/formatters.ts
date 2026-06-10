export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function splitRequirements(requirements: string) {
  return requirements
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
