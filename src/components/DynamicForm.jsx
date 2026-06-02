import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useTranslation } from "@/hooks/useTranslation";

export function DynamicForm({ schema, onSubmit, isSubmitting }) {
  const { t, language } = useTranslation();

  // Helper helpers
  const getFieldLabel = (field) => {
    return language === 'hi' && field.labelHindi ? field.labelHindi : field.label;
  };

  const getFieldPlaceholder = (field) => {
    return language === 'hi' && field.placeholderHindi ? field.placeholderHindi : (field.placeholder || "");
  };

  // Build Zod validation schema dynamically
  const formSchemaObject = {};
  schema.forEach((field) => {
    let fieldSchema = z.any();
    const lLabel = getFieldLabel(field);

    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "email" ||
      field.type === "date" ||
      field.type === "select"
    ) {
      const reqMsg = language === 'hi' ? `${lLabel} आवश्यक है` : `${lLabel} is required`;
      fieldSchema = z.string({ required_error: reqMsg });
      if (field.required) {
        fieldSchema = fieldSchema.min(1, reqMsg);
      } else {
        fieldSchema = fieldSchema.optional();
      }
      if (field.type === "email") {
        const emailMsg = language === 'hi' ? "अमान्य ईमेल पता" : "Invalid email address";
        if (field.required) {
          fieldSchema = fieldSchema.email(emailMsg);
        } else {
          fieldSchema = fieldSchema.refine(
            (val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            emailMsg
          );
        }
      }
    } else if (field.type === "number") {
      const reqMsg = language === 'hi' ? `${lLabel} आवश्यक है` : `${lLabel} is required`;
      const numMsg = language === 'hi' ? `${lLabel} संख्या होनी चाहिए` : `${lLabel} must be a number`;
      fieldSchema = z.preprocess(
        (val) => {
          if (val === "" || val === null || val === undefined) return undefined;
          const num = Number(val);
          return isNaN(num) ? val : num;
        },
        field.required
          ? z.number({
              required_error: reqMsg,
              invalid_type_error: numMsg,
            })
          : z
              .number({
                invalid_type_error: numMsg,
              })
              .optional()
      );
    } else if (
      field.type === "file" ||
      field.type === "image" ||
      field.type === "pdf"
    ) {
      fieldSchema = z.any();
      if (field.required) {
        const reqMsg = language === 'hi' ? `${lLabel} आवश्यक है` : `${lLabel} is required`;
        fieldSchema = fieldSchema.refine(
          (val) => val && val.length > 0,
          reqMsg
        );
      }
    }

    formSchemaObject[field._id || field.label] = fieldSchema;
  });

  const form = useForm({
    resolver: zodResolver(z.object(formSchemaObject)),
    defaultValues: {},
  });

  // Build FormData from form values — separates text fields (as JSON) and file fields (as binary)
  const buildFormData = (data) => {
    const formDataObj = {};
    const fileFields = {};

    schema.forEach((field) => {
      const fieldKey = field._id || field.label;
      const value = data[fieldKey];

      if (
        field.type === "file" ||
        field.type === "image" ||
        field.type === "pdf"
      ) {
        if (value && value.length > 0) {
          fileFields[fieldKey] = value;
        }
      } else {
        if (value !== undefined && value !== "") {
          formDataObj[fieldKey] = value;
        }
      }
    });

    return { formDataObj, fileFields };
  };

  const handleSubmit = (data) => {
    const { formDataObj, fileFields } = buildFormData(data);

    // Pass structured data to parent — parent will build the final FormData or plain object
    onSubmit({ formData: formDataObj, fileFields });
  };

  const renderField = (field) => {
    const fieldName = field._id || field.label;
    const placeholder = getFieldPlaceholder(field);

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <Input
            type={field.type}
            placeholder={placeholder}
            {...form.register(fieldName)}
            className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-11 text-sm bg-card"
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...form.register(fieldName)}
            className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[100px] text-sm bg-card"
          />
        );
      case "select":
        return (
          <Select onValueChange={(val) => form.setValue(fieldName, val)}>
            <SelectTrigger className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-11 text-sm bg-card">
              <SelectValue placeholder={placeholder || (language === 'hi' ? "विकल्प चुनें" : "Select option")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60 bg-card">
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt} className="rounded-lg text-sm my-0.5">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "file":
      case "image":
      case "pdf":
        return (
          <Input
            type="file"
            accept={
              field.type === "pdf"
                ? ".pdf,application/pdf"
                : field.type === "image"
                ? "image/*"
                : "image/*,.pdf"
            }
            onChange={(e) => form.setValue(fieldName, e.target.files)}
            className="file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer h-11 rounded-xl border-border/60 focus-visible:ring-primary/20 text-xs text-muted-foreground bg-card pr-3 pt-2"
          />
        );
      default:
        return <Input placeholder={language === 'hi' ? "अज्ञात फ़ील्ड प्रकार" : "Unknown field type"} className="rounded-xl h-11" />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {schema
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <FormField
              key={field._id || field.label}
              control={form.control}
              name={field._id || field.label}
              render={({ field: formField }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-foreground/80">
                    {getFieldLabel(field)} {field.required && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>{renderField(field)}</FormControl>
                  {field.description && (
                    <FormDescription className="text-[10px] text-muted-foreground/80 leading-normal pt-0.5">
                      {field.description}
                    </FormDescription>
                  )}
                  <FormMessage className="text-xs text-destructive font-semibold" />
                </FormItem>
              )}
            />
          ))}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 transition-all duration-200 font-semibold mt-4" 
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (language === 'hi' ? "आवेदन जमा किया जा रहा है..." : "Submitting Application...") 
            : (language === 'hi' ? "आवेदन जमा करें" : "Submit Application")}
        </Button>
      </form>
    </Form>
  );
}
