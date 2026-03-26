import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY!;
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUBLICATION_ID!;
const FROM_ADDRESS = "hello@quietdissent.com";

// ── Welcome email HTML ───────────────────────────────────────────────────────

function welcomeHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Welcome to The Dissenter</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background:#111111;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:540px;background:#1A1A1A;border-radius:8px;
                      border:1px solid rgba(255,255,255,0.07);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 2px;font-family:'Courier New',Courier,monospace;
                         font-size:10px;color:#5F8575;letter-spacing:0.14em;
                         text-transform:uppercase;">Quiet Dissent</p>
              <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;
                           font-size:22px;color:#FFFFF0;letter-spacing:-0.01em;">
                The Dissenter
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,
                         'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;
                         line-height:1.75;color:#FFFFF0;">
                You&rsquo;re in.
              </p>
              <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,
                         'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;
                         line-height:1.75;color:#C8C8C3;">
                The Dissenter is straight talk on AI for small businesses &mdash; no hype,
                no jargon, just what&rsquo;s actually useful.
              </p>
              <p style="margin:0 0 32px;font-family:-apple-system,BlinkMacSystemFont,
                         'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;
                         line-height:1.75;color:#C8C8C3;">
                I&rsquo;ll be in touch when there&rsquo;s something worth saying.
              </p>

              <div style="border-top:1px solid rgba(255,255,255,0.08);margin:0 0 28px;"></div>

              <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,
                         'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;
                         color:#5F8575;">
                &mdash; Bailey
              </p>
              <p style="margin:0;font-family:'Courier New',Courier,monospace;
                         font-size:12px;color:#555552;letter-spacing:0.06em;
                         text-transform:uppercase;">
                Quiet Dissent&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                <a href="https://quietdissent.com"
                   style="color:#555552;text-decoration:none;">quietdissent.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;
                         font-size:11px;color:#3A3A38;letter-spacing:0.04em;">
                You subscribed at quietdissent.com &mdash;
                <a href="https://quietdissent.com" style="color:#3A3A38;text-decoration:none;">
                  unsubscribe
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const welcomeText = `You're in.

The Dissenter is straight talk on AI for small businesses — no hype, no jargon, just what's actually useful.

I'll be in touch when there's something worth saying.

— Bailey
Quiet Dissent | quietdissent.com`;

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { email?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // ── 1. Add subscriber to Beehiiv ──────────────────────────────────────────
  let beehiivOk = false;

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          // send_welcome_email: true lets Beehiiv fire its own welcome if one
          // is configured in publication settings. Resend welcome below handles
          // the immediate branded confirmation regardless.
          send_welcome_email: true,
        }),
      }
    );

    if (!beehiivRes.ok) {
      const detail = await beehiivRes.text().catch(() => "");
      console.error(`[subscribe] Beehiiv ${beehiivRes.status}:`, detail);
      return NextResponse.json(
        { error: "Could not add subscription. Please try again." },
        { status: 502 }
      );
    }

    beehiivOk = true;
  } catch (err) {
    console.error("[subscribe] Beehiiv fetch error:", err);
    return NextResponse.json({ error: "Network error. Please try again." }, { status: 502 });
  }

  // ── 2. Send Resend welcome (best-effort — subscriber is already added) ─────
  if (beehiivOk) {
    try {
      const { error: resendError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: "Welcome to The Dissenter",
        html: welcomeHtml(),
        text: welcomeText,
      });

      if (resendError) {
        // Non-fatal — log it but still return success to the user
        console.error("[subscribe] Resend welcome error:", resendError.message);
      }
    } catch (err) {
      console.error("[subscribe] Resend exception:", err);
    }
  }

  return NextResponse.json({ success: true });
}
