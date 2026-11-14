"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadSourceButton() {
  const repoUrl = "https://github.com/MZF/wakaftracker-transparency-4-xs";

  return (
    <Button
      className="fixed bottom-6 right-24 z-50 bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-colors"
      size="sm"
      onClick={() => window.open(repoUrl, "_blank")}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Source Code
    </Button>
  );
}
