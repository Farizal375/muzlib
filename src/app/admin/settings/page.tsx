import { getTrendingLimit } from "@/actions/admin-settings-actions";
import { TrendingForm } from "./trending-form";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export const metadata = { title: "Pengaturan Sistem | Admin" };

export default async function AdminSettingsPage() {
  // Ambil data limit saat ini dari Server
  const currentLimit = await getTrendingLimit();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Settings className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pengaturan Sistem</h1>
          <p className="text-slate-500 text-sm">Kelola konfigurasi global aplikasi MuzLib.</p>
        </div>
      </div>

      {/* Grid untuk Widget Pengaturan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget 1: Trending Limit */}
        <TrendingForm initialLimit={currentLimit} />

        {/* Widget 2: Placeholder untuk setting lain (misal: Maintenance Mode) */}
        <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
          Pengaturan lainnya akan segera hadir...
        </div>
      </div>
    </div>
  );
}