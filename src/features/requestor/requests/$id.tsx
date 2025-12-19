import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Hash,
  Info,
  Mail,
  MapPin,
  Package,
  Paperclip,
  Printer,
  ShieldCheck,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";

// --- Types (Preserved) ---
type Unit = { id: number; name: string; description: string };
type Currency = { id: number; name: string; description: string };

type MoqOption = {
  id: number;
  moq: string;
  price: string;
  leadtime: string;
  remarks: string | null;
  unit: Unit;
  currency: Currency;
};

type Item = {
  id: number;
  code: string;
  name: string;
  moq: MoqOption[];
};

type Department = {
  id: number;
  name: string;
};

type Requestor = {
  id: number;
  name: string;
  code: string;
  department: Department;
};

type Attachment = {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  category: "requestor" | "vendor";
};

type QuotationData = {
  id: number;
  quotation_number: string;
  project: string;
  purpose: string;
  deadline: string;
  purchaser: string;
  address_1: string;
  name_1: string;
  name_2: string;
  status: string;
  requestor_id: number;
  items: Item[];
  requestor: Requestor;
  attachments?: Attachment[];
  vendor: {
    id: number;
    name: string;
    code: string;
    email: string;
  };
};

const QuotationRequestSlug = ({ data }: { data: QuotationData }) => {
  const requestorFiles =
    data.attachments?.filter((f) => f.category === "requestor") || [];
  const vendorFiles =
    data.attachments?.filter((f) => f.category === "vendor") || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const formatPrice = (amount: string, currency: string) => {
    const num = Number.parseFloat(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(num);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved")
      return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
    if (s === "pending")
      return "bg-amber-50 text-amber-700 border-amber-200 shadow-sm";
    if (s === "rejected")
      return "bg-rose-50 text-rose-700 border-rose-200 shadow-sm";
    return "bg-secondary text-secondary-foreground border shadow-sm";
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans text-foreground">
      {/* --- Compact Navigation --- */}
      <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border h-14 flex items-center shadow-lg shadow-primary/5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={"/requestor/requests"}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="h-5 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground font-mono tracking-tight">
                {data.quotation_number}
              </span>
              <Badge
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(data.status)}`}
              >
                {data.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-border hover:bg-accent"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card p-5 rounded-xl border border-border shadow-xl shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/80" />
              <div className="relative">
                <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
                  {data.project}
                </h1>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed text-pretty">
                  {data.purpose}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Requested Items
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] h-5 bg-secondary px-1.5"
                  >
                    {data.items.length}
                  </Badge>
                </h3>
              </div>

              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="px-4 py-3 bg-accent/30 border-b border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-foreground leading-tight">
                          {item.name}
                        </div>
                        <div className="mt-1 text-[10px] font-bold text-primary/80 uppercase tracking-tight">
                          CODE: {item.code}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full text-xs text-left bg-card overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase">
                        <div className="col-span-2">MOQ</div>
                        <div className="col-span-2">Unit</div>
                        <div className="col-span-3 text-right">Unit Price</div>
                        <div className="col-span-2 text-center">Lead Time</div>
                        <div className="col-span-3 text-right">Remarks</div>
                      </div>

                      <div className="divide-y divide-border/50">
                        {item.moq.map((opt) => (
                          <div
                            key={opt.id}
                            className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-accent/30"
                          >
                            <div className="col-span-2 font-mono font-bold text-sm">
                              {opt.moq}
                            </div>
                            <div className="col-span-2 text-muted-foreground">
                              {opt.unit.name}
                            </div>
                            <div className="col-span-3 text-right">
                              <div className="col-span-3 text-right">
                                {opt.price && opt.currency?.name ? (
                                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    {formatPrice(opt.price, opt.currency.name)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-amber-600 font-bold uppercase">
                                    TBD
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2 text-center">
                              {opt.leadtime ? (
                                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                                  {opt.leadtime} Days
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-600 font-bold uppercase">
                                  TBD
                                </span>
                              )}
                            </div>
                            <div className="col-span-3 text-right">
                              {opt.remarks ? (
                                <div className="flex items-center justify-end gap-1.5 text-muted-foreground italic text-[11px] truncate">
                                  {opt.remarks}
                                  <Info className="w-3 h-3 shrink-0" />
                                </div>
                              ) : (
                                <span className="text-muted-foreground/30">
                                  —
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            <Card className="shadow-sm border-border bg-card">
              <CardHeader className="py-3 px-4 bg-accent/30 border-b border-border">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Vendor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                      Company Name
                    </p>
                    <h3 className="text-base font-bold text-foreground leading-tight truncate">
                      {data.vendor.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 bg-accent/20 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-mono font-semibold">
                        {data.vendor.code}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs truncate group-hover:text-primary transition-colors">
                        {data.vendor.email}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/30" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    Deadline
                  </div>
                  <span className="font-mono font-bold text-sm text-foreground bg-secondary px-2 py-1 rounded border border-border">
                    {formatDate(data.deadline)}
                  </span>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-amber-600 mt-1" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-amber-600 uppercase">
                        Requestor
                      </p>
                      <p className="text-sm font-bold truncate">
                        {data.requestor.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {data.requestor.department.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-amber-600 uppercase">
                        Purchaser
                      </p>
                      <p className="text-sm font-bold truncate">
                        {data.purchaser}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-4 flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-3 min-w-0">
                  <div>
                    <p className="text-[10px] font-bold text-teal-600 uppercase mb-0.5">
                      Delivery Address
                    </p>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">
                      {data.address_1}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border space-y-2">
                    <p className="text-[10px] text-muted-foreground font-medium italic truncate">
                      Dest: {data.name_1}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium italic truncate">
                      Attn: {data.name_2}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(requestorFiles.length > 0 || vendorFiles.length > 0) && (
              <Card className="shadow-sm border-border bg-card">
                <CardHeader className="py-3 px-4 border-b">
                  <CardTitle className="text-[11px] font-bold uppercase flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5" />
                    Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {[...requestorFiles, ...vendorFiles].map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent group transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium truncate group-hover:text-primary">
                          {file.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          {file.size}
                        </p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationRequestSlug;
