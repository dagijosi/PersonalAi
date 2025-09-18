// Utility to smoothly scroll to a section by id and update the hash in the URL
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, '', `/#${id}`);
  }
}
