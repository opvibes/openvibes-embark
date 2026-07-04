import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { useInView } from "../../lib/useInView";

const DRACULA = {
  bg: "#282a36",
  fg: "#f8f8f2",
  comment: "#6272a4",
  keyword: "#ff79c6",
  type: "#8be9fd",
  fn: "#50fa7b",
  number: "#bd93f9",
  string: "#f1fa8c",
};

const KEYWORDS = new Set([
  "public", "class", "double", "int", "for", "return", "function", "const", "new", "void", "protected",
  "extends", "import", "export", "if",
]);
const TYPES = new Set([
  "CheckoutServlet", "HttpServlet", "HttpServletRequest", "HttpServletResponse", "Props",
  "CheckoutSummary", "LineItem", "Row", "Field", "Warning",
  "DashboardServlet", "CustomerServlet", "InventoryServlet", "ReportServlet", "SettingsServlet",
  "Customer", "Sku", "StatCard", "DonutChart", "Table", "BarChart", "Form",
  "Dashboard", "CustomerList", "InventoryList", "Reports", "Settings",
]);

function highlightLine(line: string) {
  const commentIdx = line.indexOf("//");
  const codePart = commentIdx === -1 ? line : line.slice(0, commentIdx);
  const commentPart = commentIdx === -1 ? "" : line.slice(commentIdx);
  const tokens = codePart.split(/(\s+|[(){}.,;:+*=><]|"[^"]*")/g).filter((t) => t !== "");

  return (
    <>
      {tokens.map((tok, i) => {
        let color = DRACULA.fg;
        const nextTok = tokens[i + 1];
        if (/^\s+$/.test(tok)) color = DRACULA.fg;
        else if (KEYWORDS.has(tok)) color = DRACULA.keyword;
        else if (TYPES.has(tok)) color = DRACULA.type;
        else if (/^"[^"]*"$/.test(tok)) color = DRACULA.string;
        else if (/^\d+(\.\d+)?$/.test(tok)) color = DRACULA.number;
        else if (/^[(){}.,;:+*=>]$/.test(tok)) color = DRACULA.keyword;
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tok) && nextTok === "(") color = DRACULA.fn;
        return (
          <span key={i} style={{ color }}>
            {tok}
          </span>
        );
      })}
      {commentPart && <span style={{ color: DRACULA.comment, fontStyle: "italic" }}>{commentPart}</span>}
    </>
  );
}

interface PageCode {
  filename: string;
  badge: string;
  badgeColor: string;
  lines: string[];
}

