"use client";

import { useVendorId } from "@/api/vendor-id";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { ModeToggle } from "@/components/toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusStyles } from "@/lib/utils";
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Hash,
  Mail,
  MapPin,
  Search,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Requests } from "./components/schema";

export default function VendorId({ id }: { id: number }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Using mock data for demonstration
  const { data, isLoading } = useVendorId({ id });
  if (isLoading) return <p>Loading</p>;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading vendor data...</span>
        </div>
      </div>
    );
  }

  const filteredQuotations = data.data.quotations.filter(
    (q: Requests) =>
      q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.purchaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Vendor Info Section */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Info Card */}
          <Card className="md:col-span-2 border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      {data.data.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-sm">
                        <Hash className="h-3.5 w-3.5" />
                        {data.data.code}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            {data.data.email && (
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{data.data.email}</span>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stats Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider">
                Total Quotations
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">
                {data.data.quotations.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>quotations on file</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations Table Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Quotations
                </CardTitle>
                <CardDescription>
                  All quotations associated with this vendor
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quotations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Quotation #
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Purchaser
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Project
                    </TableHead>
                    <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                      Purpose
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Deadline
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation: Requests) => (
                    <TableRow
                      key={`${quotation.quotation_number}-${quotation.id}`}
                      className="border-border transition-colors hover:bg-secondary/30"
                    >
                      <TableCell className="font-mono text-sm font-medium text-primary">
                        {quotation.quotation_number}
                      </TableCell>
                      <TableCell className="font-medium">
                        {quotation.purchaser}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {quotation.project}
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                        {quotation.purpose}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusStyles(quotation.status)} border font-medium`}
                        >
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="max-w-[180px] truncate">
                            {quotation.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{moment(quotation.deadline).format("LL")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4  text-blue-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredQuotations.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No quotations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
