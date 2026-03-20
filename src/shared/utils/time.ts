/**
 * Retorna uma saudação baseada na hora local do dispositivo.
 * @returns "Bom dia" (6h–11h59), "Boa tarde" (12h–17h59) ou "Boa noite" (18h–5h59)
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}
