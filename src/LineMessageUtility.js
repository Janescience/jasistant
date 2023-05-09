export function toMessages(data) {
  if (!data) data = "..."
  if (typeof data === "string") data = [{ type: "text", text: data }]
  return data
}

export function createBubble(
  title,
  text,
  {
    headerBackground = "#353433",
    headerColor = "#d7fc70",
    textSize = "xl",
    altText = String(text),
    footer
  } = {}
) {
  const data = {
    type: "bubble",
    styles: {
      header: { backgroundColor: headerBackground }
    },
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: title, color: headerColor, weight: "bold" }
      ]
    },
    body:
      typeof text === "string"
        ? {
            type: "box",
            layout: "vertical",
            contents: [{ type: "text", text: text, wrap: true, size: textSize }]
          }
        : text
  }
  if (footer) {
    data.styles.footer = { backgroundColor: "#e9e8e7" }
    data.footer =
      typeof footer === "string"
        ? {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: footer,
                wrap: true,
                size: "sm",
                color: "#8b8685"
              }
            ]
          }
        : footer
  }
  return {
    type: "flex",
    altText: truncate(`[${title}] ${altText}`, 400),
    contents: data
  }
}

function truncate(text, maxLength) {
  return text.length + 5 > maxLength
    ? text.substr(0, maxLength - 5) + "…"
    : text
}