import { dbConnect } from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import Business from "@/models/Business";
import { withAuth } from "@/lib/withAuth";
import * as XLSX from "xlsx";

export const POST = withAuth(async (req, user) => {
  await dbConnect();

  const { businessSlug, status } = await req.json();

  if (!businessSlug) {
    return new Response(JSON.stringify({ message: "Business slug is required" }), { status: 400 });
  }

  const business = await Business.findOne({ slug: businessSlug });
  if (!business) {
    return new Response(JSON.stringify({ message: "Business not found" }), { status: 404 });
  }

  const filter = { business: business._id };
  if (status) filter.status = status;

  const polls = await Poll.find(filter);

  if (polls.length === 0) {
    return new Response(JSON.stringify({ message: "No polls found for this business and status" }), { status: 404 });
  }

  const maxOptions = Math.max(...polls.map(p => p.options.length));

  // Header Rows
  const headerRow1 = ["Business", "Status", "Question"];
  const headerRow2 = ["", "", ""];

  for (let i = 1; i <= maxOptions; i++) {
    headerRow1.push(`Option ${i}`, "", "");
    headerRow2.push("Text", "Votes", "%");
  }
  headerRow1.push("Total Votes");
  headerRow2.push("");

  const wsData = [headerRow1, headerRow2];

  // ✅ Build data rows
  polls.forEach(poll => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const row = [business.slug, poll.status, poll.question];

    poll.options.forEach(option => {
      const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) : "0.00";
      row.push(option.text, option.votes, percentage);
    });

    // Fill empty cells if this poll has fewer options than maxOptions
    const missingOptions = maxOptions - poll.options.length;
    for (let i = 0; i < missingOptions; i++) {
      row.push("", "", "");
    }

    row.push(totalVotes);
    wsData.push(row);
  });

  // ✅ Create worksheet and merge cells
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ✅ Correct merge logic: Option 1 starts at column 3 (0-based)
  for (let i = 1; i <= maxOptions; i++) {
    const startCol = 3 + (i - 1) * 3; // ✅ FIXED: no +1 here
    const endCol = startCol + 2;
    ws["!merges"] = ws["!merges"] || [];
    ws["!merges"].push({
      s: { r: 0, c: startCol }, // Row 0, start column
      e: { r: 0, c: endCol },   // Row 0, end column
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Poll Results`);

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${business.slug}-polls.xlsx"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}, ["admin", "superadmin", "business"]);
