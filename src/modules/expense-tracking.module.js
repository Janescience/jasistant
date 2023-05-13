const Airtable = require("airtable");
const { AirtableRecord } = require("airtable");
const { createBubble } = require("../utilities/line.utility");

const expenseTracking = async (name, amount, category) => {
  const date = new Date();
  // Airtable
  const table = expenseTable();
  const record = await table.create(
    {
      Name: name.trim(),
      Date: date,
      Category: category,
      Amount: amount,
    },
    { typecast: true }
  );
  const body = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "฿" + amount,
        size: "xxl",
        weight: "bold",
      },
      {
        type: "text",
        text: `${category}${name ? "/" + name.trim() : ""}\nrecorded`,
        wrap: true,
      },
    ],
    action: {
      type: "uri",
      label: "Open Airtable",
      uri: process.env.AIRTABLE_EXPENSE_URI + "/" + record.getId(),
    },
  };
  const footer = await summary();
  const bubble = createBubble("Expense Tracking", body, {
    headerColor: "#ffffbb",
    footer: {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: footer.map(([label, text]) => ({
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: label,
            color: "#8b8685",
            size: "xs",
            align: "end",
          },
          {
            type: "text",
            text: text,
            color: "#8b8685",
            size: "sm",
            align: "end",
          },
        ],
      })),
      action: {
        type: "uri",
        label: "Open Airtable",
        uri: process.env.AIRTABLE_EXPENSE_URI,
      },
    },
  });
  return bubble;
};

const expenseTable = () => {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_EXPENSE_BASE)
    .table("Expense Records");
};

const summary = async () => {
  const date = new Date().toJSON().split("T")[0];
  const tableData = await expenseTable().select().all();
  const normalRecords = tableData.filter((r) => !r.get("Occasional"));
  const records = AirtableRecord;
  const total = (records) =>
    records.map((r) => +r.get("Amount") || 0).reduce((a, b) => a + b, 0);
  const firstDate = normalRecords
    .map((r) => (r.get("Date") ? r.get("Date").split("T")[0] : r.get("Date")))
    .reduce((a, b) => (a < b ? a : b), date);
  const todayUsage = total(
    normalRecords.filter(
      (r) =>
        (r.get("Date") ? r.get("Date").split("T")[0] : r.get("Date")) === date
    )
  );
  const totalUsage = total(normalRecords);
  const dayNumber =
    Math.round((Date.parse(date) - Date.parse(firstDate)) / 86400e3) + 1;
  const [pacemakerPerDay, pacemakerBase] =
    process.env.EXPENSE_PACEMAKER.split("/");
  const pacemaker = +pacemakerBase + +pacemakerPerDay * dayNumber - totalUsage;
  const $ = (v) => `฿${v.toFixed(2)}`;

  return [
    ["today", $(todayUsage)], //รายจ่ายรวมทั้งหมดของวันนี้
    ["pace", $(pacemaker)], //งบทั้งหมดที่มี
    ["day", `${dayNumber}`], //รวมแล้วมีการบันทึกรายจ่ายทั้งหมดกี่วัน
  ];
};

module.exports = expenseTracking;