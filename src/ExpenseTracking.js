const Airtable  = require("airtable")
const { AirtableRecord } = require('airtable')
const { createBubble } = require("./LineMessageUtility")

const recordExpense= async (amount, category, remarks = "") => {
  const date = new Date()
  // Airtable
  const table = getExpensesTable()
  const record = await table.create(
    {
      Date: date,
      Category: category,
      Amount: amount,
      Remarks: remarks
    },
    { typecast: true }
  )
  const body = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "฿" + amount,
        size: "xxl",
        weight: "bold"
      },
      {
        type: "text",
        text: `${category}\nrecorded`,
        wrap: true
      }
    ],
    action: {
      type: "uri",
      label: "Open Airtable",
      uri: process.env.AIRTABLE_EXPENSE_URI + "/" + record.getId()
    }
  }
  const footer = await getExpensesSummaryData();
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
            align: "end"
          },
          {
            type: "text",
            text: text,
            color: "#8b8685",
            size: "sm",
            align: "end"
          }
        ]
      })),
      action: {
        type: "uri",
        label: "Open Airtable",
        uri: process.env.AIRTABLE_EXPENSE_URI
      }
    }
  })
  return bubble
}

function getExpensesTable() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_EXPENSE_BASE)
    .table("Expense Records")
}

async function getExpensesSummaryData() {
  const date = new Date().toJSON().split("T")[0]
  const tableData = await getExpensesTable()
    .select()
    .all()
  const normalRecords = tableData.filter(r => !r.get("Occasional"))
  const records = AirtableRecord;
  const total = records =>
    records.map(r => +r.get("Amount") || 0).reduce((a, b) => a + b, 0)
  const firstDate = normalRecords
    .map(r => (r.get("Date") ? r.get("Date").split('T')[0] : r.get("Date")))
    .reduce((a, b) => (a < b ? a : b), date)
  const todayUsage = total(normalRecords.filter(r => (r.get("Date") ? r.get("Date").split('T')[0] : r.get("Date")) === date))
  const totalUsage = total(normalRecords)
  const dayNumber =
    Math.round((Date.parse(date) - Date.parse(firstDate)) / 86400e3) + 1
  const [
    pacemakerPerDay,
    pacemakerBase
  ] = process.env.EXPENSE_PACEMAKER.split("/")
  const pacemaker = +pacemakerBase + +pacemakerPerDay * dayNumber - totalUsage
  const $ = v => `฿${v.toFixed(2)}`
  return [
    ["today", $(todayUsage)],
    ["pace", $(pacemaker)],
    ["day", `${dayNumber}`]
  ]
}

const expenseTracking = {
  recordExpense
};

module.exports = expenseTracking;
