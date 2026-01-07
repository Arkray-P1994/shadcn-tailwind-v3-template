"use client";

import { useFetchFormSettings } from "@/api/fetch-form-settings";
import { Field } from "@/components/forms/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { itemFormSchema, ItemFormValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Package } from "lucide-react";
import {
  Resolver,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
// import { toast } from "sonner";
import { useEditQuotation } from "../../actions/create";
import Spinner from "@/components/loader";
// import { ImportDialog } from "../import-data-button";
// import { exportItemsToXlsx } from "../export-items";
interface EditQuotationFormProps {
  data: {
    id: number;
    quotation_number: string;
    status: string;
    project: string;
    purpose: string;
    deadline: string;
    purchaser: string;
    address_1: string;
    name_1: string;
    name_2: string;
    vendor: {
      name: string;
      code: string;
      email: string;
    };
    requestor: {
      name: string;
      department: { name: string };
    };
    items: ItemFormValues["items"];
  };
}

export function EditQuotationForm({ data }: EditQuotationFormProps) {
  const { data: formSetting, isLoading: formSettingsIsLoading } =
    useFetchFormSettings({ type: "vendor" });

  const { trigger } = useEditQuotation({ id: data.id });

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema) as Resolver<ItemFormValues>,
    defaultValues: { items: data.items },
  });

  const {
    fields: itemFields,
    // ,
    //  append: appendItem
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // const handleImportData = (importedData: any[]) => {
  //   const invalidUnitsSet = new Set<string>();

  //   const formattedItems = importedData.map((item) => {
  //     const formattedMoqs = item.moqs.map((m: any) => {
  //       const importedUnitName = String(m.unit || "")
  //         .trim()
  //         .toLowerCase();
  //       const matchedUnit = formSetting?.data.units.find(
  //         (u: any) => u.name.toLowerCase() === importedUnitName
  //       );

  //       if (!matchedUnit) {
  //         invalidUnitsSet.add(m.unit || "Unknown/Empty");
  //       }

  //       return {
  //         moq: Number(m.quantity) || 0,
  //         unit_id: matchedUnit ? matchedUnit.id : 0,
  //         remarks: m.description || "",
  //       };
  //     });

  //     return {
  //       name: item.item,
  //       code: item.code,
  //       moq: formattedMoqs,
  //     };
  //   });

  //   if (invalidUnitsSet.size > 0) {
  //     const invalidList = Array.from(invalidUnitsSet).join(", ");
  //     toast.error("Import Cancelled: Invalid Units Found", {
  //       description: `Units not in system: "${invalidList}".`,
  //       style: { borderColor: "red", color: "red" },
  //     });
  //     return;
  //   }

  //   appendItem(formattedItems as any);
  //   toast.success("Success", {
  //     description: `${formattedItems.length} items imported successfully.`,
  //   });
  // };

  if (formSettingsIsLoading) return <Spinner />;

  async function onSubmit(values: ItemFormValues) {
    const formData = new FormData();

    // 2. Fix Overload errors: formData.append requires strings or Blobs
    values.items.forEach((item, index) => {
      if (item.id) formData.append(`items[${index}][id]`, String(item.id));

      item.moq.forEach((m, mIndex) => {
        if (m.id)
          formData.append(`items[${index}][moq][${mIndex}][id]`, String(m.id));

        formData.append(`items[${index}][moq][${mIndex}][price]`, `${m.price}`);

        formData.append(
          `items[${index}][moq][${mIndex}][currency_id]`,
          String(m.currency_id)
        );
        formData.append(
          `items[${index}][moq][${mIndex}][leadtime]`,
          String(m.leadtime)
        );
      });
    });

    await trigger(formData);
  }

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

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-background pb-20 font-sans text-foreground">
      <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border h-14 flex items-center shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm font-mono">
                {data.quotation_number}
              </span>
              <Badge
                className={`px-2 py-0.5 text-[10px] ${getStatusBadge(data.status)}`}
              >
                {data.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{data.project}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {data.purpose}
                    </p>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4" /> Items Required
                    </h2>
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={() => exportItemsToXlsx(form.getValues("items"))}
                    >
                      Export to Excel
                    </Button>

                    <ImportDialog handleImportData={handleImportData} /> */}
                  </div>

                  {itemFields.map((itemField, itemIndex) => (
                    <div
                      key={itemField.id}
                      className="mb-6 bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-accent/30 border-b flex justify-between items-center ">
                        <div className="font-bold text-sm">
                          {/* Use form.getValues to safely access specific indices */}
                          Item Name: {form.getValues(`items.${itemIndex}.name`)}
                        </div>
                        {/* 3. Cast itemField as any or ensure your Zod schema includes 'code' */}
                        {form.getValues(`items.${itemIndex}.code`) && (
                          <div className="text-[10px] font-bold text-primary/80">
                            CODE: {form.getValues(`items.${itemIndex}.code`)}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase">
                        <div className="col-span-2">MOQ</div>
                        <div className="col-span-1">Unit</div>
                        <div className="col-span-3 text-center">Unit Price</div>
                        <div className="col-span-2 text-center">Currency</div>
                        <div className="col-span-2 text-center">Lead Time</div>
                        <div className="col-span-2 text-right">Remarks</div>
                      </div>
                      <div className="overflow-x-auto">
                        <div className="min-w-[700px] p-4">
                          <NestedMoqArray
                            form={form}
                            nestIndex={itemIndex}
                            curr={formSetting?.data.currency}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Quotation"}
                  </Button>
                </div>
              </div>

              {/* Sidebar content stays as you had it... */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT: Corrected Types ---
function NestedMoqArray({
  form,
  nestIndex,
  curr,
}: {
  form: UseFormReturn<ItemFormValues>;
  nestIndex: number;
  curr: any;
}) {
  const { fields } = useFieldArray({
    control: form.control,
    name: `items.${nestIndex}.moq`,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, k) => (
        <div className="grid grid-cols-12 gap-2 items-center hover:bg-accent/30 p-2 rounded">
          <div className="col-span-2 font-mono font-bold text-sm">
            {form.watch(`items.${nestIndex}.moq.${k}.moq`) ?? "-"}
          </div>

          <div className="col-span-1 text-muted-foreground">
            {(field as any).unit?.name ?? "-"}
          </div>

          <div className="col-span-3">
            <Field
              control={form.control}
              name={`items.${nestIndex}.moq.${k}.price`}
              variant="input"
              type="number"
              label=""
            />
          </div>

          <div className="col-span-2">
            <Field
              control={form.control}
              name={`items.${nestIndex}.moq.${k}.currency_id`}
              variant="select"
              options={curr}
              label=""
            />
          </div>

          <div className="col-span-2 flex items-center space-x-2">
            <Field
              control={form.control}
              name={`items.${nestIndex}.moq.${k}.leadtime`}
              variant="input"
              type="number"
              label=""
            />
            <span className="text-sm text-gray-700">day/s</span>
          </div>

          <div className="col-span-2 text-right text-xs">
            {(field as any).remarks ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditQuotationForm;
