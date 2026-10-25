// DOM Helpers and Accessible Toast / Dialog Utilities
// Adhering to Modern Web Guidance (Native Dialogs & ARIA)

export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.role = "status";
  
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, duration);
}

// Dialog helper for native <dialog>
export function setupModal(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return null;

  return {
    dialog,
    show: () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    },
    close: () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }
  };
}