const LEGACY_PAGES: Record<string, PageCode> = {
  Orders: {
    filename: "CheckoutServlet.java",
    badge: "− rounds twice",
    badgeColor: "#ff5555",
    lines: [
      "public class CheckoutServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      '    out.println("<div>Order #4471</div>");',
      '    out.println("<tr><td>Customer</td>");',
      '    out.println("<td>A. Ferreira</td></tr>");',
      '    out.println("<tr><td>Cost Center</td>");',
      '    out.println("<td>CC-104</td></tr>");',
      "    if (!glAccount.matches(costCenter.approvedGL())) {",
      '      out.println("<div class=warn>GL mismatch</div>");',
      "    }",
      '    out.println("<tr><td>Widget</td><td>2</td>");',
      '    out.println("<td>119.90</td></tr>");',
      '    out.println("<tr><td colspan=2>Tax</td>");',
      '    out.println("<td>10.00</td></tr>");',
      "    double total = round2(round2(119.90) + 10.00);",
      '    out.println("<div>Total: $" + total + "</div>");',
      '    out.println("<button>Submit</button>");',
      "    // legacy bug: rounds twice",
      "  }",
      "}",
    ],
  },
  Dashboard: {
    filename: "DashboardServlet.java",
    badge: "− static numbers only",
    badgeColor: "#ff5555",
    lines: [
      "public class DashboardServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      '    out.println("<td>Open Orders</td><td>12</td>");',
      '    out.println("<td>Revenue MTD</td>");',
      '    out.println("<td>48204</td>");',
      '    out.println("<td>Pending</td><td>3</td>");',
      '    out.println("<td>Avg Order</td><td>612</td>");',
      "    // no chart, plain numbers only",
      "  }",
      "}",
    ],
  },
  Customers: {
    filename: "CustomerServlet.java",
    badge: "− full page reload",
    badgeColor: "#ff5555",
    lines: [
      "public class CustomerServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      '    List<Customer> rows = db.query("SELECT *");',
      '    out.println("<tr><td>Name</td>");',
      '    out.println("<td>Email</td></tr>");',
      "    for (Customer c : rows) {",
      '      out.println("<tr><td>" + c.name + "</td>");',
      '      out.println("<td>" + c.email + "</td></tr>");',
      "    }",
      "  }",
      "}",
    ],
  },
  Inventory: {
    filename: "InventoryServlet.java",
    badge: "− full page reload",
    badgeColor: "#ff5555",
    lines: [
      "public class InventoryServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      '    List<Sku> rows = db.query("SELECT * FROM stock");',
      '    out.println("<tr><td>SKU</td>");',
      '    out.println("<td>Stock</td></tr>");',
      "    for (Sku s : rows) {",
      '      out.println("<tr><td>" + s.code + "</td>");',
      '      out.println("<td>" + s.stock + "</td></tr>");',
      "    }",
      "  }",
      "}",
    ],
  },
  Reports: {
    filename: "ReportServlet.java",
    badge: "− no chart lib",
    badgeColor: "#ff5555",
    lines: [
      "public class ReportServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      "    int[] weekly = reportDao.ordersPerWeek();",
      "    for (int n : weekly) {",
      '      out.println("<div style=\'height:" + n + "px\'>");',
      '      out.println("</div>");',
      "    }",
      "    // ASCII bars only, no real chart",
      "  }",
      "}",
    ],
  },
  Settings: {
    filename: "SettingsServlet.java",
    badge: "− flat file config",
    badgeColor: "#ff5555",
    lines: [
      "public class SettingsServlet extends HttpServlet {",
      "  protected void doGet(HttpServletRequest req,",
      "      HttpServletResponse res) {",
      '    Properties p = config.load("app.properties");',
      '    out.println("<tr><td>Company</td>");',
      '    out.println("<td>" + p.get("company") + "</td></tr>");',
      '    out.println("<tr><td>Currency</td>");',
      '    out.println("<td>" + p.get("currency") + "</td></tr>");',
      "  }",
      "}",
    ],
  },
};

const NEW_PAGES: Record<string, PageCode> = {
  Orders: {
    filename: "CheckoutSummary.tsx",
    badge: "+ rounds once",
    badgeColor: "#50fa7b",
    lines: [
      "export function CheckoutSummary({ order }: Props) {",
      "  const total = round2(order.subtotal + order.tax);",
      "  const glOk = validateGL(order.costCenter,",
      "    order.glAccount);",
      "  return (",
      "    <div className=\"card\">",
      "      <span className=\"eyebrow\">Order #{order.id}</span>",
      "      <Field label=\"Customer\" value={order.customer} />",
      "      <Field label=\"Cost center\"",
      "        value={order.costCenter} />",
      "      {!glOk && <Warning>GL mismatch</Warning>}",
      "      <LineItem label={order.item.name}",
      "        qty={order.item.qty} price={order.item.price} />",
      "      <Row label=\"Tax\" value={order.tax} />",
      "      <Row label=\"Total\" value={total} bold />",
      "      <button className=\"confirm\">Confirm order</button>",
      "    </div>",
      "  ); // rounds once",
      "}",
    ],
  },
  Dashboard: {
    filename: "Dashboard.tsx",
    badge: "+ animated donut chart",
    badgeColor: "#50fa7b",
    lines: [
      "export function Dashboard({ stats }: Props) {",
      "  return (",
      "    <div className=\"grid\">",
      "      {stats.map((s) => (",
      "        <StatCard key={s.label} {...s} />",
      "      ))}",
      "      <DonutChart data={orderStatusBreakdown}",
      "        animated />",
      "    </div>",
      "  );",
      "}",
    ],
  },
  Customers: {
    filename: "CustomerList.tsx",
    badge: "+ client-side table",
    badgeColor: "#50fa7b",
    lines: [
      "export function CustomerList({ rows }: Props) {",
      "  return (",
      "    <Table",
      "      head={[\"Name\", \"Email\", \"Orders\"]}",
      "      rows={rows.map((c) =>",
      "        [c.name, c.email, c.orders])}",
      "    />",
      "  );",
      "}",
    ],
  },
  Inventory: {
    filename: "InventoryList.tsx",
    badge: "+ client-side table",
    badgeColor: "#50fa7b",
    lines: [
      "export function InventoryList({ rows }: Props) {",
      "  return (",
      "    <Table",
      "      head={[\"SKU\", \"Name\", \"Stock\"]}",
      "      rows={rows.map((s) =>",
      "        [s.sku, s.name, s.stock])}",
      "    />",
      "  );",
      "}",
    ],
  },
  Reports: {
    filename: "Reports.tsx",
    badge: "+ animated bar chart",
    badgeColor: "#50fa7b",
    lines: [
      "export function Reports({ weekly }: Props) {",
      "  return (",
      "    <BarChart data={weekly} animated",
      '      gradient="from-violet-600 to-indigo-400" />',
      "  );",
      "}",
    ],
  },
  Settings: {
    filename: "Settings.tsx",
    badge: "+ typed settings form",
    badgeColor: "#50fa7b",
    lines: [
      "export function Settings({ config }: Props) {",
      "  return (",
      "    <Form>",
      '      <Field label="Company" value={config.company} />',
      '      <Field label="Currency" value={config.currency} />',
      '      <Field label="Timezone"',
      "        value={config.timezone} />",
      "    </Form>",
      "  );",
      "}",
    ],
  },
};

