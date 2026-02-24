export const welcomeEmailTemplate = (firstName, email, token) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email - OverClocked</title>
    <style>
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes rgbGlow {
        0% {
          box-shadow:
            0 0 10px #ff0000,
            0 0 20px #ff0000;
        }
        33% {
          box-shadow:
            0 0 10px #00ff00,
            0 0 20px #00ff00;
        }
        66% {
          box-shadow:
            0 0 10px #0000ff,
            0 0 20px #0000ff;
        }
        100% {
          box-shadow:
            0 0 10px #ff0000,
            0 0 20px #ff0000;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      .animate-card {
        animation: fadeInUp 0.8s ease-out;
      }

      .animate-left {
        animation: slideInLeft 0.6s ease-out;
      }

      .animate-right {
        animation: slideInRight 0.6s ease-out;
      }

      .rotate-gear {
        display: inline-block;
        animation: rotate 4s linear infinite;
      }

      .pulse-icon {
        animation: pulse 2s ease-in-out infinite;
      }

      .bounce-icon {
        animation: bounce 2s ease-in-out infinite;
      }

      .verify-button {
        transition: all 0.4s ease;
        animation: rgbGlow 3s ease-in-out infinite;
      }

      .verify-button:hover {
        transform: scale(1.08) translateY(-3px);
        animation: none;
        box-shadow:
          0 0 30px #00ff88,
          0 15px 40px rgba(0, 255, 136, 0.5) !important;
      }

      .feature-card {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
      }

      .feature-card:hover {
        transform: translateY(-8px) scale(1.03);
      }

      .feature-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transition: left 0.5s;
      }

      .feature-card:hover::before {
        left: 100%;
      }

      .circuit-pattern {
        background-image:
          linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background: linear-gradient(
        135deg,
        #0a0a0a 0%,
        #1a1a2e 50%,
        #16213e 100%
      );
      font-family: &quot;Segoe UI&quot;, Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 30px 15px">
          <!-- Main Card with Dark Theme -->
          <table
            class="animate-card"
            width="550"
            cellpadding="0"
            cellspacing="0"
            style="
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              border-radius: 16px;
              overflow: hidden;
              box-shadow:
                0 15px 50px rgba(0, 255, 136, 0.3),
                0 0 100px rgba(0, 0, 0, 0.8);
              border: 1px solid rgba(0, 255, 136, 0.2);
            "
          >
            <!-- Header with Circuit Background -->
            <tr>
              <td
                class="circuit-pattern"
                style="
                  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                  padding: 30px 20px;
                  text-align: center;
                  border-bottom: 2px solid #00ff88;
                  position: relative;
                "
              >
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="60" align="left" valign="middle">
                      <div class="rotate-gear" style="font-size: 36px">⚙️</div>
                    </td>
                    <td align="center" valign="middle">
                      <h1
                        style="
                          margin: 0;
                          color: #00ff88;
                          font-size: 22px;
                          font-weight: 700;
                          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                        "
                      >
                        OverClocked
                      </h1>
                      <p
                        style="
                          margin: 5px 0 0 0;
                          color: #8892b0;
                          font-size: 12px;
                          letter-spacing: 1px;
                        "
                      >
                        PREMIUM HARDWARE STORE
                      </p>
                    </td>
                    <td width="60" align="right" valign="middle">
                      <div
                        class="rotate-gear"
                        style="font-size: 36px; animation-direction: reverse"
                      >
                        🔧
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Welcome Section -->
            <tr>
              <td style="padding: 30px 25px 20px 25px; text-align: center">
                <h2
                  style="
                    margin: 0 0 10px 0;
                    color: #ccd6f6;
                    font-size: 24px;
                    font-weight: 700;
                  "
                >
                  🙏 Welcome, ${firstName}!
                </h2>
                <p
                  style="
                    margin: 0;
                    color: #8892b0;
                    font-size: 14px;
                    line-height: 1.6;
                  "
                >
                  Thank you for joining OverClocked! Click below to verify your
                  email and unlock access to premium PC components.
                </p>
              </td>
            </tr>

            <!-- Verify Button Section -->
            <tr>
              <td style="padding: 0 25px 25px 25px; text-align: center">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a
                        href="http://localhost:5173/verify/${token}"
                        class="verify-button"
                        style="
                          display: inline-block;
                          background: linear-gradient(
                            135deg,
                            #00ff88 0%,
                            #00cc6f 50%
                          );
                          color: #0a0a0a;
                          padding: 16px 50px;
                          text-decoration: none;
                          border-radius: 12px;
                          font-weight: 700;
                          font-size: 16px;
                          letter-spacing: 1px;
                          text-transform: uppercase;
                          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                        "
                      >
                        ✅ Verify Email Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 15px">
                      <p style="margin: 0; color: #64748b; font-size: 11px">
                        This link will expire in 24 hours
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Account Info -->
            <tr>
              <td style="padding: 0 25px 25px 25px">
                <table
                  class="animate-left"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: linear-gradient(
                      135deg,
                      #0f3460 0%,
                      #1a1a2e 100%
                    );
                    border-radius: 12px;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                  "
                >
                  <tr>
                    <td style="padding: 20px">
                      <p
                        style="
                          margin: 0 0 15px 0;
                          color: #00ff88;
                          font-size: 13px;
                          font-weight: 700;
                          letter-spacing: 1px;
                        "
                      >
                        📧 YOUR EMAIL ADDRESS
                      </p>
                      <p
                        style="
                          margin: 0;
                          color: #ccd6f6;
                          font-size: 15px;
                          font-weight: 600;
                        "
                      >
                        ${email}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Why Choose Us -->
            <tr>
              <td style="padding: 20px 25px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);

                    background: linear-gradient(
                      135deg,
                      rgba(0, 255, 136, 0.1) 0%,
                      rgba(0, 255, 136, 0.05) 100%
                    );
                    border-radius: 10px;
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    padding: 20px;
                  "
                >
                  <tr>
                    <td>
                      <p
                        style="
                          margin: 0 0 12px 0;
                          color: #00ff88;
                          font-size: 14px;
                          font-weight: 700;
                          text-align: center;
                        "
                      >
                        ⭐ Why Choose OverClocked?
                      </p>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td
                            width="50%"
                            style="color: #ccd6f6; font-size: 12px"
                          >
                            ✓ Authentic Products
                          </td>
                          <td
                            width="50%"
                            style="color: #ccd6f6; font-size: 12px"
                          >
                            ✓ Best Prices
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #ccd6f6; font-size: 12px">
                            ✓ Fast Delivery
                          </td>
                          <td style="color: #ccd6f6; font-size: 12px">
                            ✓ 24/7 Support
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="circuit-pattern"
                style="
                  background: linear-gradient(135deg, #0a0a0a 0%, #0f3460 100%);
                  padding: 20px;
                  text-align: center;
                  border-top: 2px solid #00ff88;
                "
              >
                <p style="margin: 0 0 10px 0; color: #8892b0; font-size: 11px">
                  Need help?
                  <a
                    href="https://patelmann.me"
                    target="_blank"
                    style="
                      color: #00ff88;
                      text-decoration: none;
                      font-weight: 600;
                    "
                  >
                    Contact Support
                  </a>
                </p>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 10px">
                  © 2026 OverClocked | All Rights Reserved
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
