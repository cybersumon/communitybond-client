
/**
 * ModalCatchAll
 *
 * PURPOSE:
 * Clear the active popup when navigating to a route
 * that should not display an event modal.
 *
 * WHY:
 * Next.js Parallel Routes can preserve the previously
 * active slot during client-side navigation.
 *
 * HOW:
 * This catch-all route matches other navigations
 * inside the modal slot and renders nothing.
 */
export default function ModalCatchAll() {
  return null;
}