const LINE_REVEAL_MS = 90;

function useLineReveal(totalLines: number, active: boolean, startDelayMs: number, resetKey: string) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!active) return;
    setRevealed(0);
    let line = 0;
    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        line += 1;
        setRevealed(line);
        if (line >= totalLines) clearInterval(interval);
      }, LINE_REVEAL_MS);
    }, startDelayMs);
    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [active, totalLines, startDelayMs, resetKey]);

  return revealed;
}

function CodeEditor({
  filename,
  lines,
  badge,
  badgeColor,
  revealed,
}: {
  filename: string;
  lines: string[];
  badge: string;
  badgeColor: string;
  revealed: number;
}) {
  const visibleLines = lines.slice(0, revealed);
  const typing = revealed > 0 && revealed < lines.length;

  return (
    <div className="shadow-2xl h-[560px] flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: DRACULA.bg }}>
      <div className="flex items-center border-b border-black/30 shrink-0">
        <div className="px-4 py-2.5 text-[12px] font-mono border-r border-black/30" style={{ color: DRACULA.fg, backgroundColor: "#21222c" }}>
          {filename}
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex flex-1 min-h-0 overflow-x-auto">
        <div className="select-none text-right px-3 py-4 font-mono text-[12px] leading-[1.7]" style={{ color: DRACULA.comment }}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 px-2 py-4 font-mono text-[12px] leading-[1.7] whitespace-pre">
          {visibleLines.map((line, i) => (
            <div key={i}>
              {highlightLine(line) || " "}
              {typing && i === visibleLines.length - 1 && (
                <span className="inline-block w-[7px] h-[13px] -mb-[2px] ml-[1px] bg-[#f8f8f2] animate-pulse" />
              )}
            </div>
          ))}
        </pre>
      </div>
      <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-wide border-t border-black/30 shrink-0" style={{ color: badgeColor, backgroundColor: "#21222c" }}>
        {badge}
      </div>
    </div>
  );
}

const LEGACY_NAV = ["Dashboard", "Orders", "Customers", "Inventory", "Reports", "Settings"];

const LEGACY_STATS = [
  ["Open Orders", "12"],
  ["Revenue MTD", "$48,204"],
  ["Pending Approvals", "3"],
  ["Avg Order", "$612"],
];

const LEGACY_CUSTOMERS = [
  ["A. Ferreira", "a.f@corp.com", "14"],
  ["R. Souza", "r.souza@corp.com", "9"],
  ["M. Lima", "m.lima@corp.com", "22"],
];

const LEGACY_INVENTORY = [
  ["WGT-001", "Widget", "184"],
  ["WGT-002", "Widget Pro", "42"],
  ["BRK-010", "Bracket", "310"],
];

