export function initialiseLayoutManager() {
  const workspaceGrid =
    document.getElementById("workspaceGrid");

  const panelLockBtn =
    document.getElementById("panelLockBtn");

  let isLocked = true;

  function updateLockState() {
    workspaceGrid.classList.toggle(
      "panels-locked",
      isLocked
    );

    workspaceGrid.classList.toggle(
      "panels-unlocked",
      !isLocked
    );

    panelLockBtn.textContent = isLocked
      ? "🔒 Panels Locked"
      : "🔓 Panels Unlocked";

    panelLockBtn.setAttribute(
      "aria-pressed",
      String(isLocked)
    );
  }

  panelLockBtn.addEventListener("click", () => {
    isLocked = !isLocked;
    updateLockState();
  });

  updateLockState();

  return {
    isLocked: () => isLocked
  };
}