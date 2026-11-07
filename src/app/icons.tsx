import { Telescope, GraduationCap, Globe, Sun, Orbit, RadioTower, Satellite, Euro, MapPin, Handshake, Eye, Cookie,
  BookOpen, Cpu, Users, CalendarDays, Wrench, FlaskConical, FileText, Rocket, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  telescope: Telescope, graduation: GraduationCap, globe: Globe, sun: Sun, orbit: Orbit,
  radio: RadioTower, satellite: Satellite, euro: Euro, pin: MapPin, handshake: Handshake, eye: Eye, cookie: Cookie,
  book: BookOpen, cpu: Cpu, users: Users, calendar: CalendarDays, wrench: Wrench, flask: FlaskConical, file: FileText, rocket: Rocket,
};
// Icone selezionabili per le sezioni della wiki
export const sectionIcons: [string, string][] = [
  ["book", "Guida"], ["rocket", "Iniziare"], ["radio", "Radio"], ["cpu", "Hardware / software"], ["telescope", "Osservazioni"],
  ["graduation", "Didattica"], ["users", "Persone"], ["calendar", "Eventi"], ["wrench", "Strumenti"], ["flask", "Esperimenti"],
  ["globe", "Territorio"], ["file", "Documenti"],
];

export function Icon({ name, size = 26 }: { name: string; size?: number }) {
  const I = icons[name] ?? Orbit;
  return <I size={size} strokeWidth={1.7} aria-hidden />;
}