const LEGACY_REPORT_BARS = [40, 65, 50, 80, 60, 90];

function LegacyDashboard() {
  return (
    <div className="grid grid-cols-2 gap-2" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
      {LEGACY_STATS.map(([label, value]) => (
        <div key={label} className="border-2 bg-[#d4d0c8] p-2.5" style={{ borderColor: "#fff #404040 #404040 #fff" }}>
          <div className="text-[10px] text-[#404040]">{label}</div>
          <div className="text-[16px] text-black font-bold">{value}</div>
        </div>
      ))}
    </div>
  );
}

function LegacyTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-[11px] text-black border-collapse" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
      <tbody>
        <tr>
          {head.map((h) => (
            <td key={h} className="border border-[#808080] px-1.5 py-1 bg-white font-bold">
              {h}
            </td>
          ))}
        </tr>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell, i) => (
              <td key={i} className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LegacyReports() {
  return (
    <div className="flex items-end gap-2 h-[120px]" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
      {LEGACY_REPORT_BARS.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-[#000080] border-2"
          style={{ height: `${h}%`, borderColor: "#1084d0 #000050 #000050 #1084d0" }}
        />
      ))}
    </div>
  );
}

function LegacySettings() {
  return (
    <table className="w-full text-[11px] text-black border-collapse" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
      <tbody>
        {[
          ["Company", "Acme Corp"],
          ["Currency", "USD"],
          ["Timezone", "UTC-3"],
        ].map(([label, value]) => (
          <tr key={label}>
            <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold w-[90px]">{label}</td>
            <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface SystemPageProps {
  page: string;
  onNavigate: (page: string) => void;
}

function LegacyUI({ page, onNavigate }: SystemPageProps) {
  return (
    <div
      className="w-full h-full bg-[#d4d0c8] border-2 border-[#808080] flex flex-col"
      style={{ boxShadow: "inset -2px -2px 0 #404040, inset 2px 2px 0 #fff" }}
    >
      <div
        className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white text-[13px] px-3 py-1.5 flex items-center justify-between shrink-0"
        style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
      >
        <span>CheckoutApp v1.2 · Order Management</span>
        <span className="flex gap-1">
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">_</span>
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">□</span>
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">×</span>
        </span>
      </div>
      <div className="text-[11px] text-black px-3 py-1 border-b border-[#808080] shrink-0" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        File &nbsp; Edit &nbsp; View &nbsp; Orders &nbsp; Help
      </div>
      <div className="flex flex-1 min-h-0">
        <div
          className="w-[120px] shrink-0 border-r border-[#808080] py-2"
          style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
        >
          {LEGACY_NAV.map((item) => (
            <div
              key={item}
              onClick={() => onNavigate(item)}
              className={`text-[11px] px-3 py-1.5 cursor-pointer ${
                item === page ? "bg-[#000080] text-white font-bold" : "text-black hover:bg-[#c4c0b8]"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        {page === "Dashboard" && (
          <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
            <div className="text-[14px] text-black mb-3">Dashboard</div>
            <LegacyDashboard />
          </div>
        )}
        {page === "Customers" && (
          <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
            <div className="text-[14px] text-black mb-3">Customers</div>
            <LegacyTable head={["Name", "Email", "Orders"]} rows={LEGACY_CUSTOMERS} />
          </div>
        )}
        {page === "Inventory" && (
          <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
            <div className="text-[14px] text-black mb-3">Inventory</div>
            <LegacyTable head={["SKU", "Name", "Stock"]} rows={LEGACY_INVENTORY} />
          </div>
        )}
        {page === "Reports" && (
          <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
            <div className="text-[14px] text-black mb-3">Reports · Orders / week</div>
            <LegacyReports />
          </div>
        )}
        {page === "Settings" && (
          <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
            <div className="text-[14px] text-black mb-3">Settings</div>
            <LegacySettings />
          </div>
        )}
        {page === "Orders" && (
        <div className="p-4 flex-1 overflow-y-auto" style={{ fontFamily: "Times New Roman, serif" }}>
          <div className="text-[10px] text-[#404040] mb-2" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
            Orders &gt; #4471
          </div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[14px] text-black">Order #4471</div>
            <span
              className="text-[10px] px-2 py-0.5 bg-[#ffffcc] border border-[#808080] text-black"
              style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
            >
              PENDING
            </span>
          </div>

          <table className="w-full text-[11px] text-black mb-2 border-collapse" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
            <tbody>
              <tr>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold w-[78px]">Customer</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">A. Ferreira</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold w-[60px]">E-mail</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">a.f@corp.com</td>
              </tr>
              <tr>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold">Cost center</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">CC-104 · Mktg</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold">GL acct</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">6021-Supplies</td>
              </tr>
              <tr>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold">Payment</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">Corp card •4471</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-white font-bold">Due</td>
                <td className="border border-[#808080] px-1.5 py-1 bg-[#f4f2ee]">2026-07-15</td>
              </tr>
            </tbody>
          </table>
          <div
            className="text-[10px] text-[#804000] mb-2 px-1.5 py-1 bg-[#ffffcc] border border-[#808080]"
            style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
          >
            ⚠ GL account must match the cost center's approved mapping
          </div>

          <table className="w-full text-[12px] text-black mb-2 border-collapse">
            <tbody>
              <tr>
                <td className="border border-[#808080] px-2 py-1 bg-white font-bold">Item</td>
                <td className="border border-[#808080] px-2 py-1 bg-white font-bold text-right">Qty</td>
                <td className="border border-[#808080] px-2 py-1 bg-white font-bold text-right">Price</td>
              </tr>
              <tr>
                <td className="border border-[#808080] px-2 py-1 bg-[#f4f2ee]">Widget</td>
                <td className="border border-[#808080] px-2 py-1 bg-[#f4f2ee] text-right">2</td>
                <td className="border border-[#808080] px-2 py-1 bg-[#f4f2ee] text-right">119.90</td>
              </tr>
              <tr>
                <td className="border border-[#808080] px-2 py-1 bg-[#f4f2ee]" colSpan={2}>Tax</td>
                <td className="border border-[#808080] px-2 py-1 bg-[#f4f2ee] text-right">10.00</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between text-[14px] text-black mb-3">
            <span>Total:</span>
            <span className="font-bold">$129.90</span>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-[#d4d0c8] border-2 px-4 py-1 text-[12px] text-black"
              style={{ borderColor: "#fff #404040 #404040 #fff", fontFamily: "Tahoma, Arial, sans-serif" }}
            >
              Save draft
            </button>
            <button
              className="bg-[#d4d0c8] border-2 px-4 py-1 text-[12px] text-black font-bold"
              style={{ borderColor: "#fff #404040 #404040 #fff", fontFamily: "Tahoma, Arial, sans-serif" }}
            >
              Submit
            </button>
          </div>
        </div>
        )}
      </div>
      <div
        className="text-[10px] text-black px-2 py-1 border-t border-[#808080] shrink-0"
        style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
      >
        Connected to ORDERS_DB · Ready
      </div>
    </div>
  );
}

const NEW_NAV = [
  { label: "Dashboard", icon: "▤" },
  { label: "Orders", icon: "▥" },
  { label: "Customers", icon: "◔" },
  { label: "Inventory", icon: "◈" },
  { label: "Reports", icon: "▦" },
  { label: "Settings", icon: "⚙" },
];

const NEW_SCROLL = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-violet-400 [&::-webkit-scrollbar-thumb]:rounded-full";
const NEW_SCROLL_STYLE = { scrollbarColor: "#a78bfa transparent", scrollbarWidth: "thin" as const };

const NEW_STATS = [
  { label: "Open Orders", value: "12", delta: "+3", trend: "up" as const },
  { label: "Revenue MTD", value: "$48,204", delta: "+18%", trend: "up" as const },
  { label: "Pending Approvals", value: "3", delta: "-2", trend: "down" as const },
  { label: "Avg Order", value: "$612", delta: "+4%", trend: "up" as const },
];

const NEW_DONUT_SEGMENTS = [
  { label: "Approved", value: 62, color: "#7c3aed" },
  { label: "Pending", value: 25, color: "#6366f1" },
  { label: "Rejected", value: 13, color: "#cbd5e1" },
];

const NEW_CUSTOMERS = [
  ["A. Ferreira", "a.f@corp.com", "14"],
  ["R. Souza", "r.souza@corp.com", "9"],
  ["M. Lima", "m.lima@corp.com", "22"],
];

const NEW_PRODUCTS = [
  ["WGT-001", "Widget", "184"],
  ["WGT-002", "Widget Pro", "42"],
  ["BRK-010", "Bracket", "310"],
];

const NEW_REPORT_BARS = [
  { label: "Mon", value: 8 },
  { label: "Tue", value: 13 },
  { label: "Wed", value: 10 },
  { label: "Thu", value: 16 },
  { label: "Fri", value: 12 },
  { label: "Sat", value: 18 },
];
const NEW_REPORT_MAX = 20;

function NewDonutChart() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center gap-5">
      <div className="relative shrink-0 w-[96px] h-[96px]">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          className={`transition-all duration-700 ease-out ${
            shown ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-180"
          }`}
        >
          <g transform="rotate(-90 48 48)">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
            {NEW_DONUT_SEGMENTS.map((seg) => {
              const len = (seg.value / 100) * circumference;
              const el = (
                <circle
                  key={seg.label}
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${circumference - len}`}
                  strokeDashoffset={-cumulative}
                />
              );
              cumulative += len;
              return el;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[18px] font-bold text-slate-900 leading-none">{NEW_DONUT_SEGMENTS[0]!.value}%</div>
          <div className="text-[8px] text-slate-400 uppercase tracking-wide mt-0.5">approved</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Order status</div>
        {NEW_DONUT_SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
            {seg.label} · {seg.value}%
          </div>
        ))}
      </div>
    </div>
  );
}

function NewDashboard() {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        {NEW_STATS.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
            <div className="text-[10px] text-slate-400">{stat.label}</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <div className="text-[16px] text-slate-900 font-bold">{stat.value}</div>
              <span
                className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                  stat.trend === "up" ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {stat.trend === "up" ? "▲" : "▼"} {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
      <NewDonutChart />
    </div>
  );
}

function NewTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-[11px] text-slate-700">
        <thead>
          <tr className="bg-slate-50 text-slate-400">
            {head.map((h) => (
              <th key={h} className="text-left font-medium px-3 py-1.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-slate-100">
              {row.map((cell, i) => (
                <td key={i} className="px-3 py-1.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const REPORT_GRID_STEPS = [20, 15, 10, 5, 0];

function NewReports() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-2 h-2 rounded-full shrink-0 bg-gradient-to-t from-violet-600 to-indigo-400" />
          Orders per day
        </div>
        <span className="text-[10px] font-semibold text-emerald-600">▲ +18% vs last week</span>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-[9px] text-slate-400 h-[130px] pb-[18px] pr-1 text-right">
          {REPORT_GRID_STEPS.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="relative flex-1 h-[130px]">
          {REPORT_GRID_STEPS.map((n) => (
            <div
              key={n}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ bottom: `${18 + (n / NEW_REPORT_MAX) * (130 - 18)}px` }}
            />
          ))}
          <div className="relative h-[112px] flex items-end gap-2">
            {NEW_REPORT_BARS.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[9px] text-slate-500 font-medium mb-1">{bar.value}</span>
                <div
                  className="w-full bg-gradient-to-t from-violet-600 to-indigo-400 rounded-t-md"
                  style={{ height: `${(bar.value / NEW_REPORT_MAX) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            {NEW_REPORT_BARS.map((bar) => (
              <span key={bar.label} className="flex-1 text-center text-[9px] text-slate-400">
                {bar.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewSettings() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
      {[
        ["Company", "Acme Corp"],
        ["Currency", "USD"],
        ["Timezone", "UTC-3"],
      ].map(([label, value]) => (
        <label key={label} className="block">
          <div className="text-[10px] text-slate-400 mb-1">{label}</div>
          <input readOnly value={value} className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
        </label>
      ))}
    </div>
  );
}

function NewUI({ page, onNavigate }: SystemPageProps) {
  return (
    <div className="w-full h-full overflow-hidden shadow-2xl flex flex-col rounded-xl" style={{ boxShadow: "0 25px 60px -12px rgba(124,58,237,.35)" }}>
      <div className="bg-[#eceef2] px-4 py-2.5 flex items-center gap-2 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 font-sans">
          checkout.app/orders/4471
        </span>
      </div>
      <div className="flex flex-1 min-h-0 font-sans">
        <div className="w-[156px] shrink-0 bg-slate-900 flex flex-col py-4">
          <div className="flex items-center gap-2 px-4 mb-5">
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500" />
            <span className="text-[12px] font-semibold text-white">Checkout</span>
          </div>
          {NEW_NAV.map((item) => (
            <div
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-2 px-4 py-1.5 text-[11px] cursor-pointer ${
                item.label === page
                  ? "bg-indigo-500/20 text-white border-r-2 border-indigo-400 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-[11px]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        {page === "Dashboard" && (
          <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
            <div className="text-[14px] font-semibold text-slate-900 mb-3">Dashboard</div>
            <NewDashboard />
          </div>
        )}
        {page === "Customers" && (
          <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
            <div className="text-[14px] font-semibold text-slate-900 mb-3">Customers</div>
            <NewTable head={["Name", "Email", "Orders"]} rows={NEW_CUSTOMERS} />
          </div>
        )}
        {page === "Inventory" && (
          <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
            <div className="text-[14px] font-semibold text-slate-900 mb-3">Products</div>
            <NewTable head={["SKU", "Name", "Stock"]} rows={NEW_PRODUCTS} />
          </div>
        )}
        {page === "Reports" && (
          <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
            <div className="text-[14px] font-semibold text-slate-900 mb-3">Reports · Orders / week</div>
            <NewReports />
          </div>
        )}
        {page === "Settings" && (
          <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
            <div className="text-[14px] font-semibold text-slate-900 mb-3">Settings</div>
            <NewSettings />
          </div>
        )}
        {page === "Orders" && (
        <div className={`flex-1 bg-slate-50 p-4 overflow-y-auto ${NEW_SCROLL}`} style={NEW_SCROLL_STYLE}>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2.5">
            <span>Orders</span>
            <span>/</span>
            <span className="text-slate-600">#4471</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-slate-900">Order #4471</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Pending
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3.5 mb-2.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">Customer *</div>
                <input readOnly value="A. Ferreira" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">E-mail *</div>
                <input readOnly value="a.f@corp.com" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">Cost center</div>
                <input readOnly value="CC-104 · Marketing" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">GL account</div>
                <input readOnly value="6021-Supplies" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">Payment method</div>
                <input readOnly value="Corp card •4471" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-400 mb-1">Due date</div>
                <input readOnly value="2026-07-15" className="w-full border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none" />
              </label>
            </div>
            <div className="flex items-start gap-1.5 mt-2.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
              <span>⚠</span>
              <span>GL account must match the cost center&apos;s approved mapping</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3.5">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <div className="text-[12px] text-slate-800 font-medium">Widget</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center border-2 border-slate-300 rounded-lg overflow-hidden">
                    <span className="w-5 h-5 flex items-center justify-center text-slate-500 font-medium text-[12px] cursor-pointer">−</span>
                    <span className="w-6 h-5 flex items-center justify-center text-[12px] text-slate-800 font-medium border-x-2 border-slate-300">2</span>
                    <span className="w-5 h-5 flex items-center justify-center text-slate-500 font-medium text-[12px] cursor-pointer">+</span>
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-slate-700 font-medium">$119.90</div>
            </div>
            <div className="flex justify-between py-2 text-[11px] text-slate-500">
              <span>Tax</span>
              <span>$10.00</span>
            </div>
            <div className="flex items-center gap-1.5 py-2 border-t border-slate-100">
              <input
                readOnly
                value=""
                placeholder="Promo code"
                className="w-32 border-2 border-slate-300 rounded-md px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <span className="text-[11px] font-semibold text-indigo-600 px-1 shrink-0">Apply</span>
            </div>
            <div className="flex justify-between items-baseline py-2 mb-2.5">
              <span className="text-[11px] text-slate-500">Total</span>
              <span className="text-lg font-bold text-slate-900">$129.90</span>
            </div>
            <div className="flex gap-2">
              <button className="border-2 border-slate-300 text-slate-600 font-medium text-[11px] px-3 py-1.5 rounded-md">
                Save draft
              </button>
              <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-[11px] px-4 py-1.5 rounded-md shadow-md shadow-violet-600/30">
                Confirm order
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

const EDGE_THRESHOLD = 3;

function RevealCompare({ page, onNavigate }: SystemPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const legacyTagRef = useRef<HTMLDivElement>(null);
  const newTagRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  function setPercent(percent: number) {
    const clamped = Math.min(100, Math.max(0, percent));
    if (revealRef.current) {
      revealRef.current.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    }
    if (lineRef.current) {
      lineRef.current.style.left = `${clamped}%`;
    }
    if (legacyTagRef.current) {
      legacyTagRef.current.style.opacity = clamped <= EDGE_THRESHOLD ? "0" : "1";
    }
    if (newTagRef.current) {
      newTagRef.current.style.opacity = clamped >= 100 - EDGE_THRESHOLD ? "0" : "1";
    }
  }

  function percentFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setHasMoved(true);
    setPercent(percentFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setPercent(percentFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] select-none overflow-hidden rounded-xl"
    >
      {/* base layer, full width: new system */}
      <div className="absolute inset-0">
        <NewUI page={page} onNavigate={onNavigate} />
      </div>
      {/* clipped top layer, visible from the left up to the divider: legacy system */}
      <div ref={revealRef} className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <LegacyUI page={page} onNavigate={onNavigate} />
      </div>

      <div
        ref={legacyTagRef}
        className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[.15em] text-red-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none transition-opacity duration-200"
      >
        Legacy
      </div>
      <div
        ref={newTagRef}
        className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[.15em] text-emerald-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none transition-opacity duration-200"
      >
        New
      </div>

      <div
        ref={lineRef}
        className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center cursor-ew-resize touch-none group"
        style={{ left: "50%", width: "48px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.15)]"
        />
        <div className="relative w-6 h-9 rounded-md bg-white border border-black/10 flex flex-col items-center justify-center gap-[3px] shadow-[0_2px_8px_rgba(0,0,0,.35)] transition-transform group-active:scale-110">
          <span className="h-[2px] w-3 rounded-full bg-slate-400" />
          <span className="h-[2px] w-3 rounded-full bg-slate-400" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
        <span
          className={`font-mono text-[11px] uppercase tracking-wide text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm transition-opacity duration-300 ${
            hasMoved ? "opacity-0" : "opacity-100"
          }`}
        >
          Drag to compare
        </span>
      </div>
    </div>
  );
}

export default function LegacyVsNew() {
  const { t } = useI18n();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [page, setPage] = useState("Orders");

  const delay = (ms: number) => (inView ? { transitionDelay: `${ms}ms` } : undefined);

  const legacyPage = LEGACY_PAGES[page] ?? LEGACY_PAGES.Orders!;
  const newPage = NEW_PAGES[page] ?? NEW_PAGES.Orders!;

  const legacyRevealed = useLineReveal(legacyPage.lines.length, inView, 400, page);
  const newStartDelay = 400 + legacyPage.lines.length * LINE_REVEAL_MS + 500;
  const newRevealed = useLineReveal(newPage.lines.length, inView, newStartDelay, page);

  return (
    <section id="compare" ref={ref} className="px-6 py-28 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
          {t.legacyVsNew.title}
        </h2>
        <p className="text-[#8fb3cc] text-[16px] max-w-xl mx-auto">{t.legacyVsNew.body}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-4">
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-red-400 mb-1">
          {t.legacyVsNew.legacyLabel}
        </div>
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-emerald-400 mb-1">
          {t.legacyVsNew.newLabel}
        </div>

        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(0)}>
          <CodeEditor
            filename={legacyPage.filename}
            lines={legacyPage.lines}
            badge={legacyPage.badge}
            badgeColor={legacyPage.badgeColor}
            revealed={legacyRevealed}
          />
        </div>
        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(150)}>
          <CodeEditor
            filename={newPage.filename}
            lines={newPage.lines}
            badge={newPage.badge}
            badgeColor={newPage.badgeColor}
            revealed={newRevealed}
          />
        </div>
      </div>

      <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(300)}>
        <RevealCompare page={page} onNavigate={setPage} />
      </div>
    </section>
  );
}
