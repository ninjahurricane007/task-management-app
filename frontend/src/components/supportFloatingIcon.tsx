"use client";

import { useAuthStore } from "@/store/authStore";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloseIcon from '@mui/icons-material/Close';

export default function SupportFloatingIcon() {
  const { isLogin, hasHydrated } = useAuthStore();
  const [showQrCode, setShowQrCode] = useState(false)

  if (!hasHydrated || !isLogin) return null;

  return (
    <>
    <Tooltip title="Support Me">
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            paddingTop: "5px",
            paddingLeft: "5px",
            paddingRight: "5px",
            paddingBottom: "0px",
            cursor: "pointer",
          }}
          onClick={() => setShowQrCode(true)}
        >
          <QrCode2Icon
            style={{ fontSize: 40, color: "#000", paddingBottom: 0 }}
          />
        </div>
      </Tooltip>
      {showQrCode && (
        <div
          onClick={() => setShowQrCode(false)}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            zIndex: 1001,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setShowQrCode(false)}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              color: "#333",
            }}
            aria-label="Close QR"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          
          <Image
            src="/payment_qr_code.jpg"
            alt="Support Me"
            height={400}
            width={290}
          />
        </div>
      )}
    </>
  )
}
