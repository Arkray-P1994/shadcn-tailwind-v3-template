"use client";

import { useFetchUser } from "@/api/fetch-user";
import { DatePicker } from "@/components/date-picker";
import { useCreateQuotation } from "../../actions/create";
// Assuming Field renders a standard Shadcn FormField/Item/Control
import { Field } from "@/components/forms/field";
import { FileUploadField } from "@/components/forms/file-upload";
import { cn, requestFormSchema, RequestFormValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

// --- SHADCN IMPORTS ---
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useFetchFormSettings } from "@/api/fetch-form-settings";
import { ImportDialog } from "../import-data-button";

const purpose = [
  { name: "New Purchase" },
  { name: "Price Investigation" },
  { name: "Market Price Investigation" },
  { name: "Mass Production Use" },
];

export function LedgerCreateForm() {
  const { data, isLoading: formSettingsIsLoading } = useFetchFormSettings();

  const { user } = useFetchUser();
  const { trigger } = useCreateQuotation();
  const [vendorOpen, setVendorOpen] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestor_id: user?.ref_id, // Handled undefined user safely
      purchaser: "",
      project: "",
      purpose: "",
      deadline: new Date(),
      name_1: "",
      name_2: "",
      address_1: "",
      requestor: [], // Attachments
      items: [
        {
          name: "",
          code: "",
          moq: [{ moq: 1, unit_id: 1, remarks: "" }],
        },
      ],
      vendor_id: [1],
    } as any,
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Local state to manage "Show Code" toggle for items
  const [hideCodeStates, setHideCodeStates] = useState(
    itemFields.map(() => false)
  );

  // Sync hideCodeStates when items length changes
  useEffect(() => {
    setHideCodeStates((prev) => {
      // Preserve existing states, default new ones to false (show code hidden by default? or visible?)
      // Current logic: prev[i] ?? false.
      return itemFields.map((_, i) => prev[i] ?? false);
    });
  }, [itemFields.length]);

  // --- IMPORT LOGIC (Preserved) ---
  const handleImportData = (importedData: any[]) => {
    const invalidUnitsSet = new Set<string>();

    const formattedItems = importedData.map((item) => {
      const formattedMoqs = item.moqs.map((m: any) => {
        const importedUnitName = String(m.unit || "")
          .trim()
          .toLowerCase();
        const matchedUnit = data?.data.units.find(
          (u: any) => u.name.toLowerCase() === importedUnitName
        );

        if (!matchedUnit) {
          invalidUnitsSet.add(m.unit || "Unknown/Empty");
        }

        return {
          moq: Number(m.quantity) || 0,
          unit_id: matchedUnit ? matchedUnit.id : 0,
          remarks: m.description || "",
        };
      });

      return {
        name: item.item,
        code: item.code,
        moq: formattedMoqs,
      };
    });

    if (invalidUnitsSet.size > 0) {
      const invalidList = Array.from(invalidUnitsSet).join(", ");
      toast.error("Import Cancelled: Invalid Units Found", {
        description: `Units not in system: "${invalidList}".`,
        style: { borderColor: "red", color: "red" },
      });
      return;
    }

    appendItem(formattedItems);
    toast.success("Success", {
      description: `${formattedItems.length} items imported successfully.`,
    });
  };
  if (formSettingsIsLoading) return <p>loading</p>;

  async function onSubmit(data: RequestFormValues) {
    const formData = new FormData();

    // SCALAR FIELDS
    formData.append("requestor_id", String(data.requestor_id));
    formData.append("purchaser", data.purchaser);
    formData.append("project", data.project);
    formData.append("purpose", data.purpose);
    formData.append("deadline", moment(data.deadline).format("YYYY-MM-DD"));
    formData.append("name_1", data.name_1 ?? "");
    formData.append("name_2", data.name_2 ?? "");
    formData.append("address_1", data.address_1 ?? "");

    // ATTACHMENTS
    if (data.requestor && data.requestor.length > 0) {
      data.requestor.forEach((file) => {
        formData.append("requestor[]", file);
      });
    }

    // ITEMS & NESTED MOQ
    data.items.forEach((item, index) => {
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][code]`, item.code ?? "");

      item.moq.forEach((m, mIndex) => {
        formData.append(`items[${index}][moq][${mIndex}][moq]`, String(m.moq));
        formData.append(
          `items[${index}][moq][${mIndex}][unit_id]`,
          String(m.unit_id)
        );
        formData.append(
          `items[${index}][moq][${mIndex}][remarks]`,
          m.remarks ?? ""
        );
      });
    });

    // VENDORS
    if (data.vendor_id && data.vendor_id.length > 0) {
      data.vendor_id.forEach((vendorId) => {
        formData.append("vendor_id[]", String(vendorId));
      });
    }

    await trigger(formData);
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="bg-muted/40 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            New Quotation Request
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to generate a new request for vendors.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* --- SECTION 1: ITEMS (Priority) --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Items Required</h2>
                <div className="flex items-center gap-2">
                  {/* Import Button */}
                  <ImportDialog handleImportData={handleImportData} />
                  <Button
                    type="button"
                    onClick={() => {
                      appendItem({
                        name: "",
                        code: "",
                        moq: [
                          {
                            moq: 0,
                            unit_id: data?.data.units[0]?.id || 1,
                            remarks: "",
                          },
                        ],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                  </Button>
                </div>
              </div>

              {/* Using standard FormField for the array error message */}
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem className="space-y-4">
                    {itemFields.map((itemField, itemIndex) => {
                      const isCodeHidden = hideCodeStates[itemIndex];

                      return (
                        <Card
                          key={itemField.id}
                          className="border-l-4 border-l-blue-600 shadow-sm"
                        >
                          <CardHeader className="flex flex-row items-center justify-between py-4 pb-2">
                            <CardTitle className="text-base font-semibold">
                              Item #{itemIndex + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(itemIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardHeader>

                          <CardContent className="space-y-6 pt-0">
                            {/* Item Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              {/* Item Name */}
                              <div className="md:col-span-7">
                                <Field
                                  control={form.control}
                                  name={`items.${itemIndex}.name`}
                                  label="Item Name"
                                  placeholder="E.g. Steel Pipes"
                                  variant="input"
                                />
                              </div>

                              {/* Toggle Checkbox */}
                              <div className="md:col-span-2 pt-2 md:pt-9">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`toggle-${itemIndex}`}
                                    checked={!isCodeHidden}
                                    onCheckedChange={(checked) => {
                                      setHideCodeStates((prev) => {
                                        const copy = [...prev];
                                        copy[itemIndex] = !checked;
                                        return copy;
                                      });
                                      if (!checked)
                                        form.setValue(
                                          `items.${itemIndex}.code`,
                                          ""
                                        );
                                    }}
                                  />
                                  <label
                                    htmlFor={`toggle-${itemIndex}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Has Code?
                                  </label>
                                </div>
                              </div>

                              {/* Item Code (Conditional) */}
                              {!isCodeHidden && (
                                <div className="md:col-span-3">
                                  <Field
                                    control={form.control}
                                    name={`items.${itemIndex}.code`}
                                    label="Item Code"
                                    placeholder="Code"
                                    variant="input"
                                  />
                                </div>
                              )}
                            </div>

                            <Separator />

                            {/* MOQ Section */}
                            <div className="bg-muted/30 rounded-md p-3">
                              <NestedMoqArray
                                form={form}
                                nestIndex={itemIndex}
                                units={data?.data.units}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* --- SECTION 2: General Info --- */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>
                      Request details and logistics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      control={form.control}
                      name="purchaser"
                      label="Name (Purchaser)"
                      placeholder="Enter purchaser name"
                      variant="input"
                    />
                    <Field
                      control={form.control}
                      name="project"
                      label="Project Name"
                      placeholder="Enter project name"
                      variant="input"
                    />
                    <Field
                      control={form.control}
                      name="purpose"
                      label="Purpose"
                      placeholder="Enter purpose"
                      variant="select_by_name"
                      selectOptions={purpose}
                    />

                    <div className="flex flex-col gap-2">
                      <DatePicker form={form} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      control={form.control}
                      name="name_1"
                      label="Name 1 (destination) (company)"
                      variant="input"
                    />
                    <Field
                      control={form.control}
                      name="name_2"
                      label="Name 2 (destination) (office, branch, etc.)"
                      variant="input"
                    />
                    <div className="col-span-1 md:col-span-2">
                      <Field
                        control={form.control}
                        name="address_1"
                        label="Address line 1 (destination) (street address, number)"
                        variant="textarea"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* --- SECTION 3: Vendors & Attachments (Sidebar) --- */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="vendor_id"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover
                            open={vendorOpen}
                            onOpenChange={setVendorOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                >
                                  Select vendors...
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search vendor..." />
                                <CommandList>
                                  <CommandEmpty>No vendor found.</CommandEmpty>
                                  <CommandGroup>
                                    {data?.data.vendors.map((vendor: any) => (
                                      <CommandItem
                                        key={vendor.id}
                                        value={vendor.name}
                                        onSelect={() => {
                                          const current = field.value || [];
                                          const next = current.includes(
                                            vendor.id
                                          )
                                            ? current.filter(
                                                (id: number) => id !== vendor.id
                                              )
                                            : [...current, vendor.id];
                                          field.onChange(next);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value?.includes(vendor.id)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{vendor.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {vendor.code}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {/* Selected Vendors Badges */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value && field.value.length > 0 ? (
                              field.value.map((vendorId: number) => {
                                const vendor = data?.data.vendors.find(
                                  (v: any) => v.id === vendorId
                                );
                                if (!vendor) return null;
                                return (
                                  <Badge
                                    key={vendor.id}
                                    variant="secondary"
                                    className="pr-1 py-1"
                                  >
                                    <span className="mr-1">{vendor.name}</span>
                                    <button
                                      type="button"
                                      className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                                      onClick={() => {
                                        field.onChange(
                                          field.value.filter(
                                            (id: number) => id !== vendorId
                                          )
                                        );
                                      }}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                );
                              })
                            ) : (
                              <p className="text-xs text-muted-foreground italic">
                                No vendors selected.
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUploadField
                      form={form}
                      name="requestor"
                      label="Upload Files"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="flex items-center justify-end gap-4 border-t pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => console.log("Cancel")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Quotation"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT: Nested MOQ Table ---
function NestedMoqArray({
  form,
  nestIndex,
  units,
}: {
  form: any;
  nestIndex: number;
  units: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `items.${nestIndex}.moq`,
  });

  return (
    <FormField
      control={form.control}
      name={`items.${nestIndex}.moq`}
      render={() => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              MOQ's
            </FormLabel>
          </div>

          <div className="space-y-2">
            {fields.map((field, k) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-start"
              >
                <div className="col-span-3">
                  <Field
                    control={form.control}
                    name={`items.${nestIndex}.moq.${k}.moq`}
                    label="Quantity"
                    variant="input"
                    type="number"
                  />
                </div>
                <div className="col-span-3">
                  <Field
                    control={form.control}
                    name={`items.${nestIndex}.moq.${k}.unit_id`}
                    label="Unit"
                    placeholder="Unit"
                    variant="select"
                    options={units}
                  />
                </div>
                <div className="col-span-5">
                  <Field
                    control={form.control}
                    name={`items.${nestIndex}.moq.${k}.remarks`}
                    label="Remarks"
                    placeholder="Remarks"
                    variant="input"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(k)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary/90 pl-0 hover:bg-transparent mt-2"
            onClick={() =>
              append({ moq: 0, unit_id: units?.[0]?.id || 1, remarks: "" })
            }
          >
            <Plus className="w-3 h-3 mr-1" /> Add MOQ
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default LedgerCreateForm;
