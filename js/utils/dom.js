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
        try {
          dialog.showModal();
        } catch (e) {
          dialog.setAttribute("open", "");
        }
      } else {
        dialog.setAttribute("open", "");
      }
    },
    close: () => {
      if (typeof dialog.close === "function") {
        try {
          dialog.close();
        } catch (e) {
          dialog.removeAttribute("open");
        }
      } else {
        dialog.removeAttribute("open");
      }
    }
  };
}

// Global modal close delegator
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest("[data-close-modal]");
  if (closeBtn) {
    const modalId = closeBtn.getAttribute("data-close-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      if (typeof modal.close === "function") {
        try {
          modal.close();
        } catch (err) {
          modal.removeAttribute("open");
        }
      } else {
        modal.removeAttribute("open");
      }
    }
  }

  // Backdrop click to close native <dialog>
  if (e.target.tagName === "DIALOG") {
    const rect = e.target.getBoundingClientRect();
    const clickedInside = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!clickedInside && typeof e.target.close === "function") {
      try {
        e.target.close();
      } catch (err) {
        e.target.removeAttribute("open");
      }
    }
  }
});
