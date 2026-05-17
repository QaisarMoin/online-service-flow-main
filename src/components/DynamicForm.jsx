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

export function DynamicForm({ schema, onSubmit, isSubmitting }) {
  // Build Zod validation schema dynamically
  const formSchemaObject = {};
  schema.forEach((field) => {
    let fieldSchema = z.any();
    
    if (field.type === "text" || field.type === "textarea" || field.type === "email") {
      fieldSchema = z.string();
      if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      if (field.type === "email") fieldSchema = fieldSchema.email("Invalid email address");
    } else if (field.type === "number") {
      fieldSchema = z.number();
    } else if (field.type === "file" || field.type === "image" || field.type === "pdf") {
      fieldSchema = z.any(); // Handled separately or as file object
      if (field.required) fieldSchema = fieldSchema.refine((val) => val && val.length > 0, `${field.label} is required`);
    }

    formSchemaObject[field._id || field.label] = fieldSchema;
  });

  const form = useForm({
    resolver: zodResolver(z.object(formSchemaObject)),
    defaultValues: {},
  });

  const renderField = (field) => {
    const fieldName = field._id || field.label;

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...form.register(fieldName)}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            {...form.register(fieldName)}
          />
        );
      case "select":
        return (
          <Select onValueChange={(val) => form.setValue(fieldName, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
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
            accept={field.type === "pdf" ? ".pdf" : field.type === "image" ? "image/*" : "*"}
            onChange={(e) => form.setValue(fieldName, e.target.files)}
          />
        );
      default:
        return <Input placeholder="Unknown field type" />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {schema.sort((a, b) => a.order - b.order).map((field) => (
          <FormField
            key={field._id || field.label}
            control={form.control}
            name={field._id || field.label}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && "*"}</FormLabel>
                <FormControl>
                  {renderField(field)}
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
