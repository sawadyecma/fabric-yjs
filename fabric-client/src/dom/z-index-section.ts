export const createZIndexSection = ({
  onSendToFront,
  onSendToBack,
  onSendForward,
  onSendBackward,
}: {
  onSendToFront: () => void;
  onSendToBack: () => void;
  onSendForward: () => void;
  onSendBackward: () => void;
}) => {
  const zIndexSection = document.createElement("div");
  zIndexSection.id = "z-index-section";

  const sendToFrontButton = document.createElement("button");
  sendToFrontButton.id = "send-to-front-button";
  sendToFrontButton.textContent = "Send to Front";
  sendToFrontButton.addEventListener("click", onSendToFront);
  const sendToBackButton = document.createElement("button");
  sendToBackButton.id = "send-to-back-button";
  sendToBackButton.textContent = "Send to Back";
  sendToBackButton.addEventListener("click", onSendToBack);
  const sendForwardButton = document.createElement("button");
  sendForwardButton.id = "send-forward-button";
  sendForwardButton.textContent = "Send Forward";
  sendForwardButton.addEventListener("click", onSendForward);
  const sendBackwardButton = document.createElement("button");
  sendBackwardButton.id = "send-backward-button";
  sendBackwardButton.textContent = "Send Backward";
  sendBackwardButton.addEventListener("click", onSendBackward);

  zIndexSection.appendChild(sendToFrontButton);
  zIndexSection.appendChild(sendToBackButton);
  zIndexSection.appendChild(sendForwardButton);
  zIndexSection.appendChild(sendBackwardButton);

  return zIndexSection;
};
