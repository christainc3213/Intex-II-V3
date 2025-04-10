import { useEffect, useState } from "react";
import axios from "axios";

export default function Enable2FA() {
  const [svg, setSvg] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: Get the QR code and secret key from backend
    axios
      .get("https://localhost:5500/api/mfa/qrcode", { withCredentials: true })
      .then((res) => {
        setSvg(res.data.svg);
        setSecretKey(res.data.secretKey);
        setLoading(false);
      })
      .catch((err) => {
        setStatus("Failed to load QR code");
        setLoading(false);
      });
  }, []);

  const handleVerify = async () => {
    if (!code) {
      setStatus("Please enter the 6-digit code");
      return;
    }

    try {
      const res = await axios.post(
        "https://localhost:5001/api/mfa/verify",
        {
          code,
          secretKey, // optional — remove if you store it server-side
        },
        { withCredentials: true }
      );

      setStatus(res.data.message || "2FA enabled!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Invalid code or server error");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "auto" }}>
      <h2>Enable Two-Factor Authentication</h2>
      {loading && <p>Loading QR code...</p>}

      {!loading && (
        <>
          <p>
            Scan this QR code with Microsoft Authenticator or Google
            Authenticator.
          </p>
          {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}

          <p>Then enter the 6-digit code:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            style={{ padding: "0.5rem", fontSize: "1.1rem" }}
          />
          <br />
          <button
            onClick={handleVerify}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            Verify Code
          </button>

          {status && (
            <p
              style={{
                marginTop: "1rem",
                color: status.includes("success") ? "green" : "red",
              }}
            >
              {status}
            </p>
          )}
        </>
      )}
    </div>
  );
}
