import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UploadCloud, FileBarChart, Download } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ... (Inhalt unverändert übernommen – wegen Platz gekürzt)

export default function ReportUploader() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleUpload = () => {
    if (file) {
      setUploaded(true);
      setTimeout(() => setReportReady(true), 2000); // Simulierter Prozess
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Datenqualitätsanalyse", 14, 22);

    doc.setFontSize(12);
    doc.text("Analyseergebnisse:", 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [["Befund", "Anzahl", "Empfehlung"]],
      body: [
        ["Potenzielle Duplikate", "3", "Zusammenführen empfohlen"],
        ["Adresskonflikte", "2", "Manuelle Prüfung"],
        ["Fehlerhafte Telefonnummern", "4", "Formatierung prüfen"]
      ]
    });

    doc.text("Hinweis: Die Analyse basiert auf strukturellen Mustern und soll eine manuelle Prüfung unterstützen.", 14, doc.lastAutoTable.finalY + 10);
    doc.save("Maklerdaten-Analyse.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Datenqualitätsanalyse für Makler
      </motion.h1>
      <Card className="w-full max-w-xl p-4 shadow-xl rounded-2xl">
        <CardContent className="space-y-4">
          {!uploaded && (
            <>
              <div className="flex items-center space-x-2">
                <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <Button onClick={handleUpload} disabled={!file}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Lade eine CSV- oder Excel-Datei hoch mit Kontakt-, Vertrags- oder Umsatzdaten.
              </p>
            </>
          )}
          {uploaded && !reportReady && (
            <div className="flex flex-col items-center text-center">
              <FileBarChart className="h-10 w-10 text-gray-400 animate-pulse" />
              <p className="text-gray-500 mt-2">Analyse läuft... bitte kurz warten.</p>
            </div>
          )}
          {reportReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-green-600">Analyse abgeschlossen!</p>
              <p className="text-sm text-gray-600 mb-4">
                Es wurden 3 potenzielle Duplikate, 2 Adresskonflikte und 4 fehlerhafte Telefonnummern erkannt.
              </p>
              <Button variant="outline" onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" /> Report herunterladen (PDF)
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
